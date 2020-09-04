import { Component, OnInit } from '@angular/core';
import { StartMultiScaleModel } from './start-multi-scale-model'

@Component({
    selector: 'start-multi-scale-form',
    templateUrl: './start-multi-scale-form.component.html'
})
export class StartMultiScaleFormComponent implements OnInit {
    ngOnInit(): void {
        console.log('console init');
    }

    startMultiScaleModel: StartMultiScaleModel = {}
}