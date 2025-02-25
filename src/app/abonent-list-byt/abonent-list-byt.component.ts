import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ViewChild, AfterViewInit, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { NotificationService } from '../notification.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-abonent-list-byt',
  templateUrl: './abonent-list-byt.component.html',
  styleUrls: ['./abonent-list-byt.component.scss']
})
export class AbonentListBytComponent implements OnInit {

  constructor(private _httpClient: HttpClient, private router: Router, public dialog: MatDialog, private notificationSvc: NotificationService) { }
  suppliersDisplayedColumns: string[] = ['action', 'raion_name', 'nch', 'fio', 'address1', 'address2', 'tp', 'zavNomer', 'ccounter2', 'debet', 'penya', 'akt', 'carea2', 'carea'/*, 'vid_povrej_elementov', 'remont', 'note'*/];
  ordersData: MatTableDataSource<any> = new MatTableDataSource();

  isLoadingResults = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  address1Filter = new FormControl();
  address2Filter = new FormControl();
  raion_nameFilter = new FormControl();
  nchFilter = new FormControl();
  fioFilter = new FormControl();
  tpFilter = new FormControl();
  zavNomerFilter = new FormControl();
  filteredValues = {
    address1: '', address2: '', raion_name: '', nch: '', fio: '', tp: '', zavNomer: '',
  };
  nch = ''
  ngOnInit() {
    this.fetchSuppliers();
  }
  createFilter() {
    let filterFunction = function (data: any, filter: string): boolean {
      let searchTerms = JSON.parse(filter)
      let address1Search = data.address1.toString().toLowerCase().indexOf(searchTerms.address1.toString().toLowerCase()) != -1
      let address2Search = data.address2.toString().toLowerCase().indexOf(searchTerms.address2.toString().toLowerCase()) != -1
      let raion_nameSearch = data.raion_name.toString().toLowerCase().indexOf(searchTerms.raion_name.toString().toLowerCase()) != -1
      let nchSearch = data.nch.toString().toLowerCase().indexOf(searchTerms.nch.toString().toLowerCase()) != -1
      let fioSearch = data.fio.toString().toLowerCase().indexOf(searchTerms.fio.toString().toLowerCase()) != -1
      let tpSearch = data.tp.toString().toLowerCase().indexOf(searchTerms.tp.toString().toLowerCase()) != -1
      let zavNomerSearch = data.zavNomer.toString().toLowerCase().indexOf(searchTerms.zavNomer.toString().toLowerCase()) != -1

      return address1Search && address2Search && raion_nameSearch && nchSearch && fioSearch && tpSearch && zavNomerSearch;
    }
    return filterFunction
  }
  fetchSuppliers() {
    this.isLoadingResults = true;
    const href = 'http://212.112.127.26:4546/api/abonents/GetByt?nch=' + this.nch;
    const requestUrl = `${href}`;
    this._httpClient.get<any>(requestUrl).subscribe(_ => {
      if (_.result) {
        this.ordersData = new MatTableDataSource(_.data);
        this.ordersData.paginator = this.paginator;
        this.ordersData.sort = this.sort;


        this.address1Filter.valueChanges.subscribe((value) => {
          console.log(value);
          this.filteredValues['address1'] = value;
          this.ordersData.filter = JSON.stringify(this.filteredValues);
        });


        this.address2Filter.valueChanges
          .subscribe(value => {
            this.filteredValues['address2'] = value
            this.ordersData.filter = JSON.stringify(this.filteredValues)
          });



        this.raion_nameFilter.valueChanges
          .subscribe(value => {
            this.filteredValues['raion_name'] = value
            this.ordersData.filter = JSON.stringify(this.filteredValues)
          });



        this.nchFilter.valueChanges
          .subscribe(value => {
            this.filteredValues['nch'] = value
            this.ordersData.filter = JSON.stringify(this.filteredValues)
          });



        this.fioFilter.valueChanges
          .subscribe(value => {
            this.filteredValues['fio'] = value
            this.ordersData.filter = JSON.stringify(this.filteredValues)
          });



        this.tpFilter.valueChanges
          .subscribe(value => {
            this.filteredValues['tp'] = value
            this.ordersData.filter = JSON.stringify(this.filteredValues)
          });



        this.zavNomerFilter.valueChanges
          .subscribe(value => {
            this.filteredValues['zavNomer'] = value
            this.ordersData.filter = JSON.stringify(this.filteredValues)
          });
        this.ordersData.filterPredicate = this.createFilter();
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
  createOrder(row: any) {
    const dialogRef = this.dialog.open(AddNewOrderDialog, {
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
    this.nch = '';
    this.fetchSuppliers();
  }
  goBack() {
    window.history.back();
  }
}


@Component({
  selector: 'add-new-order-dialog',
  templateUrl: 'add-new-order-dialog.html',
})
export class AddNewOrderDialog implements OnInit {
  formGroup!: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<AddNewOrderDialog>,
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
