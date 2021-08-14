import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { LocalStorageService } from './services/local-storage.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  constructor(private observer: BreakpointObserver, public dialog: MatDialog, public router: Router, private localStorageSvc: LocalStorageService) { }
  userInfo: any
  chat_opened: boolean = false;
  pinChat() {
    this.chat_opened = !this.chat_opened;
  }
  ngOnInit(): void {
    if (!this.localStorageSvc.has('user')) {
      const dialogRef = this.dialog.open(LoginDialog, {
        width: '500px',
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(_ => {
        if (this.localStorageSvc.has('user')) {
          this.userInfo = this.localStorageSvc.get('user');
        }
      });
    }
    else {
      this.userInfo = this.localStorageSvc.get('user');
    }
  }
  logout() {
    if (this.localStorageSvc.has('user')) {
      this.localStorageSvc.remove('user');
      window.location.reload();
    }
  }

  ngAfterViewInit() {
    this.observer.observe(['(max-width: 800px)']).subscribe((res) => {
      if (res.matches) {
        this.sidenav.mode = 'over';
        this.sidenav.close();
      } else {
        this.sidenav.mode = 'side';
        this.sidenav.open();
      }
    });
  }

  goto(routeUrl: string) {
    this.router.navigate([routeUrl]);
  }
}



@Component({
  selector: 'login-dialog',
  templateUrl: 'login-dialog.html',
})
export class LoginDialog {
  constructor(public dialogRef: MatDialogRef<LoginDialog>,) { }
  onLoginSucceed() {
    this.dialogRef.close();
  }
}
