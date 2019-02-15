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

  addItem (event: KesEvent) {
    const body = {id: event.id, name: event.name, dateExpire: event.dateExpire, done: event.done};
    return this.addItemWithBody(body);
  }

  addItemWithBody (body: any) {
    return this.http.post(`${this.baseUrl}` + 'event', body, this.getCorsOptions())
        .subscribe(data => console.log('Okay, we added: ' + data));
  }

  updateItem (event: KesEvent) {
    const body = {id: event.id, name: event.name, dateExpire: event.dateExpire, done: event.done};
    return this.updateItemWithBody(body);
  }

  updateItems (events: KesEvent[]) {
    let body = '[';
    events.forEach(event => {
        body = body + ',' + {id: event.id, name: event.name, dateExpire: event.dateExpire, done: event.done};
    });
    body = body + ']';
    return this.updateItemWithBody(body);
  }

  updateItemWithBody (body: any) {
    return this.http.put(`${this.baseUrl}` + 'event', body, this.getCorsJsonOptions())
        .subscribe(data => console.log('Okay, we updated: ' + data));
  }

  removeItem (id: string) {
    return this.http.delete(`${this.baseUrl}` + 'event/' + id, this.getCorsOptions())
        .subscribe(data => console.log('Deleted: ' + data));
  }


   getItemsObservable () {
     this.eventsList = new Array();

     return Observable.create((observer) => {
      const eventSource = new EventSource(`${this.baseUrl}events`);

      eventSource.onmessage = (event) =>
        this.zone.run(() => {
          const json = JSON.parse(event.data);
          let id: string = json['id'];
            if (id.startsWith('--')) {
                id = id.replace('--', '');
                this.eventsList = this.eventsList.filter(e => {
                    return e.id !== id;
                });
            } else if (id.startsWith('*')) {
                id = id.replace('*', '');
                this.eventsList.filter(e => e.id === id).forEach(e => {
                    e.name = json['name'];
                    e.done = json['done'];
                    e.dateExpire = json['dateExpire'];
                });
            } else {
                this.eventsList.push(new KesEvent(json['id'], json['name'],
                    json['done'], new Date(json['dateExpire'])));
            }
          observer.next(this.eventsList);
        });
      eventSource.onerror = (error) => observer.error('eventSource.onerror: ' + error);
      return () => eventSource.close();
    });
    }

    private getCorsOptions() {
        const headers = new Headers();
        headers.append('Access-Control-Max-Age', `*`);
        return new RequestOptions({ headers: headers });
    }

    private getCorsJsonOptions() {
        const headers = new Headers();
        headers.append('Access-Control-Max-Age', `*`);
        headers.append('Content-type', 'application/json');
        return new RequestOptions({ headers: headers });
    }
}
