import { Component, OnInit } from '@angular/core';
import { StartMultiScaleModel } from './start-multi-scale-model'
import { PythonService } from '../python.service';
import { StartMultiScaleStyle } from './start-multi-scale-style';

@Component({
    selector: 'start-multi-scale-form',
    templateUrl: './start-multi-scale-form.component.html',
    styleUrls: ['./start-multi-scale-form.component.scss']
})
export class StartMultiScaleFormComponent implements OnInit {

    constructor(private pythonService: PythonService) {}

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
        styleDir: "../basePatterns",
        content: "",
        contentDir: "",
        key: "",
        styles: []
    };

    formModel: StartMultiScaleModel = { ...this.defaultModel };

    ngOnInit(): void {
        this.pythonService.pythonOutput.subscribe((message) => {
            console.log("Python: " + message);
        });
    }

    onSubmit(): void {
        this.pythonService.submitForm(this.formModel);
    }

    trackByIndex(index: number, obj: any): any {
        return index;
    }

    public remove(fileSelect, uid, state) {
        fileSelect.removeFileByUid(uid);
    }

    onStyleChange(e: Array<File>) {
        e.forEach((file) => {
            let style: StartMultiScaleStyle = file as StartMultiScaleStyle;
            style.weight = style.weight || 100;
            style.learningRate = style.learningRate || 0.000015;
            style.endLearningRate = style.endLearningRate || 0.000005;
            style.autoContentPalette = style.autoContentPalette || false;
            style.printIters = style.printIters || 500;
            style.makeMirror = style.makeMirror || 0;
        })
    }
}