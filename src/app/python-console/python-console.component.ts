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

    ngOnInit(): void {
        this.pythonService.pythonOutput.subscribe((message) => {
            if (message) {
                this.pythonConsole.unshift(message);
                this.cdr.detectChanges();
            }
        });
    }
}
