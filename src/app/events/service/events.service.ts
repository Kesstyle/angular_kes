import { Injectable, NgZone } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { map } from 'rxjs/operators';
import { KesEvent } from './../model/kesevent.model';
import { Observable } from 'rxjs';

@Injectable()
export class EventsService {

  baseUrl = 'http://localhost:8089/api/';
  private eventsList: KesEvent[] = new Array();

  constructor(private http: Http, private zone: NgZone) {   }

  getItems () {
    const kesEvents = new Array<KesEvent>();
    this.http.get('${this.baseUrl}event').pipe(map((res: Response) => res.json()))
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

  addItem (event: KesEvent) {
    const body = {id: event.id, name: event.name, dateExpire: event.dateExpire, done: event.done};
    return this.addItemWithBody(body);
  }

  addItemWithBody (body: any) {
    console.log('Trying to add item...');
    const headers = new Headers();
    headers.append('Access-Control-Allow-Method', `*`);
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Headers', `*`);
    headers.append('Access-Control-Max-Age', `*`);
    headers.append('Content-type', `application/json`);
    const options = new RequestOptions({ headers: headers });
    return this.http.post('http://localhost:8089/api/event', JSON.stringify(body), options)
        .pipe(map((res: Response) => res.json())).subscribe(data => {
        console.log('Okay, we added ' + data);
    });
  }


   getItemsObservable () {
     this.eventsList = new Array();

     return Observable.create((observer) => {
      const eventSource = new EventSource(`${this.baseUrl}events`);

      eventSource.onmessage = (event) =>
        this.zone.run(() => {
          const json = JSON.parse(event.data);
          this.eventsList.push(new KesEvent(json['id'], json['name'],
              json['done'], new Date(json['dateExpire'])));
          observer.next(this.eventsList);
        });
      eventSource.onerror = (error) => observer.error('eventSource.onerror: ' + error);
      return () => eventSource.close();
    });
    }

}
