import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ViewChild, AfterViewInit, OnInit, Inject, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { NotificationService } from '../notification.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-crash-orders',
  templateUrl: './crash-orders.component.html',
  styleUrls: ['./crash-orders.component.scss']
})
export class CrashOrdersComponent implements OnInit {
  @Input("with-filter") withFilter: boolean = false;
  @Input("with-actions") withActions: boolean = true;
  constructor(private _httpClient: HttpClient, public dialog: MatDialog, private router: Router, private _formBuilder: FormBuilder, private notificationSvc: NotificationService) { }
  suppliersDisplayedColumns: string[] = ['action', 'nazvanie_slujby', 'tp', 'ulisa', 'data_otkl', 'vid_otkl', 'pov_el', 'data_vkl', 'abon_shet', 'fio', 'dom', 'tel', 'fioUser', 'note'];
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
    const href = 'http://158.181.176.170:9999/api/orders/getcrashorders';
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
    const href = 'http://158.181.176.170:9999/api/orders/GetCrashOrdersForPeriod';
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

  isYellow(data_vkl: any) {
    let currentDate: Date = new Date();
    let d = new Date(data_vkl);
    if (d.getTime() > currentDate.getTime())
      return true;
    return false;
  }
  isGreen(data_vkl: any) {
    let currentDate: Date = new Date();
    let d = new Date(data_vkl);
    if (data_vkl != null && d.getTime() <= currentDate.getTime())
      return true;
    return false;
  }
  applyFilter() {

    console.log('sdata', this.sdata);
    console.log('podata', this.podata);
    this.fetchSuppliersByPeriod();
  }

  clearFilter() {
    //this.formGroup.reset();
    this.sdata = null;
    this.podata = null;
    this.fetchSuppliers();
  }
  goBack() {
    window.history.back();
  }
  deleted: any[] = []
  cancelOrder(row: any) {
    if (confirm('Вы уверены в этом?')) {
      this.deleted.push(row);
      this.notificationSvc.warn('Заявка отменена!');
    }
  }
  editOrder(row: any) {
    const dialogRef = this.dialog.open(EditOrderDialog, {
      data: row
    });
    dialogRef.afterClosed().subscribe(_ => {
      if (_) {
        console.log(_);
        this.notificationSvc.success('Заявка успешно сохранена!');
        this.router.navigate(['/crash-orders']);
      }
    });
  }

}


@Component({
  selector: 'edit-order-dialog',
  templateUrl: 'edit-order-dialog.html',
})
export class EditOrderDialog implements OnInit {
  formGroup!: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<EditOrderDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _httpClient: HttpClient, private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.formGroup = this._formBuilder.group({
      telephone: [this.data['tel'], Validators.required],//телефон
      data_vkl: [this.data['data_vkl'], [Validators.required]],//
      timeout: [this.data['timeout'], Validators.required],
      note: [this.data['note'], [Validators.required]],//примечание
      nch: [this.data['abon_shet'], Validators.required],//л/сч
      zavNomer: [this.data['zavNomer'], Validators.required],
      tp: [this.data['tp'], Validators.required],
      tip_shetchika: ['', Validators.required],
      fio: [this.data['fio'], Validators.required],
      address1: [this.data['ulisa'], Validators.required],
      address2: [this.data['address2'], Validators.required],
      debet: [this.data['debet'], Validators.required],
      penya: [this.data['penya'], Validators.required],
      akt: [this.data['akt'], Validators.required],
    });
    this.loadStatuses(this.data['zavNomer']);
    this.loadTipSchetchika(this.data['zavNomer'], this.data['idMarka'])
  }
  onSaveClick(): void {
    //this.updateOrder();
  }
  onCloseClick(): void {
    this.dialogRef.close();
  }
  statusObj: any = null
  loadStatuses(zavNomer: string) {
    const href = 'http://158.181.176.170:9999/api/abonents/GetStatusByZavNomer?zavNomer=' + zavNomer;
    const requestUrl = `${href}`;
    this._httpClient.get<any>(requestUrl).subscribe(_ => {
      if (_.result) {
        this.statusObj = _.data;
        this.formGroup.patchValue(_.data);
      }
    });
  }
  loadTipSchetchika(zavNomer: string, idmarka: number) {
    const href = `http://158.181.176.170:9999/api/abonents/GetTipShetchika?zavodNomer=${zavNomer}&idmarka=${idmarka}`;
    const requestUrl = `${href}`;
    this._httpClient.get<any>(requestUrl).subscribe(_ => {
      let s = '';
      if (_.result) {
        s = 'умный';
      }
      else {
        s = 'не умный';
      }
      this.formGroup.patchValue({ tip_shetchika: s });
    });
  }

  errorMessage = ''
  updateOrder() {
    const href = `http://158.181.176.170:9999/api/orders/CreateCrashOrder`;
    const requestUrl = `${href}`;
    let obj = this.formGroup.value;
    obj['raion'] = this.data['raion'];
    //obj['data_otkl'] = this.statusObj != null ? this.statusObj['data_otkl'] : null;
    this.errorMessage = '';
    this._httpClient.post<any>(requestUrl, obj).subscribe(_ => {
      console.log(_);
      if (_.result) {
        this.dialogRef.close(true);
      }
    },
      err => {
        this.errorMessage = err.message;
      });
  }
}
