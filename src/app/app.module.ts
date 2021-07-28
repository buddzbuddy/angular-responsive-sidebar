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
import { CrashOrdersComponent } from './crash-orders/crash-orders.component';
import { AbonentOrdersComponent } from './abonent-orders/abonent-orders.component';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MaterialModule } from './material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { AbonentListBytComponent } from './abonent-list-byt/abonent-list-byt.component';
import { AbonentListPromComponent } from './abonent-list-prom/abonent-list-prom.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';

@NgModule({
  declarations: [AppComponent, CrashOrdersComponent, AbonentOrdersComponent, AbonentListBytComponent, AbonentListPromComponent, MyOrdersComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
