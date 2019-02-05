import { Component, OnInit, Input, Output } from '@angular/core';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent implements OnInit {

    @Input() nameNew: string;
    @Input() priceNew: string;

  i = 5;

  list = {
    items: [
        { id: 1, purchase: "Хлеб", done: false, price: 15.9 },
        { id: 2, purchase: "Масло", done: false, price: 60 },
        { id: 3, purchase: "Картофель", done: true, price: 22.6 },
        { id: 4, purchase: "Сыр", done: false, price: 310 }
    ]
};

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
        const price = parseFloat(this.priceNew); // преобразуем введенное значение к числу
        if (this.nameNew !== '' && !isNaN(price)) {
            this.list.items.push({id: this.i, purchase: this.nameNew, price: price, done: false });
            this.i++;
        }
  }

  removeItem(id: number) {
    this.list.items = this.list.items.filter(item => item.id !== id);
  }
}
