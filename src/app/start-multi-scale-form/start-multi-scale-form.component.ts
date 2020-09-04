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

    defaultModel: StartMultiScaleModel = {
        hello: "hello",
        world: "world"
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
}