const fetch = require('node-fetch');

class BooKServices{
    ROOT_URL = "https://www.googleapis.com/books/v1/volumes";
    headers= {
        "Content-Type": "application/json"
    }
    constructor(){};
    getAllBooks = async ( query )=> {
        if( !query ) return [];
        let fetchURL = `${ this.ROOT_URL }${ query }`;       
        
        try {
            let response = await fetch( fetchURL,{
                method: 'GET',
                header: this.headers
            });
            let data = await response.json();
                
            if( !data.items || !Array.isArray( data.items ))
                return[]

            return data.items.map( mapper );    
            
        } catch (error) {
            throw error;
        }
    }
    getBookById = async( id ) => {
        if( !id ) return;

        let fetchURL = `${ this.ROOT_URL }/${ id }`
        try {
            let response = await fetch( fetchURL );            
            let data = await response.json();
            return mapper( data );

        } catch (error) {
            throw error;
        }
    }
}

let mapper = rawBook => {
    let mappedBook = {
        id: rawBook.id,
        title: rawBook.volumeInfo.title,
        authors: rawBook.volumeInfo.authors,
        publisher: rawBook.volumeInfo.publisher,
        publishedDate: rawBook.volumeInfo.publishedDate || "",
        description: rawBook.volumeInfo.description || "",
        pageCount: rawBook.volumeInfo.pageCount,
        imageURL: `https://books.google.com/books/content?id=${ rawBook.id }&printsec=frontcover&img=1`,
        language: rawBook.volumeInfo.language
    }

    return mappedBook;
}

module.exports = BooKServices;