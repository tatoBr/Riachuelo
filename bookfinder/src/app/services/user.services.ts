import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, throwError } from "rxjs";
import { User } from "../models/user.model";

@Injectable({ providedIn: 'root' })
export class UserServices {
    private API_URL: string = 'http://localhost:3000';
    user = new Subject<User>();
    userdata: User;
    
    constructor(
        private _httpClient: HttpClient
    ){}
    loginUser = async( user: { email: string, password: string })=>{  
        let fetchURL = `${ this.API_URL }/api/users/login`;
        let headers = { 'Content-Type': 'application/json' };  
        let options = {
            method: 'POST',
            headers,
            body: JSON.stringify( user )
        }
        try {
            let response = await fetch( fetchURL, options );
            let data = await response.json();
            
            if( data.message === "User authenticated" ){
                let { _id, username, email, favoriteBooks } = data.content;
                let token = response.headers.get('Authorization');
                let user = new User(_id, username, email, favoriteBooks, token || '' );
                localStorage.setItem('token', user.token );
                this.userdata = user;
                this.user.next( user );  
                return;        
            }
            throw new Error( data.message );     
        } catch (error) {            
            throw error;
        }
    }
    postUser = async (user: { username: string, email: string, password: string }) => {
        let fetchURL = `${this.API_URL}/api/users`;
        try {
            user.username.toUpperCase()
            let body = JSON.stringify(user);
            let options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body
            }

            let response = await fetch(fetchURL, options);
            let token = response.headers.get('Authorization');
            console.log( response.headers );
            let data = await response.json()
            console.log( data.message );
            if( data.message === "User created successfully." ){
                let { _id, username, email, favoriteBooks } = data.content;
                let user = new User(_id, username, email, favoriteBooks, token || '' );                
                localStorage.setItem('token', user.token );
                this.user.next( user ); 
                return;              
            }
            throw new Error( data.message );
        } catch (error) {
            throw error;
        }
    }
}