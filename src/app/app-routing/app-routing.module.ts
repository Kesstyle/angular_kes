import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {PurchaseComponent} from '../purchase/purchase.component';

const routes: Routes = [
  { path: 'purchase',  component: PurchaseComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
