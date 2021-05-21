import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserServices } from 'src/app/services/user.services';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.css']
})
export class SubscribeComponent implements OnInit {
  form: FormGroup;

  private _error: Boolean = false;
  private _errorMessage = '';

  constructor(
    private _userServices: UserServices,
    private _formBuilder: FormBuilder,
    private _router: Router    
  ) {    
    this.form = this._formBuilder.group({
      username: '',
      email: '',
      password: ''
    })
  }
  ngOnInit(): void {    
    this._userServices.user.subscribe( user => {
      if( user ) this._router.navigate(['/']);
    })
  }

  subscribe() {
    this._userServices.postUser(this.form.getRawValue())
      .then( () => this._router.navigate(['/login']))
      .catch( error => this._errorMessage = error.message );
  }

  get error(){ return this._error };
  get errorMessage(){ return this._errorMessage }

}
