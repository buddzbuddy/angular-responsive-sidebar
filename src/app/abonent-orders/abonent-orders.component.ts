import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-abonent-orders',
  templateUrl: './abonent-orders.component.html',
  styleUrls: ['./abonent-orders.component.scss']
})
export class AbonentOrdersComponent implements OnInit {

  constructor(private _httpClient: HttpClient, private router: Router, private _formBuilder: FormBuilder, private notificationSvc: NotificationService) { }
  suppliersDisplayedColumns: string[] = ['nazvanie_slujby', 'tp', 'ulisa', 'data_otkl', 'vid_otkl', 'pov_el', 'data_vkl', 'abon_shet', 'fio', 'dom', 'tel', 'fioUser'/*, 'statusy', 'vid_povrej_elementov', 'remont', 'note'*/];
  ordersData: MatTableDataSource<any> = new MatTableDataSource();

  isLoadingResults = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  formGroup!: FormGroup;
  ngOnInit() {
    this.fetchSuppliers();
  }

  fetchSuppliers() {
    this.isLoadingResults = true;
    const href = 'http://212.112.127.26:4546/api/orders/getabonentorders';
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
  fetchSuppliersByPeriod() {
    this.isLoadingResults = true;
    const href = 'http://212.112.127.26:4546/api/orders/GetAbonentOrdersForPeriod';
    const requestUrl = `${href}`;
    let obj = {
      sdata: this.sdata,
      podata: this.podata
    }
    this._httpClient.post<any>(requestUrl, obj).subscribe(_ => {
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
  navigateTo(row: any) {
    //this.router.navigate(['/analitics/view-supplier/' + row.id]);
  }
  sdata: any
  podata: any

  applyFilter() {

    console.log('sdata', this.sdata);
    console.log('podata', this.podata);
    this.fetchSuppliersByPeriod();
  }

  clearFilter() {
    //this.formGroup.reset();
    this.fetchSuppliers();
  }
  goBack() {
    window.history.back();
  }
}
