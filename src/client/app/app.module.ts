import {NgModule} from '@angular/core';
import {StoreModule} from '@ngrx/store';
import {BrowserModule} from '@angular/platform-browser';
import {APP_BASE_HREF} from '@angular/common';
import {RouterModule} from '@angular/router';
import {HttpModule} from '@angular/http';
import {AppComponent} from './app.component';
import {routes} from './app.routes';
import {GraphModule} from './graph/graph.module';
import {HomeModule} from './home/home.module';
import {SharedModule} from './shared/shared.module';
import {cardsReducer} from './reducer/cards.reducer';
import {CARDS} from './reducer/reducer-constants';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot(routes),
    GraphModule,
    HomeModule,
    SharedModule.forRoot(),
    StoreModule.provideStore({
      [CARDS]: cardsReducer
    })
  ],
  declarations: [
    AppComponent
  ],
  providers: [{
    provide: APP_BASE_HREF,
    useValue: '<%= APP_BASE %>'
  }],
  bootstrap: [AppComponent]

})

export class AppModule {
}
