import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { NotificationService } from '../notification.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorageService } from '../services/local-storage.service';

@Component({
  selector: 'app-complaints',
  templateUrl: './complaints.component.html',
  styleUrls: ['./complaints.component.scss']
})
export class ComplaintsComponent implements OnInit {

  constructor(private localStorageSvc: LocalStorageService, private _httpClient: HttpClient, private router: Router, public dialog: MatDialog, private notificationSvc: NotificationService) { }
  suppliersDisplayedColumns: string[] = ['raion', 'data_prin_jalob', 'komu_slujba', 'fioUser', 'fio', 'adres', 'tel', 'prichina', 'vypolnen', 'otv_liso', 'ot_kogo'];
  ordersData: MatTableDataSource<any> = new MatTableDataSource();

  isLoadingResults = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  userId = 0
  ngOnInit() {
    if (this.localStorageSvc.has('user')) {
      this.userId = this.localStorageSvc.get('user')['id'];
      this.fetchSuppliers();
    }
  }
  fetchSuppliers() {
    this.isLoadingResults = true;
    const href = 'http://212.112.127.26:4546/api/complaints/GetList?userId=' + this.userId;
    const requestUrl = `${href}`;
    this._httpClient.get<any>(requestUrl).subscribe(_ => {
      if (_.result) {
        this.ordersData = new MatTableDataSource(_.data);
        this.ordersData.paginator = this.paginator;
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
  createOrder(row: any) {
    const dialogRef = this.dialog.open(AddNewComplaintDialog, {
      data: row,
      disableClose: true,
      hasBackdrop: false
    });
    dialogRef.afterClosed().subscribe(_ => {
      if (_) {
        console.log(_);
        this.notificationSvc.success('Заявка успешно сохранена!');
        this.router.navigate(['/crash-orders']);
      }
    });
  }
  applyFilterOld() {
    this.fetchSuppliers();
  }

  clearFilter() {
    this.fetchSuppliers();
  }
  goBack() {
    window.history.back();
  }
}


@Component({
  selector: 'add-new-complaint-dialog',
  templateUrl: 'add-new-complaint-dialog.html',
})
export class AddNewComplaintDialog implements OnInit {
  formGroup!: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<AddNewComplaintDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _httpClient: HttpClient, private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.formGroup = this._formBuilder.group({
      telephone: [this.data['cphone'], Validators.required],//телефон
      data_vkl: [this.data['data_vkl'], [Validators.required]],//
      timeout: [this.data['timeout'], Validators.required],
      note: ['', [Validators.required]],//примечание
      nch: [this.data['nch'], Validators.required],//л/сч
      zavNomer: [this.data['zavNomer'], Validators.required],
      tp: [this.data['tp'], Validators.required],
      tip_shetchika: ['', Validators.required],
      fio: [this.data['fio'], Validators.required],
      address1: [this.data['address1'], Validators.required],
      address2: [this.data['address2'], Validators.required],
      debet: [this.data['debet'], Validators.required],
      penya: [this.data['penya'], Validators.required],
      akt: [this.data['akt'], Validators.required],
    });
    this.loadStatuses(this.data['zavNomer']);
    this.loadTipSchetchika(this.data['zavNomer'], this.data['idMarka'])
  }
  onCreateCrashOrderClick(): void {
    this.createCrashOrder();
  }
  onCreateAbonOrderClick(): void {
    this.createAbonOrder();
  }
  onCloseClick(): void {
    this.dialogRef.close();
  }
  statusObj: any = null
  loadStatuses(zavNomer: string) {
    const href = 'http://212.112.127.26:4546/api/abonents/GetStatusByZavNomer?zavNomer=' + zavNomer;
    const requestUrl = `${href}`;
    this._httpClient.get<any>(requestUrl).subscribe(_ => {
      if (_.result) {
        this.statusObj = _.data;
        this.formGroup.patchValue(_.data);
      }
    });
  }
  loadTipSchetchika(zavNomer: string, idmarka: number) {
    const href = `http://212.112.127.26:4546/api/abonents/GetTipShetchika?zavodNomer=${zavNomer}&idmarka=${idmarka}`;
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
  createCrashOrder() {
    const href = `http://212.112.127.26:4546/api/orders/CreateCrashOrder`;
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

  createAbonOrder() {
    const href = `http://212.112.127.26:4546/api/orders/CreateAbonOrder`;
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
