import { Component, OnInit, Input } from '@angular/core';
import { Book } from '../../../models/book.model'

@Component({
  selector: 'app-bookcard',
  templateUrl: './bookcard.component.html',
  styleUrls: ['./bookcard.component.css']
})
export class BookcardComponent implements OnInit {  
  private _book: any = null;;
  
  constructor() {    
  }
  
  @Input() set book( book: Book ){
    this._book = book;
    //console.log( this.book );
  }

  get book():Book {
    return this._book
  }
  ngOnInit(): void {
  }

}
