import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { merge, Observable, of as observableOf } from 'rxjs';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { NotificationService } from '../notification.service';
export interface UserData {
  id: string;
  name: string;
  progress: string;
  fruit: string;
}

@Component({
  selector: 'app-crash-orders',
  templateUrl: './crash-orders.component.html',
  styleUrls: ['./crash-orders.component.scss']
})
export class CrashOrdersComponent implements OnInit {

  constructor(private _httpClient: HttpClient, private router: Router, private _formBuilder: FormBuilder, private notificationSvc: NotificationService) { }
  suppliersDisplayedColumns: string[] = ['id', 'name', 'inn', 'legalAddress', 'ownershipTypeId', 'industryId'];
  httpDatabase!: HttpDatabase | null;
  suppliersData: MatTableDataSource<any> = new MatTableDataSource();

  resultsLength = 0;
  isLoadingResults = false;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  formGroup!: FormGroup;
  ngOnInit() {
    this.notificationSvc.success('Данные успешно загружены!');
    this.formGroup = this._formBuilder.group({
      ownershipTypeId: '',
      inn: '',
      industryId: ''
    });
    this.httpDatabase = new HttpDatabase(this._httpClient);

    this.getOwnership_types();
    this.getIndustries();
    this.getLicense_types();
    this.fetchSuppliers({ searchQuery: {} });
    this.getGrantedSources();
  }
  filteredNames: any;
  isLoading = false;

  fetchSuppliers(filterObj: any) {
    this.isLoadingResults = false;
    this.httpDatabase!.getSuppliers(filterObj).subscribe(_ => {
      this.suppliersData = new MatTableDataSource(_.data);
      this.suppliersData.paginator = this.paginator;
      this.suppliersData.sort = this.sort;
      this.isLoadingResults = false;
    });
  }
  navigateTo(row: any) {
    this.router.navigate(['/analitics/view-supplier/' + row.id]);
  }

  ownership_types: any[] = [];
  getOwnership_types() {
    const href = 'data-api/query/exec';
    const requestUrl = `${href}`;
    let obj = {
      rootName: "OwnershipType"
    }
    this._httpClient.post<any>('AppConfig.settings.host' + requestUrl, obj).subscribe(_ => {
      this.ownership_types = _['data'];
    });
  }

  industries: any[] = [];
  getIndustries() {
    let obj = {
      rootName: "Industry"
    }
    const href = 'data-api/query/exec';
    const requestUrl = `${href}`;
    this._httpClient.post<any>('AppConfig.settings.host' + requestUrl, obj).subscribe(_ => {
      this.industries = _['data'];
    });
  }
  license_types: any[] = [];
  getLicense_types() {
    let obj = {
      rootName: "LicenseType"
    }
    const href = 'data-api/query/exec';
    const requestUrl = `${href}`;
    this._httpClient.post<any>('AppConfig.settings.host' + requestUrl, obj).subscribe(_ => {
      this.license_types = _['data'];
    });
  }


  parseSelect(fieldName: string, valId: number): string {
    let valName = ""

    if (fieldName == 'ownershipTypeId') {
      for (let index = 0; index < this.ownership_types.length; index++) {
        const e = this.ownership_types[index];
        if (e.id == valId) {
          return e.name;
        }
      }
    }
    if (fieldName == 'industryId') {
      for (let index = 0; index < this.industries.length; index++) {
        const e = this.industries[index];
        if (e.id == valId) {
          return e.name;
        }
      }
    }

    return valName;
  }

  isChecked1 = false
  spec1: any = {

  }
  isChecked2 = false
  spec2: any = {

  }
  isChecked3 = false
  spec3: any = {

  }
  isChecked4 = false
  spec4: any = {

  }
  isChecked5 = false
  spec5: any = {

  }
  isChecked6 = false
  spec6: any = {

  }
  isBlack: boolean = false;
  isResident: boolean = false;
  applyFilter() {
    let filterObj: any[] = [];
    for (let f of Object.keys(this.formGroup.value)) {
      let val = this.formGroup.value[f];
      if (val != null && val != '') {
        filterObj.push({ property: f, operator: '=', value: val });
      }
    }
    if (this.isBlack != null) {
      filterObj.push({ property: 'isBlack', operator: '=', value: this.isBlack });
    }

    if (this.isResident != null) {
      filterObj.push({ property: 'isResident', operator: '=', value: this.isResident });
    }

    let obj: any = {
      searchQuery: {
        searchFitler: filterObj
      }
    };
    if (this.isChecked1) {
      obj['spec1'] = this.spec1;
    }
    if (this.isChecked2) {
      obj['spec2'] = this.spec2;
    }
    if (this.isChecked3) {
      obj['spec3'] = this.spec3;
    }
    if (this.isChecked4) {
      obj['spec4'] = this.spec4;
    }
    if (this.isChecked5) {
      obj['spec5'] = this.spec5;
    }
    if (this.isChecked6) {
      obj['spec6'] = this.spec6;
    }
    console.log(JSON.stringify(obj));
    this.fetchSuppliers(obj);
  }

  clearFilter() {
    this.formGroup.reset();
    this.isChecked1 = false;
    this.isChecked2 = false;
    this.isChecked3 = false;
    this.isChecked4 = false;
    this.isChecked5 = false;
    this.isChecked6 = false;
    this.isBlack = false;
    this.isResident = false;
    this.fetchSuppliers({ searchQuery: {} });
  }
  goBack() {
    window.history.back();
  }
  licenseChecked = false
  debtChecked = false
  complaintChecked = false
  getGrantedSources() {
    const href = 'data-api/query/exec';
    const requestUrl = `${href}`;
    this._httpClient.post<any>('AppConfig.settings.host' + requestUrl, { rootName: 'GrantedSource' }).subscribe(_ => {
      if (_['data'] != null) {
        let grantedSources: any[] = _['data'];
        for (let index = 0; index < grantedSources.length; index++) {
          const gSource = grantedSources[index];
          if (gSource.sourceType == 'LICENSE') {
            this.licenseChecked = true;
          }
          if (gSource.sourceType == 'DEBT') {
            this.debtChecked = true;
          }
          if (gSource.sourceType == 'COMPLAINT') {
            this.complaintChecked = true;
          }
        }
      }
    })
  }

}
/** An example database that the data source uses to retrieve data for the table. */
export class HttpDatabase {
  constructor(private _httpClient: HttpClient) { }

  getSuppliers(filterObj: any): Observable<any> {
    const href = 'data-api/supplier-requests/exec';
    const requestUrl = `${href}`;
    return this._httpClient.post('AppConfig.settings.host' + requestUrl, filterObj);
  }
}
