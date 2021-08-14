import { AfterViewChecked, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { MessageDto } from 'src/app/Dto/MessageDto';
import { LocalStorageService } from '../services/local-storage.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  constructor(private localStorageSvc: LocalStorageService, private _httpClient: HttpClient, private chatService: ChatService) { }
  @Input("user-info") userInfo: any
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;
  ngOnInit(): void {
    this.chatService.retrieveMappedObject().subscribe((receivedObj: MessageDto) => { this.addToInbox(receivedObj); });  // calls the service method to get the new messages sent
    this.userInfo = this.localStorageSvc.get('user');
    this.msgDto.user = this.userInfo.fioUser;
    this.msgDto.position = this.userInfo.dol;
    this.loadMsgList();
  }

  loadMsgList() {
    const href = 'http://158.181.176.170:9999/api/chat/list';
    const requestUrl = `${href}`;
    this._httpClient.get<any[]>(requestUrl).subscribe(_ => {
      this.msgInboxArray = _;
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  msgDto: MessageDto = new MessageDto();
  msgInboxArray: any[] = [];

  send(): void {
    if (this.msgDto) {
      if (this.msgDto.msgText.length == 0) {
        window.alert("Текст пустой");
        return;
      } else {
        this.chatService.broadcastMessage(this.msgDto);                   // Send the message via a service
        this.msgDto.msgText = '';
      }
    }
  }

  addToInbox(obj: MessageDto) {
    let newObj = {
      user: obj.user,
      position: obj.position,
      msgText: obj.msgText,
      created: new Date()
    }
    this.msgInboxArray.push(newObj);
  }
}
