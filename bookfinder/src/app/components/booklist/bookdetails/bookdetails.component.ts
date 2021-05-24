import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { BooksServices } from 'src/app/services/books.services';
import { UserServices } from 'src/app/services/user.services';
import { Book } from '../../../models/book.model';

@Component({
  selector: 'app-bookdetails',
  templateUrl: './bookdetails.component.html',
  styleUrls: ['./bookdetails.component.css'],
})
export class BookDetailsComponent implements OnInit {
  private _book: Book;
  private _paramsSubscription: Subscription;
  private _index: number;
  private _isFavorite: boolean;
  isLogged = false;
  loading = true;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _booksServices: BooksServices,
    private _userServices: UserServices
  ) { };

  get book(): Book {
    return this._book;
  }

  private _initiateBook(params?: Params) {
    let books = this._booksServices.bookList;

    if (!params || !params.hasOwnProperty('id')) {
      this._router.navigate(['/']);
      return;
    }

    let { id } = params

    if( this.isLogged ){
      this._isFavorite = this._userServices.favoriteBooks.includes( id );
    }
    if (books.length >= 0) {
      let index = books.findIndex(book => book.id === id)
      if (index >= 0) {
        this._book = books[index];        
        return;
      }
    }
    this._booksServices.getBookById(id).subscribe(book => {
      if (!book)
        return this._router.navigate(['/']);

      this._book = book;
      this.loading = false;
      return;
    })
  }


  goBackToBookList() {
    this._router.navigate(     
      ['/books'],
      {
        queryParams: {
          q: this._booksServices.searchKeywords,
          page: 1
        }
      });
  }

  setBookAsFavorite() {
    if (!this.isLogged)
      return;

    this.loading = true;

    let bookId = this._book.id;
    if (this.isFavorite) {
      let favoriteBooks = this._userServices.favoriteBooks;
      let index = favoriteBooks.indexOf(bookId);
      console.log('index', index);
      if (index < 0) {
        this.loading = false;
      }
      this._userServices.removeBookFromFavorite(this._book.id);
      favoriteBooks.splice(index, 1);
      this._isFavorite = false;
      return;
    }

    this._userServices.addBookToFavorite(bookId);
    this._isFavorite = true;
  }

  ngOnInit() {
    this.isLogged = this._userServices.isLoggedIn();
    this._initiateBook(this._route.snapshot.params);

    if (this.isLogged && this._book)
      this._isFavorite = this._userServices.favoriteBooks.includes(this._book.id)

    this._paramsSubscription = this._route.params.subscribe((params: Params) => {
      this._initiateBook(params);
    })

    this._userServices.userIsLoggedEmitter.subscribe(logged => {
      this.isLogged = logged;
    })
    this._userServices.favoriteUpdateEmitter.subscribe(next => {
      this.loading = false;
    })

    this.loading = false;
  }

  ngOnDestroy() {
    this._paramsSubscription.unsubscribe();
  }

  get isFavorite() { return this._isFavorite };
}
