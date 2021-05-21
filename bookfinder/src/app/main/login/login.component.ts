import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserServices } from 'src/app/services/user.services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {   
  private _form: FormGroup;
  private _errorMessage: string = '';
  constructor(
    private _router: Router,
    private _formBuilder: FormBuilder,    
    private _userService: UserServices
  ) {
    this._form = this._formBuilder.group({
      email: '',
      password: ''
    })
  } 
  ngOnInit(): void {
    this._userService.user.subscribe( user => {
      if( user ) this._router.navigate(['/'])
      
    })
  }
  
  login(){    
    this._userService.loginUser( this._form.getRawValue())
    .then(() => this._router.navigate(['/subscribe']))
    .catch( error => {
      this._errorMessage = error.message;
      console.log( 'log from component', error.message );
    })
  }    

  get form(){ return this._form };
  get errorMessage(){ return this._errorMessage };

}
