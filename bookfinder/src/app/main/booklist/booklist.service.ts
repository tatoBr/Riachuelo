import { HttpClient, HttpHeaders } from '@angular/common/http';


export class HeroService {

    constructor(
        private http: HttpClient,
        private messageService: MessageService) { }
    
    private log( message: string ) {
        this.messageService.add(`HeroService: ${message}`);
    }
}