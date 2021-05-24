const { findById } = require('../models/user');
const Services = require('../services/books');
const UserServices = require( '../services/user')

const services = new Services();
const userServices = new UserServices();

exports.getAll = async( req, res, next ) => {
    try {               
        const q = req.query.q;
        const page = req.query.page || 0;
        const maxResults = 40;
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
        if( !book )
            return res.status( 404 ).json({})
        res.json( book );
    } catch (error) {
        next( error );
    }
}

exports.setAsFavorite = async( req, res, next ) => {
    try {
        let { bookId } = req.params;
        let user = await userServices.Model.findByIdAndUpdate( req.user.id,{ $addToSet: { favoriteBooks: bookId }});
        res.status( 202 ).json({ message: 'added to favorite', content: user.favoriteBooks })            
    } catch ( error ) {
        next( error );
    }
}

exports.removeFromFavorite = async( req, res, next )=>{
    try {
        let { bookId } = req.params;
        await userServices.Model.findByIdAndUpdate( req.user.id, { $pull: { favoriteBooks: bookId }});
        let user = await userServices.findById( req.user.id)
        return res.status( 202 ).json({ message: 'removed to favorite', content: user.favoriteBooks })            
    } catch ( error ) {
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