import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Book } from 'src/app/models/book.model';
import { BooksServices } from 'src/app/services/books.services';
import { UserServices } from 'src/app/services/user.services';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  favorites: Book[] = []
  username = this._userServices.username  
  loading = true;

  constructor(
    private _userServices: UserServices,
    private _booksServices: BooksServices

  ) {}

  removeFromList( bookId: string ){
    this.loading = true;
    let index = this.favorites.findIndex( book => book.id === bookId)
    this.favorites.splice( index, 1 );
    this._userServices.removeBookFromFavorite( bookId );    
  }

  readMore( bookId:string ){
    let index = this.favorites.findIndex( book => book.id === bookId)
    console.log( index )
  }

  ngOnInit(): void {    
    //this._booksServices.booksUpdated.subscribe( books => this.favorites = books );
    
    this._userServices.favoriteBooksSubject.subscribe( books => {
      this.favorites = books;
      this.loading = false;
    });

    this._userServices.favoriteUpdateEmitter.subscribe( next => {
      this.loading = false;
    })

    this._userServices.getFavoriteBooks();    
  }

}
