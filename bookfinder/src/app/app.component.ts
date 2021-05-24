import { Component, OnInit } from '@angular/core';
import { UserServices } from './services/user.services';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'bookfinder';
  isLoggedIn: boolean = false;
  loading = false;

  constructor(private _userServices: UserServices) { }

  ngOnInit(): void {
    this.loading = true;
    this._userServices.userIsLoggedEmitter.subscribe( logged => {
      this.isLoggedIn = logged;
      this.loading = false;
    });

    this._userServices.logUserWithToken()
  }
}
