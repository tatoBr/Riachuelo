import { Component, OnInit, Input } from '@angular/core';
import { Book } from '../../../models/book.model'

@Component({
  selector: 'app-bookcard',
  templateUrl: './bookcard.component.html',
  styleUrls: ['./bookcard.component.css']
})
export class BookcardComponent implements OnInit {  
  private _book: Book;  
  private _id: string;
  
  constructor() {}

  get book():Book {  return this._book };
  
  @Input()
  set book( book: Book ) {
    this._book = book
  };

  @Input()
  set id( id: string ){
    this._id = id;
  }
  get id(): string { return this._id }

  get bookAuthors(){
    let authorsStr: string = ''
    let lastIndex = this._book.authors.length - 1;
    for( let idx = 0; idx < this._book.authors.length; idx++ ){
      let author = this._book.authors[idx];
      authorsStr += idx !== lastIndex ? `${ author }, `:`${ author }.`
    }
    return authorsStr;
  }
  ngOnInit(): void {
  }
}
