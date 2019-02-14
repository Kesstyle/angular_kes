import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { map } from 'rxjs/operators';
import { KesEvent } from './../model/kesevent.model';

@Injectable()
export class EventsService {

  constructor(private http: Http) {   }

  getItems () {
    const kesEvents = new Array<KesEvent>();
    this.http.get('http://localhost:8089/api/events').pipe(map((res: Response) => res.json()))
    .subscribe(data => {
        for (let i = 0;; i++) {
            if (data['items'][i] === undefined) {
                break;
            }
           kesEvents.push(new KesEvent(data['items'][i].id, data['items'][i].name,
              data['items'][i].done, new Date(data['items'][i].dateExpire)));
        }
    });
    return kesEvents;
  }

}
