import { Component } from '@angular/core';
//import {SwPush, SwUpdate} from '@angular/service-worker';
import { PushNotifyService } from './events/service/pushnotify.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

    // readonly VAPID_PUBLIC_KEY = 'BJ2u9V5GRmGk6BpszqacVSiKqF577lO-ppys0naDfww-tKe7-7qs-vrTe_ipTo4oTNPQZnlUu1jHCoHm_oU7Fe0';

    // constructor(
    //     private swPush: SwPush,
    //     private pushNotifyService: PushNotifyService) {}

    // subscribeToNotifications() {

    //     this.swPush.requestSubscription({
    //         serverPublicKey: this.VAPID_PUBLIC_KEY
    //     })
    //     .then(sub => this.pushNotifyService.addPushSubscriber(sub).subscribe())
    //     .catch(err => console.error('Could not subscribe to notifications', err));
    // }
}
