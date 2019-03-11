import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class PushNotifyService {

    constructor(private http: HttpClient) {
    }

    addPushSubscriber(sub: any) {
        return this.http.post('/api/notifications', sub);
    }

    pushUsers() {
        return this.http.post('/api/push', null);
    }

}
