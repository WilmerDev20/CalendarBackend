const express= require('express');
const { check } = require('express-validator');
const { obtenerEvento, crearEvento, actulizarEvento, borrarEvento } = require('../controllers/events');
const isDate = require('../helpers/isDate');
const { validarCampos } = require('../middlewares/validar-campos');
const {validarJWT}= require('../middlewares/validar-jwt');

const router= express.Router();

// /api/events



//Todas tienen que pasar por la validacion del JWT

router.use(validarJWT);// usando el middleware



//Obtener eventos
router.get('/',obtenerEvento);


//Crear un nuevo evento
router.post('/create',
[
    check('title','El titulo es obligatorio').not().isEmpty(),
    check('start','Fecha de inicio es obligatoria').custom(isDate),
    check('end','Fecha de finalizacion es obligatoria').custom(isDate),
 
    validarCampos
],
crearEvento);


//Actulizar evento

router.put('/:id',[
    check('title','El titulo es obligatorio').not().isEmpty(),
    check('start','Fecha de inicio es obligatoria').custom(isDate),
    check('end','Fecha de finalizacion es obligatoria').custom(isDate),
    validarCampos
],actulizarEvento);

//Borrar evento

router.delete('/:id',borrarEvento);

module.exports=router
