import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StartModule } from 'src/components/start-module.module';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { GoogleSheetsService } from 'src/google-sheets/google-sheets.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, StartModule,
    BrowserAnimationsModule, DeviceDetectorModule
  ],
  providers: [GoogleSheetsService, HttpClient, HttpClientModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
