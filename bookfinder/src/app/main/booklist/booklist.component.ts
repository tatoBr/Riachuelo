import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Book } from '../../models/book.model';
import { BookService } from '../../services/book.services'

@Component({
  selector: 'app-booklist',
  templateUrl: './booklist.component.html',
  styleUrls: ['./booklist.component.css']
})
export class BooklistComponent implements OnInit {
  private _books: Book[] = [];
  private _keyword: string;
  private _page: number;
  private _services = new BookService();

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    this._page = 1;
    this._keyword = "";
  }

  get books() { return this._books };

  set keyword(value: string) {
    if (this._keyword === value) return;
    this._keyword = value;
    this._updateBookList();
  }
  get keyword() { return this._keyword };

  set page(value: number) {
    if (this._page === value || value < 0 ) return;    
    this._page = value;
    this.router.navigate(['/books'], {
      queryParams: {
        q: this._keyword,
        page: this._page
      }
    });
  }
  get page() { return this._page };

  private _updateBookList() {
    this._services.fetchBooks(this._keyword, this._page)
      .then(data => { this._books = data; })
      .catch(error => console.error(error));
  }

  ngOnInit() {
    let { queryParams } = this.route.snapshot;
    let { page, q } = queryParams;
    page = parseInt(page);
    if (this._page !== page)
      this._page = page || 0;

    if (this._keyword !== q)
      this.keyword = q || '.';
    
    this.route.queryParams.subscribe((params: Params) => {      
      if (this._page !== params.page)
        this._page = parseInt(params.page) || 0;

      if (this._keyword !== params.q)
        this.keyword = params.q;
      
      this._updateBookList();
    });
  }
}
