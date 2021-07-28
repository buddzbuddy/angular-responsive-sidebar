import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AbonentListBytComponent } from './abonent-list-byt/abonent-list-byt.component';
import { AbonentListPromComponent } from './abonent-list-prom/abonent-list-prom.component';
import { AbonentOrdersComponent } from './abonent-orders/abonent-orders.component';
import { CrashOrdersComponent } from './crash-orders/crash-orders.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';

const routes: Routes = [
  { path: '', component: CrashOrdersComponent },
  { path: 'crash-orders', component: CrashOrdersComponent },
  { path: 'abonent-orders', component: AbonentOrdersComponent },
  { path: 'my-orders', component: MyOrdersComponent },
  { path: 'abonent-list-byt', component: AbonentListBytComponent },
  { path: 'abonent-list-prom', component: AbonentListPromComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
