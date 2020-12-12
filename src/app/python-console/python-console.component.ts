import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PythonService } from '../python.service';

@Component({
    selector: 'python-console',
    templateUrl: './python-console.component.html',
    styleUrls: ['./python-console.component.scss']
})
export class PythonConsoleComponent implements OnInit {

    constructor(private pythonService: PythonService, private cdr: ChangeDetectorRef) { }

    pythonConsole: string[] = [];
    containerElem: Element;

    ngOnInit(): void {
        this.pythonService.pythonOutput.subscribe((message) => {
            if (!this.containerElem) {
                this.containerElem = document.getElementById('python-console-container');
            }

            if (message) {
                this.pythonConsole.push(message);
                this.cdr.detectChanges();
                this.containerElem.scrollTop = this.containerElem.scrollHeight;
            }
        });
    }
}
