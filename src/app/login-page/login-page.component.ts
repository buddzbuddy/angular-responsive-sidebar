import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NotificationService } from '../notification.service';
import { LocalStorageService } from '../services/local-storage.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {

  constructor(private ls: LocalStorageService, private _httpClient: HttpClient, private notificationSvc: NotificationService) { }

  username: string = '';
  password: string = '';

  @Output() public onLoginSucceed = new EventEmitter();

  login() {
    if (this.username == '' || this.password == '') {
      this.notificationSvc.warn('Заполните поля!');
      return;
    }
    const href = `http://192.168.88.16:9999/api/users/login?username=${this.username}&password=${this.password}`;
    const requestUrl = `${href}`;
    this._httpClient.get<any>(requestUrl).subscribe(_ => {
      if (_.result) {
        this.notificationSvc.success('Авторизация успешно прошла!');
        this.ls.save('user', _.data);
        this.onLoginSucceed.emit();
      }
      else {
        this.notificationSvc.warn('Логин или пароль неверный! Повторите ввод!');
      }
    });
  }
}
