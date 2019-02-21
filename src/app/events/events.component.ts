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
    @Input() dateDayNew: number;
    @Input() dateMonthNew: KesMonth;
    @Input() dateYearNew: number;
    @Input() dateHourNew: number;
    @Input() dateMinuteNew: number;

    @ViewChildren('donecheckbox') doneCheckbox: QueryList<ElementRef>;

    months = [];

    list: Observable<KesEvent[]>;

  selectedAll = false;

  constructor(private eventsService: EventsService) {   }

  ngOnInit() {
      this.months.push(new KesMonth(1, "Январь"));
      this.months.push(new KesMonth(2, "Февраль"));
      this.months.push(new KesMonth(3, "Март"));
      this.months.push(new KesMonth(4, "Апрель"));
      this.months.push(new KesMonth(5, "Май"));
      this.months.push(new KesMonth(6, "Июнь"));
      this.months.push(new KesMonth(7, "Июль"));
      this.months.push(new KesMonth(8, "Август"));
      this.months.push(new KesMonth(9, "Сентябрь"));
      this.months.push(new KesMonth(10, "Октябрь"));
      this.months.push(new KesMonth(11, "Ноябрь"));
      this.months.push(new KesMonth(12, "Декабрь"));

      this.refreshAddFormDate();

      this.getItems();
  }

  ngAfterViewInit() { }

  addItem() {
        const dateMonth = this.dateMonthNew.id;
        if (this.nameNew !== '' && !isNaN(dateMonth) && !isNaN(this.dateYearNew) && !isNaN(dateMonth)
        && !isNaN(this.dateMinuteNew) && !isNaN(this.dateHourNew)) {
            const finalDateStr = this.dateYearNew + '-' + this.getDateStr(dateMonth) + '-' + this.getDateStr(this.dateDayNew) +
             'T' + this.getDateStr(this.dateHourNew) + ':' + this.getDateStr(this.dateMinuteNew) + ':00';
            const finalDate = new Date(finalDateStr);
            this.eventsService.addItemWithBody({name: this.nameNew, dateExpire: finalDate, done: false });
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
      this.dateDayNew = today.getDate();
      this.dateYearNew = today.getFullYear();
      this.dateHourNew = today.getHours();
      this.dateMinuteNew = today.getMinutes();
      this.dateMonthNew = this.months[today.getMonth()];
  }
}

class KesMonth {

    constructor(public id: number, public name: string) {}
}

