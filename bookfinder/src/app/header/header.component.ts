import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { UserServices } from '../services/user.services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {  
  isAuthenticated;
  userSub: Subscription; 

  constructor(
    private _userService: UserServices,
    private _authService: AuthService,
    private _router: Router
  ){    
    this.isAuthenticated = this._authService.isAuthenticated();
  }

  ngOnInit(): void {   
    this.isAuthenticated = this._authService.isAuthenticated();
    this._authService.authEmitter.subscribe( value => this.isAuthenticated = value );
    this._userService.user.next()
  }
  ngOnDestroy():void {    
    this.userSub.unsubscribe();
  }

  logout(){
    localStorage.removeItem('token');
    this.isAuthenticated=false;
    this._router.navigate(['/']);
  }
  
}
