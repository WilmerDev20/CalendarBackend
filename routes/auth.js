const express=require ('express');
const {check}=require('express-validator');
const { crearUsuario,loginUsuario,revalidarToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const router= express.Router();


// localhost:4000/api/auth




router.post(
    '/new',
    [//middlewares
        check('name','El nombre es obligatorio').not().isEmpty(),
        check('name','El nombre debe ser mayor a 2 letras').isLength({min:2}),
        check('email','El email es obligatorio').isEmail(),
        check('password','El password debe de ser de 6 caracteres').isLength({min:6}),
        validarCampos
    ],
    crearUsuario);

router.post(
    '/',
    [
        check('email','El email es obligatorio').isEmail(),
        check('password','El password debe de ser de 6 caracteres').isLength({min:6}),
        validarCampos
    ],
    loginUsuario);


router.get('/renew',validarJWT,revalidarToken);







module.exports= router;


