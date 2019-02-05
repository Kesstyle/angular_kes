import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HelloWorldComponent } from '../hello-world/hello-world.component';
import {PurchaseComponent} from '../purchase/purchase/purchase.component';

const routes: Routes = [
  { path: 'hello-world',  component: HelloWorldComponent },
  { path: 'purchase',  component: PurchaseComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
