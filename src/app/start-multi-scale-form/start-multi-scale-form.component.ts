import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StartMultiScaleModel } from './start-multi-scale-model'
import { PythonService } from '../python.service';
import { StartMultiScaleStyle } from './start-multi-scale-style';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'start-multi-scale-form',
    templateUrl: './start-multi-scale-form.component.html',
    styleUrls: ['./start-multi-scale-form.component.scss']
})
export class StartMultiScaleFormComponent implements OnInit {

    constructor(private pythonService: PythonService, 
                private cdr: ChangeDetectorRef,
                private fb: FormBuilder) {}

    max_dim: number[] = [512, 1024, 2048, 4096, 7096];

    defaultModel: StartMultiScaleModel = {
        epochs: [600, 250, 250, 150, 150],
        contentWeight: [10, 10, 0, 0, 0],
        useReducedLayerSet: [3, 3, 0, 0, 0],
        runUntil: 2048,
        startFromDim: 0,
        previousDim: 0,
        imgRatio: 0.8,
        gpu: false,
        content: "",
        key: "",
        styles: []
    };

    startMultiScaleFormModel: StartMultiScaleModel = { ...this.defaultModel };
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
            runUntil: [0],
            startFromDim: [0],
            previousDim: [0],
            imgRatio: [0.8, [Validators.min(0), Validators.max(1), Validators.required]],
            gpu: [false],
            key: ["", Validators.required],
            styles: this.fb.array([])
        });

        this.pythonService.pythonOutput.subscribe((message) => {
            if (message) {
                this.pythonConsole.unshift(message);
                this.cdr.detectChanges();
            }
        });
    }

    private buildStyle(fileName: string, filePath: string): FormGroup {
        return this.fb.group({
            fileName: [fileName, [Validators.required]],
            filePath: [filePath, [Validators.required]],
            weight: [100, [Validators.min(0), Validators.max(10000), Validators.required]],
            learningRate: [0.000015, [Validators.min(0), Validators.required]],
            endLearningRate: [0.000005, [Validators.min(0), Validators.required]],
            autoContentPalette: true,
            printIters: [500, [Validators.min(0), Validators.required]],
            makeMirror: 0
        });
    }

    onSubmit(): void {
        debugger;
    }

    onContentChange(e: Array<any>) {
        if (e && e[0]) {
            let newContent = e[0];
            this.startMultiScaleFormModel.content = newContent.path;
        }
    }

    onStyleChange(e: Array<any>) {
        e.forEach((file) => {
            if (this.styles.controls.find(style => style.value.filePath === file.path)) {
                return;
            }

            this.styles.push(this.buildStyle(file.name, file.path));
        })
    }

    saveTemplate() {
      let a = document.createElement("a");
      let file = new Blob([JSON.stringify(this.startMultiScaleFormModel) as BlobPart], {type: "application/json"});
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
            this.setForm(newModel as StartMultiScaleModel);
        };
        reader.readAsText(files[0]);
    }

    private setForm(model: StartMultiScaleModel) {
        if (model) {
            this.startMultiScaleFormModel = model;
            this.cdr.detectChanges();
        }
    }
}
