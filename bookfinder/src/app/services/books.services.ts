import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, Output, EventEmitter } from '@angular/core';

import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment'
import { Book } from '../models/book.model';


@Injectable({ providedIn: 'root' })
export class BooksServices {
  private _API_DOMAIN: string = environment.API_DOMAIN;
  private _bookList: Book[] = [];
  private _search_keyword: string = '';

  @Output()
  booksUpdated = new EventEmitter<Book[]>();
  booksSubject = new Subject<Book[]>();

  constructor(
    private _httpClient: HttpClient
  ) { }

  private _fetchBooks = () => {
    const domain = this._API_DOMAIN
    const protocol: string = 'http';
    const path = "/api/books";

    let fetchURL = `${protocol}://${domain}${path}?q=${this._search_keyword}`;

    this._httpClient.get(fetchURL, { observe: 'response' })
      .pipe(map((responseData: any) => {
        let booksArray: Book[] = [];
        for (let key in responseData.body) {
          booksArray.push(Book.mapBook(responseData.body[key]));
        }
        return booksArray;
      }))
      .subscribe(
        response => {
          this._bookList = response;

          this.booksUpdated.emit(this._bookList);
          this.booksSubject.next(this._bookList);
        },
        error => {
          console.error(error)
        }
      )
  }

  get bookList() { return this._bookList; };

  get searchKeywords(): string {
    return this._search_keyword;
  }
  set searchKeywords(keywords: string) {
    console.log('new keyword', keywords)
    console.log('old keyword', this._search_keyword)
    if (this._search_keyword === keywords && this._bookList.length > 0) {
      console.log('keywords are equal, do nothing')
      this.booksUpdated.emit(this.bookList)
      return;
    }

    this._search_keyword = keywords;
    this._fetchBooks();
    return;
  }

  getBookById(id: string) {
    const domain = this._API_DOMAIN
    const protocol: string = 'http';
    const path = "/api/books";

    let fetchURL = `${protocol}://${domain}${path}/${ id }`;

    return this._httpClient.get( fetchURL, { observe: 'response' })
      .pipe( map(( response: HttpResponse<any> ) => {
        if( response.status === 200 ){
          
          return Book.mapBook( response.body );   
        }
        return undefined;
      })
    )
  }
}