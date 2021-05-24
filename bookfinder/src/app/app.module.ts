import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router'; 

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { SubscribeComponent } from './components/subscribe/subscribe.component';
import { LoginComponent } from './components/login/login.component';
import { FavoriteCardComponent } from './components/user-profile/favorite-card/favorite-card.component';
import { BooklistComponent } from './components/booklist/booklist.component';
import { BookDetailsComponent } from './components/booklist/bookdetails/bookdetails.component';
import { BookcardComponent } from './components/booklist/bookcard/bookcard.component';
import { LoadingComponent } from './components/shared/loading/loading.component'

import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { LoggedGuardService } from './auth/logged-guard.service'
import { AuthGuardService  } from './auth/auth-guard.service';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent, canActivate: [LoggedGuardService] },
  { path: 'subscribe', component: SubscribeComponent, canActivate: [LoggedGuardService]  },
  { path: 'books', component: BooklistComponent },
  { path: 'books/:id', component: BookDetailsComponent },
  { path: 'profile', component: UserProfileComponent, canActivate: [ AuthGuardService ] }
]
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    BooklistComponent,
    BookDetailsComponent,
    BookcardComponent,
    SubscribeComponent,
    HomeComponent,
    LoadingComponent,
    UserProfileComponent,
    FavoriteCardComponent
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
