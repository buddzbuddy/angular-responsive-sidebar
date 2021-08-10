import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NotificationService } from '../../notification.service';

@Component({
  selector: 'app-planned-offs-ext',
  templateUrl: './planned-offs-ext.component.html',
  styleUrls: ['./planned-offs-ext.component.scss']
})
export class PlannedOffsExtComponent implements OnInit {

  constructor(private _httpClient: HttpClient, private notificationSvc: NotificationService) { }
  suppliersDisplayedColumns: string[] = ['vid', 'name_tp', 'data_otkl', 'remont', 'data_vkl', 'fioUser', 'nazvanie_slujby'];
  ordersData: MatTableDataSource<any> = new MatTableDataSource();

  isLoadingResults = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.fetchSuppliers();
  }

  fetchSuppliers() {
    this.isLoadingResults = true;
    const href = 'http://158.181.176.170:9999/api/PlannedOff/GetPlan04';
    const requestUrl = `${href}`;
    this._httpClient.get<any>(requestUrl).subscribe(_ => {
      if (_.result) {
        this.ordersData = new MatTableDataSource(_.data);
        this.ordersData.paginator = this.paginator;
        this.ordersData.sort = this.sort;
        //this.notificationSvc.success('Данные успешно загружены!');
      }
      else {
        this.notificationSvc.warn('Что-то пошло не так ((');
      }
      this.isLoadingResults = false;
    });
  }
}
