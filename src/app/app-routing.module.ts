import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AbonentOrdersComponent } from './abonent-orders/abonent-orders.component';
import { CrashOrdersComponent } from './crash-orders/crash-orders.component';

const routes: Routes = [
  { path: '', component: CrashOrdersComponent },
  { path: 'crash-orders', component: CrashOrdersComponent },
  { path: 'abonent-orders', component: AbonentOrdersComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
