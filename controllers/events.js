const {response}=require('express');

const Evento= require('../models/Evento');


const obtenerEvento=async(req,res=response)=>{


    const eventos= await Evento.find()
                                .populate('user','name')
                                
    return res.json({
        ok:true,
        eventos
    })



}



const crearEvento=async(req, res=response)=>{

    const evento= new Evento(req.body);
    

    try {
        
        evento.user= req.uid;

      const eventoGuardado= await evento.save();

        return res.status(201).json({
            ok:true,
            eventoGuardado
        })


    } catch (error) {
        console.log(error);

        return res.status(500).json({
            ok:false,
            msg:'Error en la creacion del evento'
        })

    }
    
   
}



const actulizarEvento=async(req, res=response)=>{

        const eventoID=req.params.id;
        const uid= req.uid

       try {

        const evento= await Evento.findById(eventoID);

        if(!evento){
            return res.status(404).json({
                ok:false,
                msg:"Evento no existe por ese id"
            })
        }

        if(evento.user.toString() !== uid){
            return res.status(401).json({
                ok:false,
                msg:"no tiene privilegios para editar este evento"
            })
        }

        const nuevoEvento={
            ...req.body,
            user:uid
        }

        const eventoActualizado= await Evento.findByIdAndUpdate(eventoID,nuevoEvento,{new:true});

        return res.json({
            ok:true,
            eventoActualizado
        })


       } catch (error) {
            console.log(error);

            return res.status(500).json({
                ok:false,
                msg:'Error contactar admin'
            })

       }

}

const borrarEvento=async(req, res=response)=>{
    const eventoID= req.params.id;
    const uid= req.uid;
    
    try {
        const evento= await Evento.findById(eventoID);

        if(!evento){
            return res.status(404).json({
                ok:false,
                msg:"Evento no existe por ese id"
            })
        }

        if(evento.user.toString() !== uid){
            return res.status(401).json({
                ok:false,
                msg:"no tiene privilegios para eliminar este evento"
            })
        }

        await Evento.findByIdAndDelete(eventoID,{new:true});

        return res.json({
            ok:true,
            msg:'Evento eliminado'
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg:'contactar con el admin'
        })
    }
    
   
}







module.exports={
    obtenerEvento,
    crearEvento,
    actulizarEvento,
    borrarEvento
}