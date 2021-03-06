"user strict";

const Router = require('express').Router
const Controller = require( '../controllers/user' );


const inputValidator = require( '../middlewares/inputValidator' );
const { createUserSchema, updateUserSchema } = inputValidator;
const { validateBody } = inputValidator;

const router = Router();
const controller = new Controller();

const passport = require( 'passport' );
const { jwtStrategy } = require( '../middlewares/credentialValidator' );
passport.use( jwtStrategy );

router.post(
    '/login',
    controller.signIn
);

router.post(
    '/',
    validateBody( createUserSchema ),
    controller.post
);

router.get(
    '/:id',
    passport.authenticate( 'jwt', { session: false }),
    controller.getById
);  

router.get(
    '/',
    controller.get
);


router.patch(
    '/:id',
    passport.authenticate( 'jwt', { session: false }),    
    controller.patch
);

router.delete(
    '/:id',
    passport.authenticate( 'jwt', { session: false }),
    controller.delete
);


module.exports = router;