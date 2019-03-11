import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http'

import { AppRoutingModule } from './app-routing/app-routing.module';

import { AppComponent } from './app.component';
import { EventsComponent } from './events/events.component';

import { EventsService } from './events/service/events.service';
import { CustomFormsModule } from 'ng2-validation';
import { NgDatepickerModule } from 'ng2-datepicker';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { DatePipe } from './events/events.pipe';
import * as moment from 'moment';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    EventsComponent,
    DatePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpModule,
    CustomFormsModule,
    NgDatepickerModule,
    NguiDatetimePickerModule,
 //   ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [EventsService],
  bootstrap: [AppComponent],
})
export class AppModule { }
