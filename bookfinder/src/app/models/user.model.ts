export class User{ 
    public id: string;
    public username: string;
    public email: string;     
    private _favoriteBooks: string[];
    private _token: string;
    
    static mapUser( data: any ){   
        let id:string = data['_id'];
        let username:string = data['username'];
        let email:string = data['email'];
        let favoriteBooks:string[] = data['favoriteBooks'];
        let token: string = data['token'];  
        
        return new User( id, username, email, favoriteBooks, token );
      }
        
    constructor( id: string, username: string, email: string, favoriteBooks: string[] = [], token?: string ){
        this.id = id;
        this.username = username;
        this.email = email;
        this._favoriteBooks = favoriteBooks;
        this._token = token || ''
    }
    set token( str: string ){ this._token = str };
    get token(){ return this._token; }
    get favoriteBooks(){
        return this._favoriteBooks;
    }
}