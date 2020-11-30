import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms'

import { AppComponent } from './app.component';
import { StartMultiScaleFormComponent } from './start-multi-scale-form/start-multi-scale-form.component';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { UploadsModule } from '@progress/kendo-angular-upload';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    StartMultiScaleFormComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    ButtonsModule,
    BrowserAnimationsModule,
    InputsModule,
    LabelModule,
    UploadsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
