import { Injectable, NgZone } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { KesEvent } from './../model/kesevent.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class EventsService {

  baseUrl = environment.baseApiUrl;
  private eventsList: KesEvent[] = new Array();
  private offset = new Date().getTimezoneOffset() / 60;

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
    const dateToSet = event.dateExpire;
    console.log(dateToSet);
    dateToSet.setHours(dateToSet.getHours() - this.offset);
    const body = {id: event.id, name: event.name, dateExpire: dateToSet, done: event.done};
    return this.updateItemWithBody(body);
  }

  updateItems (events: KesEvent[]) {
    let body = '[';
    events.forEach(event => {
        const dateToSet = event.dateExpire;
        dateToSet.setHours(dateToSet.getHours() - this.offset);
        body = body + ',' + {id: event.id, name: event.name, dateExpire: dateToSet, done: event.done};
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
                    const dateToSet = new Date(json['dateExpire']);
                    dateToSet.setHours(dateToSet.getHours() + this.offset);
                    e.dateExpire = dateToSet;
                });
            } else {
                const dateToSet = new Date(json['dateExpire']);
                dateToSet.setHours(dateToSet.getHours() + this.offset);
                this.eventsList.push(new KesEvent(json['id'], json['name'],
                    json['done'], dateToSet));
            }
          this.eventsList.sort((a, b) => this.eventsComparator(a, b));
          observer.next(this.eventsList);
        });
      eventSource.onerror = (error) => observer.error('eventSource.onerror: ' + error);
      return () => eventSource.close();
    });
    }

    private eventsComparator(a: KesEvent , b: KesEvent) {
        if (a.done) {
            return 1;
        }
        if (b.done) {
            return -1;
        }
        return a.dateExpire < b.dateExpire ? -1 : 1
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
