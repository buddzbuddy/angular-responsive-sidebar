import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AbonentListBytComponent } from './abonent-list-byt/abonent-list-byt.component';
import { AbonentListPromComponent } from './abonent-list-prom/abonent-list-prom.component';
import { AbonentOrdersComponent } from './abonent-orders/abonent-orders.component';
import { ChatComponent } from './chat/chat.component';
import { ComplaintsComponent } from './complaints/complaints.component';
import { CrashOrdersComponent } from './crash-orders/crash-orders.component';
import { MapElectricityComponent } from './map-electricity/map-electricity.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { PlannedoffsComponent } from './plannedoffs/plannedoffs.component';

const routes: Routes = [
  { path: '', component: CrashOrdersComponent },
  { path: 'crash-orders', component: CrashOrdersComponent },
  { path: 'abonent-orders', component: AbonentOrdersComponent },
  { path: 'my-orders', component: MyOrdersComponent },
  { path: 'abonent-list-byt', component: AbonentListBytComponent },
  { path: 'abonent-list-prom', component: AbonentListPromComponent },
  { path: 'planned-offs', component: PlannedoffsComponent },
  { path: 'complaints', component: ComplaintsComponent },
  { path: 'map-electricity', component: MapElectricityComponent },
  { path: 'chat', component: ChatComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
