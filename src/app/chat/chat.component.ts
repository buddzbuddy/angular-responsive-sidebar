import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { MessageDto } from 'src/app/Dto/MessageDto';
import { LocalStorageService } from '../services/local-storage.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  constructor(private localStorageSvc: LocalStorageService, private chatService: ChatService) { }
  userInfo: any = {}
  ngOnInit(): void {
    this.chatService.retrieveMappedObject().subscribe((receivedObj: MessageDto) => { this.addToInbox(receivedObj); });  // calls the service method to get the new messages sent
    if (!this.localStorageSvc.has('user')) {
      window.location.reload();
    }
    else {
      this.userInfo = this.localStorageSvc.get('user');
      this.msgDto.user = this.userInfo.fioUser + ' - ' + this.userInfo.dol
    }
  }

  msgDto: MessageDto = new MessageDto();
  msgInboxArray: any[] = [];

  send(): void {
    if (this.msgDto) {
      if (this.msgDto.user.length == 0 || this.msgDto.msgText.length == 0) {
        window.alert("Both fields are required.");
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
      msgText: obj.msgText,
      created: new Date()
    }
    this.msgInboxArray.push(newObj);
  }
}
