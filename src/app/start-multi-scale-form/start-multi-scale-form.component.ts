import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StartMultiScaleModel } from './start-multi-scale-model'
import { PythonService } from '../python.service';
import { StartMultiScaleStyle } from './start-multi-scale-style';

@Component({
    selector: 'start-multi-scale-form',
    templateUrl: './start-multi-scale-form.component.html',
    styleUrls: ['./start-multi-scale-form.component.scss']
})
export class StartMultiScaleFormComponent implements OnInit {

    constructor(private pythonService: PythonService, private cdr: ChangeDetectorRef) {}

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

    formModel: StartMultiScaleModel = { ...this.defaultModel };
    pythonConsole: string[] = [];

    ngOnInit(): void {
        this.pythonService.pythonOutput.subscribe((message) => {
            if (message) {
                this.pythonConsole.unshift(message);
                this.cdr.detectChanges();
            }
        });
    }

    onSubmit(): void {
        this.pythonService.submitForm(this.formModel);
    }

    trackByIndex(index: number, obj: any): any {
        return index;
    }

    remove(fileSelect, uid, state) {
        fileSelect.removeFileByUid(uid);
    }

    onContentChange(e: Array<any>) {
        if (e && e[0]) {
            let newContent = e[0];
            this.formModel.content = newContent.path;
        }
    }

    onStyleChange(e: Array<any>) {
        e.forEach((file) => {
            let style: StartMultiScaleStyle = file as StartMultiScaleStyle;
            style.fileName = file.name;
            style.filePath = file.path;
            style.weight = style.weight || 100;
            style.learningRate = style.learningRate || 0.000015;
            style.endLearningRate = style.endLearningRate || 0.000005;
            style.autoContentPalette = style.autoContentPalette || false;
            style.printIters = style.printIters || 500;
            style.makeMirror = style.makeMirror || 0;
        })
    }

    saveTemplate() {
      var a = document.createElement("a");
      var file = new Blob([JSON.stringify(this.formModel) as BlobPart], {type: "application/json"});
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
            this.formModel = model;
            this.cdr.detectChanges();
        }
    }
}
