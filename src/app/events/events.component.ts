import { Component, OnInit, Input, Output, ViewChild, ElementRef, ViewChildren, AfterViewInit, QueryList } from '@angular/core';
import { KesEvent } from './model/';
import { EventsService } from './service/events.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit, AfterViewInit {

    @Input() nameNew: string;
    @Input() dateFullNew: Date;

    @ViewChildren('donecheckbox') doneCheckbox: QueryList<ElementRef>;

    list: Observable<KesEvent[]>;

  selectedAll = false;

  constructor(private eventsService: EventsService) {   }

  ngOnInit() {
      this.refreshAddFormDate();
      this.getItems();
  }

  ngAfterViewInit() { }

  addItem() {
        if (this.nameNew !== '') {
            this.dateFullNew.setHours(this.dateFullNew.getHours() - this.dateFullNew.getTimezoneOffset() / 60);
            this.eventsService.addItemWithBody({name: this.nameNew, dateExpire: this.dateFullNew, done: false });
            this.clearAll();
        }
  }

  updateItem(item: KesEvent) {
      this.eventsService.updateItem(item);
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

  private getDateStr(date: number) {
    return date < 10 ? '0' + date : date;
  }

  private clearAll() {
    this.refreshAddFormDate();
    this.nameNew = '';
  }

  private refreshAddFormDate() {
      const today = new Date();
      this.dateFullNew = today;
  }
}


