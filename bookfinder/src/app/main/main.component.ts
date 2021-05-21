import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { Book } from '../models/book.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  private _books: Book[] = [];
  private _page: string = 'booklist';  
  @Output() requestBooklistUpdate = new EventEmitter<{ keyword?: string, startIndex: number, maxResults:number  }>();
  @Input() set page( page: string ){
    this._page = page;
  }
  get page(){
    return this._page;
  }

  @Input('booksAtMain') set books( books: Book[] ){    
    this._books = books    
  }
  get books(){
    return this._books;
  }
  
  constructor() { }
  
  onPageChanged( pagedata: { name: string }){
    this.page = pagedata.name;
  }
  onBooklistUpdate( event:{ keyword?: string, startIndex: number, maxResults:number  }){
    this.requestBooklistUpdate.emit( event );
  }

  ngOnInit(){
    
  }
}
