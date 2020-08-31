import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'python-console',
    templateUrl: './python-console.component.html'
})
export class PythonConsoleComponent implements OnInit {
    ngOnInit(): void {
        console.log('console init');
    }
}