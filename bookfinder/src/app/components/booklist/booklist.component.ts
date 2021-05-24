import { partitionArray } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from '../../models/book.model';
import { BooksServices } from '../../services/books.services'

@Component({
  selector: 'app-booklist',
  templateUrl: './booklist.component.html',
  styleUrls: ['./booklist.component.css'],  
})
export class BooklistComponent implements OnInit {
  private _books: Book[] = [];
  private _keyword: string;
  private _page: number = 1;
  private _lastpage: number = 1;
  loading:boolean;   

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _booksServices: BooksServices
  ){}

  ngOnInit(): void { 
    this.loading = true;
    this._route.queryParams.subscribe(( queryParams )=>{
      this.loading = true;
      let { q, page } = queryParams;
      if( !q || !page ){
        return;
      }
      
      this.page = parseInt(page);
      this._updateBooklistPage();
    })
    
    let queryParams = this._route.snapshot.queryParams
    let { q, page } = queryParams;
    page = parseInt( page );
    
    if( !q || !page ){      
      this._router.navigate(['/']);
    }

    this._booksServices.booksSubject.subscribe( books => {
      this.page = page;

      this._updateBooklistPage();
      this.loading = false;
    })

    this._booksServices.booksUpdated.subscribe( books => {
      this.page = page;

      this._updateBooklistPage();
      this.loading = false;
    });
      
    this._booksServices.searchKeywords = q;
  }

  private _updateBooklistPage(){
    this.loading = true;
    let itemsPerPage = 10;
    let start = ( this._page - 1 ) * itemsPerPage;
    let end = start + itemsPerPage;
    
    this._books = this._booksServices.bookList.slice( start, end );    
  }

  private _changePage( n: number ){
    this._updateBooklistPage();  
    // this._router.navigate(['/books'], {
    //   queryParams: {
    //     q: this._booksServices.searchKeywords,
    //     page: n
    //   }
    // }) 
    this.loading = false;
  }

  nextPage(){ 
    let currentPage = this.page;    
    this.page = this.page + 1;

    if( this.page !== currentPage )
      this._changePage( this.page )
  };

  previewsPage(){
    let currentPage = this.page;   
    this.page = this.page - 1;

    if( this.page !== currentPage )
      this._changePage( this.page );
  };

  set keyword( keyword: string) {
    if ( this._keyword === keyword )
      return;

    this._keyword = keyword;    
  }
  get keyword() { return this._keyword };  
  
  set page( page: number ){
    let itemsPerPage = 10  
    let lastPage = Math.ceil( this._booksServices.bookList.length / itemsPerPage );
      
    this._page = ( page <= 0 ) ? 1 : ( page > lastPage ) ? lastPage : page;    
  }
  get page() { return this._page }; 

  get books() {    
    if( !this._books || !Array.isArray( this._books ))      
      return []    
    
    return this._books
  };
}
