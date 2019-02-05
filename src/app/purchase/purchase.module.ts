import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PurchaseComponent } from './purchase/purchase.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [PurchaseComponent]
})
export class PurchaseModule { }
