import { Component, OnInit } from '@angular/core';
import { StartMultiScaleModel } from './start-multi-scale-model'
import { NgForm, NgModel } from '@angular/forms';
import { PythonService } from '../python.service';

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
        style: [],
        styleWeight: [],
        runUntil: 2048,
        startFromDim: 0,
        previousDim: 0,
        imgRatio: 0.8,
        gpu: false, 
        styleDir: "../basePatterns",
        content: "",
        contentDir: "",
        key: "",
        learningRate: 0.000015,
        endLearningRate: 0.000005,
        autoContentPalette: false,
        printIters: 500,
        makeMirror: 0
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
}