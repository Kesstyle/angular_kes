import { Injectable, NgZone } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { KesEvent, Person } from './../model/';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Schedule } from '../model/schedule.model';

@Injectable()
export class EventsService {

  baseUrl = environment.baseApiUrl;
  private eventsList: KesEvent[] = new Array();
  private personsList: Person[] = new Array();
  private offset = new Date().getTimezoneOffset() / 60;
  userMap = new Map();

  constructor(private http: Http, private zone: NgZone) {   }

  addItem (event: KesEvent) {
    const body = {id: event.id, name: event.name, dateExpire: event.dateExpire, done: event.done, userId: event.userId};
    return this.addItemWithBody(body);
  }

  addItemWithBody (body: any) {
    return this.http.post(`${this.baseUrl}` + 'event', body, this.getCorsOptions())
        .subscribe(data => console.log('Okay, we added: ' + data));
  }

  updateItem (event: KesEvent) {
    const dateToSet = event.dateExpire;
    dateToSet.setHours(dateToSet.getHours() - this.offset);
    const body = {id: event.id, name: event.name, dateExpire: dateToSet, done: event.done, userId: event.userId};
    return this.updateItemWithBody(body);
  }

  updateItems (events: KesEvent[]) {
    let body = '[';
    events.forEach(event => {
        const dateToSet = event.dateExpire;
        dateToSet.setHours(dateToSet.getHours() - this.offset);
        body = body + ',' + {id: event.id, name: event.name, dateExpire: dateToSet, done: event.done, userId: event.userId};
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

  getItemsObservableAbstract (url: string) {
     this.eventsList = new Array();

     return Observable.create((observer) => {
      const eventSource = new EventSource(url);

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
                    e.userId = json['userId'];
                    const dateToSet = new Date(json['dateExpire']);
                    dateToSet.setHours(dateToSet.getHours() + this.offset);
                    e.dateExpire = dateToSet;
                });
            } else {
                const dateToSet = new Date(json['dateExpire']);
                dateToSet.setHours(dateToSet.getHours() + this.offset);
                this.eventsList.push(new KesEvent(json['id'], json['name'],
                    json['done'], dateToSet, new Schedule([]), this.isInPast(dateToSet), json['userId'], false));
            }
          this.eventsList.sort((a, b) => this.eventsComparator(a, b));
          this.eventsList.forEach(e => e.inPast = this.isInPast(e.dateExpire));
          observer.next(this.eventsList);
        });
      eventSource.onerror = (error) => observer.error('eventSource.onerror: ' + error);
      return () => eventSource.close();
    });
  }

   getItemsObservable () {
     return this.getItemsObservableAbstract(`${this.baseUrl}events`);
  }

  getItemsObservableForUser (userId: string) {
      if (userId === null || userId === 'null') {
          return this.getItemsObservable();
      }
      return this.getItemsObservableAbstract(`${this.baseUrl}events?UID_H=` + userId);
  }

  getPersonsObservable () {
     this.personsList = new Array();

     return Observable.create((observer) => {
      const personSource = new EventSource(`${this.baseUrl}users`);

      personSource.onmessage = (person) =>
        this.zone.run(() => {
          const json = JSON.parse(person.data);
          let id: string = json['userId'];
          const name: string = json['name'];
            if (id.startsWith('--')) {
                id = id.replace('--', '');
                this.personsList = this.personsList.filter(e => {
                    return e.id !== id;
                });
                this.userMap.delete(id);
            } else if (id.startsWith('*')) {
                id = id.replace('*', '');
                this.personsList.filter(p => p.id === id).forEach(p => {
                    p.name = name;
                });
                console.log('Updated to map: ' + id + ' ' + name);
                this.userMap.set(id, name);
            } else {
                this.userMap.set(id, name);
                 console.log('Added to map: ' + id + ' ' + name);
                this.personsList.push(new Person(id, name));
            }
          observer.next(this.personsList);
        });
      personSource.onerror = (error) => observer.error('personSource.onerror: ' + error);
      return () => personSource.close();
    });
    }

    isInPast(date: Date) {
        return new Date() > date;
    }

    private eventsComparator(a: KesEvent , b: KesEvent) {
        if (a.done) {
            return 1;
        }
        if (b.done) {
            return -1;
        }
        return a.dateExpire < b.dateExpire ? -1 : 1;
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
