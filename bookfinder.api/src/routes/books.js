"user strict";

const Router = require('express').Router
const { getAll, get, setAsFavorite, getFavorites } = require( '../controllers/books' );

const passport = require( 'passport' );
const { jwtStrategy } = require( '../middlewares/credentialValidator' );
passport.use( jwtStrategy );

const router = Router();
router.post('/favorites/:bookId', passport.authenticate('jwt', { session: false }), setAsFavorite );
router.get('/favorites', passport.authenticate('jwt', { session: false }), getFavorites );

router.get('/:id', get );
router.get('/', getAll );
module.exports = router;