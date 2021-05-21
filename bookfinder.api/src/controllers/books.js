const Services = require('../services/books');
const UserServices = require( '../services/user')

const services = new Services();
const userServices = new UserServices();

exports.getAll = async( req, res, next ) => {
    try {               
        const q = req.query.q || '.';
        const page = req.query.page || 0;
        const maxResults = 10;
        const startIndex = page * maxResults;

        let queryParams = `?q=${ q }&maxResults=${ maxResults }&startIndex=${ startIndex }`;        
        let books = await services.getAllBooks( queryParams );
        res.json( books )
    } catch (error) {
        next( error )
    }
}

exports.get = async( req, res, next ) => {
    let { id } = req.params;
    try {
        let book = await services.getBookById( id )
        res.json( book );
    } catch (error) {
        next( error );
    }
}

exports.setAsFavorite = async( req, res, next ) => {
    try {
        let { bookId } = req.params;
        let user = await userServices.Model.findById( req.user.id );
        if( !user.favoriteBooks.includes( bookId )){
            user.favoriteBooks.push( bookId );        
            await user.save();
        }
        res.json( user );                
    } catch (error) {
        next( error );
    }
}

exports.getFavorites = async( req, res, next ) => {
    console.log( 'id log', req.user.id );
    try {
        let user = await userServices.Model.findById( req.user.id );
        let { favoriteBooks } = user;
        let booksPromises = [];
        
        for( let bookId of favoriteBooks ){
            let p = await services.getBookById( bookId );
            booksPromises.push( p );
        }
        let books = await Promise.all( booksPromises );
        res.json( books );
        
    } catch (error) {
        next( error )
    }
    
}