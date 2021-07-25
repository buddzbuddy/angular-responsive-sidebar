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

  nch = ''
  ngOnInit() {
    this.fetchSuppliers();
  }

  fetchSuppliers() {
    this.isLoadingResults = true;
    const href = 'http://158.181.176.170:9999/api/abonents/GetByt?nch=' + this.nch;
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
  createOrder(row: any) {
    const dialogRef = this.dialog.open(AddNewOrderDialog, {
      data: row
    });
    dialogRef.afterClosed().subscribe(_ => {
      if (_ != null) {
        console.log(_);
      }
    });
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


@Component({
  selector: 'add-new-order-dialog',
  templateUrl: '../add-new-order-dialog.html',
})
export class AddNewOrderDialog implements OnInit {
  formGroup!: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<AddNewOrderDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _httpClient: HttpClient, private _formBuilder: FormBuilder,) { }

  ngOnInit() {
    this.formGroup = this._formBuilder.group({
      telephone: ['', Validators.required],//телефон
      note: ['', [Validators.required]],//примечание
      nch: ['', Validators.required],//л/сч
      lastName: ['', [Validators.required]],//
      email: ['', Validators.required],
      password: ['123456789', Validators.required],
    });
    this.loadRoles();
  }
  conditions: any = {

  }
  onSaveClick(): void {
    this.saveUser();
  }
  onCloseClick(): void {
    this.dialogRef.close();
  }
  selectedRoleName = ''
  roles: any[] = []
  loadRoles() {
    const href = 'data-api/user-constraint/role/getAll';
    const requestUrl = `${href}`;
    this._httpClient.get<any[]>(requestUrl).subscribe(_ => {
      this.roles = _;
    });
  }

  errorMessage = ''
  reqStatus = 0
  selectItemsForSrc: any = {}
  saveUser() {
    const href = `auth/admin/realms/dgz/users`;
    const requestUrl = `${href}`;
    let obj = this.formGroup.value;
    let userPin = obj['userPin'];
    let userPass = obj['password'];
    delete obj['userPin'];
    delete obj['password'];
    let data =
    {
      ...obj,
      emailVerified: true,
      enabled: true,
      requiredActions: ["UPDATE_PASSWORD"],
      attributes:
      {
        userPin: [userPin],
        userRole: [this.selectedRoleName]
      },
      credentials: [
        {
          type: "password",
          value: userPass
        }
      ]
    }
    this.errorMessage = '';
    this.reqStatus = 0;
    this._httpClient.post<any>(requestUrl, data).subscribe(_ => {
      this.dialogRef.close(true);
    },
      err => {
        if (err.status == 409) {
          this.errorMessage = "Такой логин уже присвоен!";
        }
        else {
          this.errorMessage = err.message;
        }

        console.log('ошибка', err);
      });
  }
}
