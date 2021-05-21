import { Component } from '@angular/core';
import { UserServices } from './services/user.services';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  title = 'bookfinder'; 
  constructor(){}  
}
