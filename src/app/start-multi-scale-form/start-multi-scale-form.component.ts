import { Component, OnInit } from '@angular/core';
import { PythonService } from '../python.service';
import { ConfigService } from '../config.service'
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectEvent } from '@progress/kendo-angular-upload';

@Component({
    selector: 'start-multi-scale-form',
    templateUrl: './start-multi-scale-form.component.html',
    styleUrls: ['./start-multi-scale-form.component.scss']
})
export class StartMultiScaleFormComponent implements OnInit {

    constructor(private pythonService: PythonService,
        private configService: ConfigService,
        private fb: FormBuilder) { }
    
    // Sliders are not good with enumerated value sets like this - use this array and indicies to manage pointers to the correct values
    // Pre-submission the indicies will be translated to values in this array
    max_dim: number[] = [512, 1024, 2048, 4096, 7096];
    
    // Our parent reactive form object that maps our model to HTML - model can be accessed with this.startMultiScaleFormGroup.value
    startMultiScaleFormGroup: FormGroup;
    
    // Getters to provide convenient access to collection objects on the model
    get epochs(): FormArray {
        return this.startMultiScaleFormGroup.get('epochs') as FormArray;
    }

    get contentWeight(): FormArray {
        return this.startMultiScaleFormGroup.get('contentWeight') as FormArray;
    }

    get useReducedLayerSet(): FormArray {
        return this.startMultiScaleFormGroup.get('useReducedLayerSet') as FormArray;
    }

    get styles(): FormArray {
        return this.startMultiScaleFormGroup.get('styles') as FormArray;
    }

    // Called when component is initialized (currently at load time)
    ngOnInit(): void {
        // Use Angular FormBuilder to create the reactive form with default values and validation rules
        let epochValidators = [Validators.min(0), Validators.max(2000), Validators.required];
        let contentWeightValidators = [Validators.min(0), Validators.max(10000), Validators.required];
        let useReducedLayerSetValidators = [Validators.min(0), Validators.max(7), Validators.required];

        this.startMultiScaleFormGroup = this.fb.group({
            epochs: this.fb.array([
                [600, epochValidators],
                [250, epochValidators],
                [250, epochValidators],
                [150, epochValidators],
                [150, epochValidators]
            ]),
            contentWeight: this.fb.array([
                [10, contentWeightValidators],
                [10, contentWeightValidators],
                [0, contentWeightValidators],
                [0, contentWeightValidators],
                [0, contentWeightValidators],
            ]),
            useReducedLayerSet: this.fb.array([
                [3, useReducedLayerSetValidators],
                [3, useReducedLayerSetValidators],
                [0, useReducedLayerSetValidators],
                [0, useReducedLayerSetValidators],
                [0, useReducedLayerSetValidators],
            ]),
            sliderGroup: this.fb.group({
                runUntil: [0],
                startFromDim: [0],
                previousDim: [0]
            }, { validators: this.sliderGroupValidator }),
            imgRatio: [0.8, [Validators.min(0), Validators.max(1), Validators.required]],
            content: ["", Validators.required],
            gpu: [false],
            key: ["", Validators.required],
            styles: this.fb.array([], Validators.required)
        });

        // Load an existing form from previous session if there is one
        this.configService.get('previousForm').then(previousForm => {
            if (previousForm) {
                this.setForm(JSON.parse(previousForm));
            }
        });

        // Add event listener to save the current form before the process exits
        window.addEventListener('beforeunload', (event) => {
            this.configService.set('previousForm', JSON.stringify(this.startMultiScaleFormGroup.value));
        });
    };

    // Custom 'group' validator to manage cross-validation rules in slider controls
    sliderGroupValidator = (sliders: FormGroup): { [key: string]: boolean } | null => {
        let validationErrors: { [key: string]: boolean } = {};

        const runUntilControl = sliders.get('runUntil');
        const startFromDimControl = sliders.get('startFromDim');
        const previousDimControl = sliders.get('previousDim');

        if (this.max_dim[startFromDimControl.value] > this.max_dim[runUntilControl.value]) {
            validationErrors['startFromInvalid'] = true;
        }

        if (previousDimControl.value > this.max_dim[runUntilControl.value]) {
            validationErrors['previousInvalid'] = true;
        }

        if (Object.keys(validationErrors).length === 0) {
            // Returning null means no validation errors, everything is good
            return null;
        }
        else {
            return validationErrors;
        }
    };

    // Called when a file is added to the 'styles' collection, dynamically adds a row to the 'styles' FormArray with default values and validation rules
    buildStyle(fileName: string, filePath: string): FormGroup {
        return this.fb.group({
            fileName: [fileName, [Validators.required]],
            filePath: [filePath, [Validators.required]],
            weight: [100, [Validators.min(0), Validators.max(10000), Validators.required]],
            learningRate: [0.000015, [Validators.min(0), Validators.required]],
            endLearningRate: [0.000005, [Validators.min(0), Validators.required]],
            autoContentPalette: true,
            printIters: [500, [Validators.min(0), Validators.max(100000), Validators.required]],
            makeMirror: 0
        });
    }

    // Custom form submission to re-route HTML form to our python service
    onSubmit(): void {
        // runUntil and startFromDim are stored as index pointers -- need to translate them before and after submission
        let sliderFormGroup = this.startMultiScaleFormGroup.get('sliderGroup');
        let runUntilControlIndex = sliderFormGroup.get('runUntil').value;
        let startFromDimControlIndex = sliderFormGroup.get('startFromDim').value;
        this.startMultiScaleFormGroup.value.sliderGroup.runUntil = this.max_dim[runUntilControlIndex];
        this.startMultiScaleFormGroup.value.sliderGroup.startFromDim = this.max_dim[startFromDimControlIndex];
        
        // Submit to Angular service that encapsulates Python interop
        this.pythonService.submitForm(this.startMultiScaleFormGroup.value);

        // Set index pointer values back after submission
        this.startMultiScaleFormGroup.value.sliderGroup.runUntil = runUntilControlIndex;
        this.startMultiScaleFormGroup.value.sliderGroup.startFromDim = startFromDimControlIndex;
    }

    // Called when file is added to content control
    onContentSelect(e: SelectEvent) {
        // Should only ever be one file here - configured Kendo FileSelect to enforce this with [multiple]="false" in HTML
        if (e.files && e.files[0]) {
            // For some reason Kendo's TypeScript definiton doesn't include File.path...cast to 'any' as workaround
            let rawFileObj: any = e.files[0].rawFile;
            this.startMultiScaleFormGroup.get('content').setValue(rawFileObj.path);
        }
        else {
            this.startMultiScaleFormGroup.get('content').setValue("");
        }

        // This will prevent the file from being added to the Kendo widget itself, so we can instead manage it via the form's model
        e.preventDefault();
    }

    // Event handler for the 'x' button by the content path
    removeContent() {
        this.startMultiScaleFormGroup.get('content').setValue("");
    }

    // Called when one or more 'styles' are added
    onStyleSelect(e: SelectEvent) {
        e.files.forEach((file) => {
            // For some reason Kendo's TypeScript definiton doesn't include File.path...cast to 'any' as workaround
            let rawFileObj: any = file.rawFile;
            this.styles.push(this.buildStyle(rawFileObj.name, rawFileObj.path));
        });

        // This will prevent the file(s) from being added to the Kendo widget itself, so we can instead manage it via the form's model
        e.preventDefault();
    }

    // Convenience method to check the validity of all columns in the 'styles' grid
    styleColumnValid(columnName: string) {
        return this.styles.controls.every(style => (<any>style).controls[columnName].valid === true);
    }

    // Event handler for 'x' button in styles grid
    removeStyle(index: number) {
        this.styles.removeAt(index);
    }

    // Event handler for save button
    saveTemplate(event: any) {
        // Button is in the form - prevent default behavior of form submission
        event.preventDefault();

        // Create a temporary hidden anchor tag with file href and click it to invoke host OS save behavior
        let a = document.createElement("a");
        let file = new Blob([JSON.stringify(this.startMultiScaleFormGroup.value) as BlobPart], { type: "application/json" });
        a.href = URL.createObjectURL(file);
        a.download = Date.now().toString();
        a.click();
    }

    // Event handler for load template button
    browseTemplates(event: any) {
        // Button is in the form - prevent default behavior of form submission
        event.preventDefault();

        // templateInput is hidden and replaced with Kendo button for look and feel purposes, perform programmatic click to invoke host OS load behavior
        let inputElem: HTMLElement = document.getElementById('templateInput');
        inputElem.click();
    }

    // Called once a template file is selected from host OS browse window
    loadTemplate(files: FileList) {
        // Use FileReader API to convert the file contents to a string
        let reader = new FileReader();
        reader.onload = (event) => {
            let jsonString = event.target.result as string;
            let newModel = JSON.parse(jsonString);
            this.setForm(newModel);
        };
        reader.readAsText(files[0]);
    }

    // Takes the structured model as an object and loads it into the form - called during load and by load template button
    private setForm(model: any) {
        if (model) {
            // Wipe any existing controls added dynamically to styles array
            this.styles.clear();

            // If the model has more styles, need to create their controls/validators and add them dymamically
            if (model.styles && model.styles.length > 0) {
                model.styles.forEach(() => {
                    // Just need to create the appropriate number of controls with dummy data 
                    // setValue will take care of the actual model binding
                    this.styles.push(this.buildStyle('',''));
                })
            }

            // Bind the model to form
            this.startMultiScaleFormGroup.setValue(model);
        }
    }
}
