import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserServices } from 'src/app/services/user.services';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.css']
})
export class SubscribeComponent implements OnInit {
  private _error: string = '';  
  loading = false;

  constructor(
    private _userServices: UserServices,
    private _router: Router    
  ) {}
  ngOnInit(): void {  
    this._userServices.errorSubject.subscribe( error => {
      this.loading = false;
      this._error = error;      
    });

    this._userServices.userSubject.subscribe( user => {
      this.loading = false;
      if( !user ){
        return;
      }

      this._router.navigate(['/profile']);
    })
  }

  onSubmit(form: NgForm ) {    
    if( !form.valid )
      return;    
    
    this.loading = true;
    let user = { ...form.value }    
    this._userServices.postUser( user );
  }  

  get error(){ return this._error };  
}
