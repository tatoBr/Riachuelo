import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Book } from 'src/app/models/book.model';

@Component({
  selector: 'app-favorite-card',
  templateUrl: './favorite-card.component.html',
  styleUrls: ['./favorite-card.component.css']
})

export class FavoriteCardComponent implements OnInit {
  
  @Output()
  onUnfavorite = new EventEmitter<string>();

  private _book:Book;

  constructor() { }
  
  @Input()
  set book( book: Book ){ this._book = book}
  get book():Book { return this._book }

  get id():string{
    return this._book.id
  }

  removeFavorite(){
    this.onUnfavorite.emit( this._book.id );
  }

  ngOnInit(): void {
  }

}
