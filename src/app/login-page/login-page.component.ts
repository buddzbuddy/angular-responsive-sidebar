import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../notification.service';
import { LocalStorageService } from '../services/local-storage.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  constructor(private ls: LocalStorageService, private _httpClient: HttpClient, private notificationSvc: NotificationService) { }

  ngOnInit(): void {
  }
  username: string = '';
  password: string = '';

  login() {
    if (this.username == '' || this.password == '') {
      this.notificationSvc.warn('Заполните поля!');
      return;
    }
    const href = `http://158.181.176.170:9999/api/users/login?username=${this.username}&password=${this.password}`;
    const requestUrl = `${href}`;
    this._httpClient.get<any>(requestUrl).subscribe(_ => {
      if (_.result) {
        this.notificationSvc.success('Авторизация успешно прошла!');
        this.ls.save('user', _.data);
        window.location.reload();
      }
      else {
        this.notificationSvc.warn('Логин или пароль неверный! Повторите ввод!');
      }
    });
  }
}
