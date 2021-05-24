import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BooksServices } from 'src/app/services/books.services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']  
})
export class HomeComponent implements OnInit {
  private _query: string = ""

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _booksServices: BooksServices
  ) {}
  ngOnInit(): void {
  }
  set query( value: string ) {
    this._query = value;
  }

  onClickSearch() {  
    if( !this._query ) return;
    this._booksServices.searchKeywords = this._query  
    this._router.navigate(['/books'], {
      relativeTo: this._route,
      queryParams:{
        q: this._query,
        page: 1
      }
    });
  }
}
