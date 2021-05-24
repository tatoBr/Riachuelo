import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserServices } from 'src/app/services/user.services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {  
  private _error: string = '';
  private _errorMessage = '';
  loading = false;
  constructor(
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _userServices: UserServices
  ) {}
  
  ngOnInit(): void {
    this._userServices.errorSubject.subscribe(error => {
      this.loading = false;
      this._error = error;
    });

    this._userServices.userSubject.subscribe( user => {
      this.loading = false;
      if (!user) {
        return;
      }

      this._router.navigate(['/profile']);
    })
  }

  onSubmit(form: NgForm) {
    if (!form.valid)
      return;

    this.loading = true;
    let { email, password } = form.value;
    this._userServices.logUserIn( email, password );
  }

  get error() { return this._error };
  get errorMessage() { return this._errorMessage };

}
