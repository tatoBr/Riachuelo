// src/app/auth/auth.service.ts
import { Injectable, EventEmitter } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({ providedIn: 'root' })
export class AuthService {
  authEmitter = new EventEmitter<boolean>()  
  constructor(public jwtHelper: JwtHelperService = new JwtHelperService()) {}
 
  public isAuthenticated(): boolean {    
    const token = localStorage.getItem('token') || undefined;    
    if( token ){
      console.log( 'token exist ');
      let isTokenExpired = this.jwtHelper.isTokenExpired( token );
      if( isTokenExpired ) localStorage.removeItem( 'token' );
      this.authEmitter.emit( true );
      return !isTokenExpired;
    }         
    
    return false;
  }
}