import { Component, OnInit, Input, Output } from '@angular/core';
import { Http } from '@angular/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent implements OnInit {

    @Input() nameNew: string;
    @Input() dateDayNew: number;
    @Input() dateMonthNew: KesMonth;
    @Input() dateYearNew: number;
    @Input() dateHourNew: number;
    @Input() dateMinuteNew: number;

    days = [];
    years = [];
    minutes = [];
    hours = [];
    months = [];

  i = 10000;

//   list = [{
//     items: [
//         { id: 1, name: "Хлеб", done: false, dateExpire: new Date('Mon Feb 11 2019 20:25:12 GMT+0300') },
//         { id: 2, name: "Масло", done: false, dateExpire: new Date('Mon Feb 11 2019 20:23:12 GMT+0300') },
//         { id: 3, name: "Картофель", done: true, dateExpire: new Date('Mon Feb 11 2019 20:22:12 GMT+0300') },
//         { id: 4, name: 'Сыр', done: false, dateExpire: new Date('2018-05-05T00:00:00') }
//     ]]
// };
    list: KesEvents;

  selectedAll = false;

  constructor(private http: Http) {   }

  ngOnInit() {
      for (let i = 1; i <= 31; i++) {
        this.days.push(i);
      }
      for (let i = 2010; i <= 2040; i++) {
        this.years.push(i);
      }
      for (let i = 0; i <= 59; i++) {
        this.minutes.push(i);
      }
      for (let i = 0; i <= 23; i++) {
        this.hours.push(i);
      }
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

      this.list = new KesEvents([new KesEvent(1, 'Хлеб', true, new Date('Mon Feb 11 2019 20:25:12 GMT+0300')),
                                          new KesEvent(2, 'Масло', false, new Date('Mon Feb 11 2019 20:23:12 GMT+0300')),
                                          new KesEvent(3, 'Картофель', true, new Date('Mon Feb 11 2019 20:22:12 GMT+0300')),
                                        new KesEvent(4, 'Сыр', false, new Date('2018-05-05T00:00:00'))]);
    //  this.list = this.getItems();
    this.getItems();
  }

//   addItem(text, price) {
//         price = parseFloat(price); // преобразуем введенное значение к числу
//         if (text !== '' && !isNaN(price)) {
//             this.list.items.push({ purchase: text, price: price, done: false });
//         }
//   }

  addItem() {
        const dateMonth = this.dateMonthNew.id;
        if (this.nameNew !== '' && !isNaN(dateMonth) && !isNaN(this.dateYearNew) && !isNaN(dateMonth)
        && !isNaN(this.dateMinuteNew) && !isNaN(this.dateHourNew)) {
            const finalDateStr = this.dateYearNew + '-' + this.getDateStr(dateMonth) + '-' + this.getDateStr(this.dateDayNew) +
             'T' + this.getDateStr(this.dateHourNew) + ':' + this.getDateStr(this.dateMinuteNew) + ':00';
            const finalDate = new Date(finalDateStr);
            this.list.items.push({id: this.i, name: this.nameNew, dateExpire: finalDate, done: false });
            this.i++;
            this.clearAll();
        }
  }

  removeItem(id: number) {
    this.list.items = this.list.items.filter(item => item.id !== id);
  }

  changeSelectAllCheckboxState () {
    this.selectedAll = !this.selectedAll;
    if (this.selectedAll) {
        this.list.items.filter(item => !item.done).forEach(item => item.done = true)
    } else {
        this.list.items.filter(item => item.done).forEach(item => item.done = false)
    }
  }

  changeCheckboxState (id: number) {
    this.list.items.filter(item => item.id === id).forEach(item => item.done = !item.done);
  }

  getItems () {
    this.http.get('http://localhost:8089/api/events').pipe(map((res: Response) => res.json()))
    .subscribe(data => {
        for (let i = 0;; i++) {
           this.list.items.push(new KesEvent(data['items'][i].id, data['items'][i].name,
              data['items'][i].done, new Date(data['items'][i].dateExpire)));
        }
    })
  }

  private getDateStr(date: number) {
    return date < 10 ? '0' + date : date;
  }

  private clearAll() {
    this.dateDayNew = null;
    this.dateYearNew = null;
    this.dateMonthNew = null;
    this.dateHourNew = null;
    this.dateMinuteNew = null;
    this.nameNew = '';
  }
}

class KesMonth {

    constructor(public id: number, public name: string) {}
}

class KesEvents {
    constructor(public items: KesEvent[]) {}
}

class KesEvent {
    constructor(public id: number, public name: string, public done: boolean, public dateExpire: Date) {}
}
