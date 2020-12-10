import { Component, OnInit } from '@angular/core';
import { PythonService } from '../python.service';
import { FormArray, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { SelectEvent } from '@progress/kendo-angular-upload';

@Component({
    selector: 'start-multi-scale-form',
    templateUrl: './start-multi-scale-form.component.html',
    styleUrls: ['./start-multi-scale-form.component.scss']
})
export class StartMultiScaleFormComponent implements OnInit {

    constructor(private pythonService: PythonService,
        private fb: FormBuilder) { }

    max_dim: number[] = [512, 1024, 2048, 4096, 7096];

    startMultiScaleFormGroup: FormGroup;
    pythonConsole: string[] = [];

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

        // TODO: Load existing values if we have them stored
    };

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

    private buildStyle(fileName: string, filePath: string): FormGroup {
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

    onSubmit(): void {
        this.pythonService.submitForm(this.startMultiScaleFormGroup.value);
    }

    onContentSelect(e: SelectEvent) {
        // Should only ever be one file here - configured Kendo FileSelect to enforce this with [multiple]="false"
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

    removeContent() {
        this.startMultiScaleFormGroup.get('content').setValue("");
    }

    onStyleSelect(e: SelectEvent) {
        e.files.forEach((file) => {
            // For some reason Kendo's TypeScript definiton doesn't include File.path...cast to 'any' as workaround
            let rawFileObj: any = file.rawFile;
            this.styles.push(this.buildStyle(rawFileObj.name, rawFileObj.path));
        });

        // This will prevent the file(s) from being added to the Kendo widget itself, so we can instead manage it via the form's model
        e.preventDefault();
    }

    styleRowsValid(columnName: string) {
        return this.styles.controls.every(style => (<any>style).controls[columnName].valid === true);
    }

    removeStyle(index: number) {
        this.styles.removeAt(index);
    }

    saveTemplate(event: any) {
        event.preventDefault();

        let a = document.createElement("a");
        let file = new Blob([JSON.stringify(this.startMultiScaleFormGroup.value) as BlobPart], { type: "application/json" });
        a.href = URL.createObjectURL(file);
        a.download = Date.now().toString();
        a.click();
    }

    browseTemplates(event: any) {
        event.preventDefault();

        let inputElem: HTMLElement = document.getElementById('templateInput');
        inputElem.click();
    }

    loadTemplate(files: FileList) {
        let reader = new FileReader();
        reader.onload = (event) => {
            let jsonString = event.target.result as string;
            let newModel = JSON.parse(jsonString);
            this.setForm(newModel);
        };
        reader.readAsText(files[0]);
    }

    private setForm(model: any) {
        if (model) {
            // this.startMultiScaleFormModel = model;
            this.startMultiScaleFormGroup.setValue(model);
        }
    }
}
