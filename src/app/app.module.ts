import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { CrashOrdersComponent, EditOrderDialog } from './crash-orders/crash-orders.component';
import { AbonentOrdersComponent } from './abonent-orders/abonent-orders.component';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MaterialModule } from './material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { AbonentListBytComponent, AddNewOrderDialog } from './abonent-list-byt/abonent-list-byt.component';
import { AbonentListPromComponent } from './abonent-list-prom/abonent-list-prom.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableExporterModule } from 'mat-table-exporter';
import { ChatComponent } from './chat/chat.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { LocalStorageService } from './services/local-storage.service';
import { PlannedoffsComponent } from './plannedoffs/plannedoffs.component';
import { PlannedOffsExtComponent } from './plannedoffs/planned-offs-ext/planned-offs-ext.component';
import { MapElectricityComponent } from './map-electricity/map-electricity.component';


@NgModule({
  declarations: [AppComponent, CrashOrdersComponent, AbonentOrdersComponent, AbonentListBytComponent, AbonentListPromComponent, MyOrdersComponent,
    AddNewOrderDialog,
    EditOrderDialog,
    LoginPageComponent,
    ChatComponent,
    LoginPageComponent,
    PlannedoffsComponent,
    PlannedOffsExtComponent,
    MapElectricityComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    MatTableExporterModule
  ],
  providers: [

    LocalStorageService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    AddNewOrderDialog,
    EditOrderDialog,
    LoginPageComponent
  ]
})
export class AppModule { }
