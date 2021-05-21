import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Book } from 'src/app/models/book.model';
import { BookService } from '../../services/book.services' 
import { UserServices } from 'src/app/services/user.services';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class BookDetailsComponent implements OnInit {
  
  private _services = new BookService();
  private _book:Book;

  private _returnPage;
  private _returnQuery;
  private _isAuthenticated;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _authService: AuthService,
    private _userServices: UserServices  
  ){
    let queryParamms = this.route.snapshot.queryParams;
    let params = this.route.snapshot.params;
    
    let { q, page } = queryParamms;
    let { id } = params;

    this._returnQuery = q;
    this._returnPage = page;
    this._isAuthenticated = this._authService.isAuthenticated();    

    this._services.fetchBook( id )
      .then( data => {        
        this._book = data
        console.log( this._book );
      })
      .catch( error => {        
        console.error( error );
      });    
  }
  
  get book():Book{ return this._book }
  get isAuthenticated(){ return this._isAuthenticated }

  onReturn(){
    this.router.navigate(['/books'], {      
      queryParams:{
        q: this._returnQuery,
        page: this._returnPage
      }
    });
  }

  onFavorite(){    
    this._services.favorireBook( this.book.id );
    console.log( this._userServices.userdata );
  }

  ngOnInit(): void {
    this._authService.authEmitter.subscribe( value => this._isAuthenticated = value );
    if( this.isAuthenticated ){
      
    }
  }

}
