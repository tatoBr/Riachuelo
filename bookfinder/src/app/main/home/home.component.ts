import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private _query: string = ""

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }
  ngOnInit(): void {
  }
  set query( value: string ) {
    this._query = value;
  }

  get query(){
    return this._query;
  }

  onClickSearch() {  
    if( !this._query ) return;  
    this.router.navigate(['/books'], {
      relativeTo: this.route,
      queryParams:{
        q: this._query,
        page: 0
      }
    });
  }
}
