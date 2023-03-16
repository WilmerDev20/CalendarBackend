const {response} = require ('express');
const Usuario = require('../models/Usuario');
const bcrypt= require('bcryptjs');
const { generarJWT } = require('../helpers/JWT');





const crearUsuario=async(req,res=response)=>{

    const { email, password}= req.body;

   

   

    try {

        let usuario = await Usuario.findOne({email:email});

        if(usuario){

            return res.status(400).json({
                ok:false,
                msg:'El usuario ya existe con ese email'
            })

        }
        
        usuario= new Usuario(req.body);

        //encriptar password

        const salt = bcrypt.genSaltSync();
        usuario.password=bcrypt.hashSync(password,salt);



        await usuario.save();

        //Generar nuestro jwt


        const token= await generarJWT(usuario.id,usuario.name);


        res.status(201).json({
            ok:true,
            uid:usuario.id,
            name:usuario.name,
            token
        })

       


    } catch (error) {
        
        res.status(500).json({
            ok:false,
            msg:'Hablar con el admin'
        })
    }





    
}

const loginUsuario=async(req,res=response)=>{

    const {email, password}= req.body;

    try {
        
        const  usuario = await Usuario.findOne({email:email});

        if(!usuario){
            return res.status(400).json({
                ok:false,
                msg:'El usuario no existe con ese email o password'
            })
        }

        //Confirmar los password

        const validPassword = bcrypt.compareSync(password,usuario.password);

        if(!validPassword){
            return res.status(400).json({
                ok:false,
                msg:'El usuario no existe con esa password'
            })
        }

        //Generar nuestro jwt

        const token= await generarJWT(usuario.id,usuario.name);
         

        return res.status(200).json({
            ok:true,
            usuario,
            token
        })


    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Hablar con el admin'
        })
    }

    res.json({
        ok:true,
        msg:'Login',
        email,
        password
    });
}


const revalidarToken=async(req,res=response)=>{

    const uid=req.uid;
    const name=req.name;

    //Generar un nuevo token


    const token= await generarJWT(uid,name);



    res.json({
        ok:true,
        token
    });
}








module.exports={
    crearUsuario,
    loginUsuario,
    revalidarToken

}