import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from "@angular/common/http";
import { Injectable, Output, EventEmitter } from "@angular/core";

import { Subject } from "rxjs";

import { environment } from '../../environments/environment'
import { User } from "../models/user.model";
import { Book } from "../models/book.model";

import { JwtHelperService } from '@auth0/angular-jwt';

interface ApiResponseBody {
    message: string
    content: any
}

interface userReceived {
    _id: string,
    username: string,
    email: string,
    favoriteBooks: string[],
    token?: string
}

interface userToInsert {
    username: string,
    email: string,
    password: string
}

@Injectable({ providedIn: 'root' })
export class UserServices {
    private _API_DOMAIN = environment.API_DOMAIN;
    private _user: User | undefined;

    @Output()
    userIsLoggedEmitter = new EventEmitter<boolean>();
    
    @Output()
    favoriteUpdateEmitter = new EventEmitter<boolean>()

    userSubject = new Subject<User>()
    errorSubject = new Subject<string>();
    favoriteBooksSubject = new Subject<Book[]>();

    constructor(
        private _httpClient: HttpClient,
        private jwtHelper: JwtHelperService = new JwtHelperService()
    ) { }
    get username() {
        return this._user?.username;
    }
    private _tokenIsValid(): boolean {
        const token = localStorage.getItem('token');

        if (!token) {
            localStorage.removeItem('token');
            return false;
        }

        if (this.jwtHelper.isTokenExpired(token)) {
            localStorage.removeItem('token');
            return false;
        }

        return true;
    }

    isLoggedIn(): boolean {
        if (!this._tokenIsValid()) {
            return false;
        }

        if (!this._user) {
            this._user = undefined;
            return false;
        }

        return true;
    }

    private _getUserById(id: string, token: string) {
        const domain = this._API_DOMAIN
        const protocol: string = 'http';
        const path = "/api/users";
        let fetchURL = `${protocol}://${domain}${path}/${id}`;

        let header = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        let params = new HttpParams().set('id', id);

        this._httpClient.get<ApiResponseBody>(fetchURL, {
            observe: 'response',
            headers: header,
            params: params,
        }).subscribe(response => {
            let status = response.status;
            let body = response.body;

            if (!body) {
                this.errorSubject.next('Ops, something went wrong');
                return;
            }

            let { message, content } = body;
            if (status === 200) {
                let user = User.mapUser(content);

                this._user = user;
                this._user.token = token;
                localStorage.setItem('token', this._user.token);

                this.userSubject.next(this._user);
                this.userIsLoggedEmitter.emit(this.isLoggedIn());
            }

            this.errorSubject.next(message);
        }, (errorResponse: HttpErrorResponse) => {

            this.errorSubject.next(errorResponse.error.message);
        });
    }

    postUser(user: userToInsert) {
        const domain = this._API_DOMAIN
        const protocol: string = 'http';
        const path = "/api/users";

        let fetchURL = `${protocol}://${domain}${path}`;
        this._httpClient.post<ApiResponseBody>(fetchURL, user, { observe: 'response' })
            .subscribe((response: HttpResponse<ApiResponseBody>) => {
                let status = response.status;
                let body = response.body;

                if (!body) {
                    this.errorSubject.next('Ops, something went wrong');
                    return;
                }

                let { message, content } = body;
                if (status === 201) {
                    let user = User.mapUser(content);
                    console.log('user created -> ', user)
                    this._user = user;

                    localStorage.setItem('token', this._user.token);

                    this.userSubject.next(this._user);
                    this.userIsLoggedEmitter.emit(this.isLoggedIn());
                }

                this.userIsLoggedEmitter.emit(this.isLoggedIn());
                this.errorSubject.next(message);
            }, (errorResponse: HttpErrorResponse) => {
                this.userIsLoggedEmitter.emit(this.isLoggedIn());
                this.errorSubject.next(errorResponse.error.message);
            }
            )
    }

    logUserIn(email: string, password: string) {
        const domain = this._API_DOMAIN
        const protocol: string = 'http';
        const path = "/api/users/login";
        let fetchURL = `${protocol}://${domain}${path}`;

        this._httpClient.post(fetchURL, { email, password }, { observe: 'response' })
            .subscribe((response: any) => {
                let status = response.status;
                let body = response.body;

                if (!body) {
                    this.errorSubject.next('Ops, something went wrong');
                    return;
                }

                let { message, content } = body;
                if (status === 200) {
                    let user = User.mapUser(content);
                    this._user = user;

                    localStorage.setItem('token', this._user.token);

                    this.userSubject.next(this._user);
                    this.userIsLoggedEmitter.emit(this.isLoggedIn());
                }
                this.errorSubject.next(message);
            }, (errorResponse: HttpErrorResponse) => this.errorSubject.next(errorResponse.error.message));
    }

    logUserWithToken() {
        if (!this._tokenIsValid()) {
            this._user = undefined;
            this.userIsLoggedEmitter.emit(this.isLoggedIn());
            return;
        }

        let token = localStorage.getItem('token') || '';
        let decoded = this.jwtHelper.decodeToken(token);

        let { _id } = decoded;
        this._getUserById(_id, token);
    }

    logUserOut() {
        localStorage.removeItem('token')
        this._user = undefined;
        this.userIsLoggedEmitter.emit(this.isLoggedIn());
    }

    get favoriteBooks() {
        if (!this._user)
            return []

        return [...this._user.favoriteBooks]
    }

    addBookToFavorite(bookId: string) {
        if (!this.isLoggedIn())
            return;

        const domain = this._API_DOMAIN
        const protocol: string = 'http';
        const path = `/api/books/favorites`;

        let fetchURL = `${protocol}://${domain}${path}/${bookId}`;

        let header = new HttpHeaders({
            'Authorization': `Bearer ${this._user?.token}`
        });

        this._httpClient.patch<ApiResponseBody>(fetchURL, {}, {
            headers: header,
            observe: 'response'
        })
            .subscribe((response: any) => {
                let { status, body } = response;
                if (status === 202) {
                    this._user?.favoriteBooks.push(bookId);
                    this.favoriteUpdateEmitter.emit( true );
                    return;
                }
                this.errorSubject.next(body.message);
                this.favoriteUpdateEmitter.emit( false );
                return;
            }, (response: HttpErrorResponse) => {
                this.errorSubject.next(response.error.message);
                this.favoriteUpdateEmitter.emit( false );
            })
    }

    removeBookFromFavorite( bookId: string ){
        if (!this.isLoggedIn())
            return;

        const domain = this._API_DOMAIN
        const protocol: string = 'http';
        const path = `/api/books/favorites`;

        let fetchURL = `${protocol}://${domain}${path}/${bookId}`;

        let header = new HttpHeaders({
            'Authorization': `Bearer ${this._user?.token}`
        });

        this._httpClient.delete<ApiResponseBody>(fetchURL, {
            headers: header,
            observe: 'response'
        })
            .subscribe((response: any) => {
                let { status, body } = response;
                if (status === 202) {
                    let index = this._user?.favoriteBooks.indexOf( bookId )
                    if( index ) this._user?.favoriteBooks.splice( index, 1 );
                    this.favoriteUpdateEmitter.emit( true );                     
                    return
                }
                this.favoriteUpdateEmitter.emit( false );                     
                this.errorSubject.next(body.message);
                return;
                
            }, (response: HttpErrorResponse) => {
                this.favoriteUpdateEmitter.emit( false );                     
                this.errorSubject.next(response.error.message);
            })
    }

    
    getFavoriteBooks() {
        if (!this.isLoggedIn())
            return;

        const domain = this._API_DOMAIN
        const protocol: string = 'http';
        const path = `/api/books/favorites`;

        let fetchURL = `${protocol}://${domain}${path}`;

        let header = new HttpHeaders({
            'Authorization': `Bearer ${this._user?.token}`
        });

        this._httpClient.get<ApiResponseBody>(fetchURL, {
            headers: header,
            observe: 'response'
        })
            .subscribe(
                ( response: any )=> {
                    let status = response.status;
                    let { message, body } = response
                    let booksArray: Book[] = [];

                    if (status === 200) {
                        for (let key in body) {
                            booksArray.push( Book.mapBook(body[key]));
                        }
                        return this.favoriteBooksSubject.next( booksArray );
                    }
                    return this.errorSubject.next( message );                   
                },
                (response: HttpErrorResponse) => {
                    this.errorSubject.next(response.error.message);
                }
            )
    }
}