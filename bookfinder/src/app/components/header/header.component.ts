import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { UserServices } from '../../services/user.services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {  
  isLoggedIn: boolean = false;
  userSub: Subscription; 

  constructor(
    private _userService: UserServices,    
    private _router: Router
  ){}

  ngOnInit(): void {
    this.isLoggedIn = this._userService.isLoggedIn();
    this._userService.userIsLoggedEmitter.subscribe( logged => {
      this.isLoggedIn = logged;
    })
  }

  ngOnDestroy():void {    
    this.userSub.unsubscribe();
  }

  logout(){
    this._userService.logUserOut();  
    this._router.navigate(['/']);
  }
  
}
