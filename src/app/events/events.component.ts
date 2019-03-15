import { Component, OnInit, Input, Output, ViewChild, ElementRef, ViewChildren, AfterViewInit, QueryList } from '@angular/core';
import { KesEvent, Person } from './model/';
import { EventsService } from './service/events.service';
import { Observable } from 'rxjs';
import { Schedule } from './model/schedule.model';
import { PushNotifyService } from './service/pushnotify.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit, AfterViewInit {

    @Input() nameNew: string;
    @Input() dateFullNew: Date;
    @Input() dateSchedule: Date;
    @Input() personAssignee: Person;

    listDatesSchedule: Date[] = [];

    @ViewChildren('donecheckbox') doneCheckbox: QueryList<ElementRef>;

    list: Observable<KesEvent[]>;
    persons: Observable<Person[]>;
    defaultPerson: Person;
    collapsedAddPanel = true;
    private defaultPersonName = 'Все пользователи';
    private selectedUser: string;


  selectedAll = false;

//  constructor(private eventsService: EventsService, private pushService: PushNotifyService) {   }
  constructor(private eventsService: EventsService) {   }

  ngOnInit() {
      this.defaultPerson = new Person(null, this.defaultPersonName);
      this.refreshAddFormDate();
      this.getItems();
      this.getPersons();
  }

  ngAfterViewInit() { }

  addItem() {
        if (this.nameNew !== '') {
            this.dateFullNew.setHours(this.dateFullNew.getHours() - this.dateFullNew.getTimezoneOffset() / 60);
            this.eventsService.addItemWithBody({name: this.nameNew, dateExpire: this.dateFullNew, done: false,
              userId: this.selectedUser,  schedule: new Schedule(this.listDatesSchedule) });
            this.clearAll();
        }
  }

  updateItem(item: KesEvent) {
      this.eventsService.updateItem(item);
  }

  updateItemCalendar(item: KesEvent) {
    if (!item.ignoredFirstFire) {
    console.log('ignored! ' + item.name);
      item.ignoredFirstFire = true;
    } else {
      this.updateItem(item);
    }
  }

  updateItemUser(item: KesEvent) {
      if (item.userId === 'null') {
          item.userId = null;
      }
      this.updateItem(item);
  }

  onChangeUser(event: Event) {
      let element = event.currentTarget as HTMLInputElement;
      this.selectedUser = element.value;
      this.list = this.eventsService.getItemsObservableForUser(element.value);
  }

  getUserName(userId: string) {
    if (userId === null || userId === 'null') {
        return this.defaultPersonName;
    }
    console.log('Retrieve for ' + userId + ' : ' + this.eventsService.userMap.get(userId));
    return this.eventsService.userMap.get(userId);
  }

  removeItem(id: string) {
    this.eventsService.removeItem(id);
  }

  changeSelectAllCheckboxState () {
    this.selectedAll = !this.selectedAll;
    this.doneCheckbox.map(cb => <HTMLInputElement>cb.nativeElement).filter(cb => cb.checked !== this.selectedAll)
    .forEach(cb => cb.click());
  }

  changeCheckboxState (item: KesEvent) {
    item.done = !item.done;
    this.updateItem(item);
  }

  getItems () {
    this.list = this.eventsService.getItemsObservable();
  }

  getPersons () {
    this.persons = this.eventsService.getPersonsObservable();
  }

  getCurrentPersons () {
      return this.eventsService.userMap;
  }

  addScheduleDate () {
    if (this.listDatesSchedule.filter(d => this.compareDatesPrecisionMinutes(d, this.dateSchedule)).length === 0) {
        this.listDatesSchedule.push(this.dateSchedule);
        const today = new Date();
        today.setHours(today.getHours() + 1);
        this.dateSchedule = today;
   }
  }

  removeScheduleDate (date: Date) {
    this.listDatesSchedule = this.listDatesSchedule.filter(d => !this.compareDatesPrecisionMinutes(d, date));
  }

  collapseAddPanel () {
      this.collapsedAddPanel = !this.collapsedAddPanel;
  }

  private compareDatesPrecisionMinutes(date1: Date, date2: Date) {
    console.log(date1 + ' vs ' + date2);
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate() &&
           date1.getHours() === date2.getHours() &&
           date1.getMinutes() === date2.getMinutes();
  }

  private getDateStr(date: number) {
    return date < 10 ? '0' + date : date;
  }

  private clearAll() {
    this.refreshAddFormDate();
    this.nameNew = '';
    this.listDatesSchedule = [];
  }

  private refreshAddFormDate() {
      const today = new Date();
      this.dateFullNew = today;
      today.setHours(today.getHours() + 1);
      this.dateSchedule = today;
  }
}


