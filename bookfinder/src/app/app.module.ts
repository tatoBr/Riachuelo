import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router'; 

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './main/login/login.component';
import { BooklistComponent } from './main/booklist/booklist.component';
import { BookDetailsComponent as BookDetailsComponent } from './main/bookdetails/details.component';
import { BookcardComponent } from './main/booklist/bookcard/bookcard.component';
import { SubscribeComponent } from './main/subscribe/subscribe.component';
import { HomeComponent } from './main/home/home.component';

import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { AuthGuardService } from './auth/auth-guard.service';
import { LoggedGuardService } from './auth/logged-guard.service'

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent, canActivate: [LoggedGuardService] },
  { path: 'subscribe', component: SubscribeComponent, canActivate: [LoggedGuardService]  },
  { path: 'books', component: BooklistComponent },
  { path: 'books/:id', component: BookDetailsComponent },
]
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainComponent,
    LoginComponent,
    BooklistComponent,
    BookDetailsComponent,
    BookcardComponent,
    SubscribeComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule.forRoot( routes )
  ],
  providers: [{
    provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService],
  bootstrap: [AppComponent]
})
export class AppModule { }
