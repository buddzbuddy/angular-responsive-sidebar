import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-abonent-list-prom',
  templateUrl: './abonent-list-prom.component.html',
  styleUrls: ['./abonent-list-prom.component.scss']
})
export class AbonentListPromComponent implements OnInit {

  constructor(private _httpClient: HttpClient, private router: Router, private _formBuilder: FormBuilder, private notificationSvc: NotificationService) { }
  suppliersDisplayedColumns: string[] = ['nch', 'fio', 'address1', 'tp', 'debet', 'penya', 'zavNomer', 'umn', 'raion_name', 'kod_potreb', 'potrebitel', 'kod_abon', 'abonent', 'n_category', 'carea', 'carea2'];
  ordersData: MatTableDataSource<any> = new MatTableDataSource();

  isLoadingResults = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  nch = ''
  ngOnInit() {
    this.fetchSuppliers();
  }

  fetchSuppliers() {
    this.isLoadingResults = true;
    const href = 'http://192.168.88.16:9999/api/abonents/GetProm?nch=' + this.nch;
    const requestUrl = `${href}`;
    this._httpClient.get<any>(requestUrl).subscribe(_ => {
      if (_.result) {
        this.ordersData = new MatTableDataSource(_.data);
        this.ordersData.paginator = this.paginator;
        this.ordersData.sort = this.sort;
        this.notificationSvc.success('Данные успешно загружены!');
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

  applyFilter() {
    this.fetchSuppliers();
  }

  clearFilter() {
    this.nch = '';
    this.fetchSuppliers();
  }
  goBack() {
    window.history.back();
  }
}
