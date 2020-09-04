import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'

import { AppComponent } from './app.component';
import { StartMultiScaleFormComponent } from './start-multi-scale-form/start-multi-scale-form.component';

@NgModule({
  declarations: [
    AppComponent,
    StartMultiScaleFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
