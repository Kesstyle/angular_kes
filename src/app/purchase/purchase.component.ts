import { Component, OnInit, Input, Output } from '@angular/core';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent implements OnInit {

    @Input() nameNew: string;
    @Input() dateDayNew: string;
    @Input() dateMonthNew: string;
    @Input() dateYearNew: string;
    @Input() dateHourNew: string;
    @Input() dateMinuteNew: string;

  i = 5;

  list = {
    items: [
        { id: 1, purchase: "Хлеб", done: false, dateExpire: new Date('Mon Feb 11 2019 20:25:12 GMT+0300') },
        { id: 2, purchase: "Масло", done: false, dateExpire: new Date('Mon Feb 11 2019 20:23:12 GMT+0300') },
        { id: 3, purchase: "Картофель", done: true, dateExpire: new Date('Mon Feb 11 2019 20:22:12 GMT+0300') },
        { id: 4, purchase: 'Сыр', done: false, dateExpire: new Date('2018-05-05T00:00:00') }
    ]
};

  selectedAll = false;

  constructor() { }

  ngOnInit() {
  }

//   addItem(text, price) {
//         price = parseFloat(price); // преобразуем введенное значение к числу
//         if (text !== '' && !isNaN(price)) {
//             this.list.items.push({ purchase: text, price: price, done: false });
//         }
//   }

  addItem() {
        const dateDay = parseInt(this.dateDayNew, 10);
        const dateMonth = parseInt(this.dateMonthNew, 10);
        const dateYear = parseInt(this.dateYearNew, 10);
        const dateHour = parseInt(this.dateHourNew, 10);
        const dateMinute = parseInt(this.dateMinuteNew, 10);
        if (this.nameNew !== '' && !isNaN(dateDay) && !isNaN(dateMonth) && !isNaN(dateYear)) {
            const finalDateStr = dateYear + '-' + this.getDateStr(dateMonth) + '-' + this.getDateStr(dateDay) +
             'T' + this.getDateStr(dateHour) + ':' + this.getDateStr(dateMinute) + ':00';
            const finalDate = new Date(finalDateStr);
            this.list.items.push({id: this.i, purchase: this.nameNew, dateExpire: finalDate, done: false });
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

  private getDateStr(date: number) {
    return date < 10 ? '0' + date : date;
  }

  private clearAll() {
    this.dateDayNew = '';
    this.dateYearNew = '';
    this.dateMonthNew = '';
    this.dateHourNew = '';
    this.dateMinuteNew = '';
    this.nameNew = '';
  }
}
