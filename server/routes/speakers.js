/**
 * Created by Miguel on 21/02/2017.
 */
var express = require('express');
var router = express.Router();
var debug = require('debug')('conferencia:server');

// Importamos el modelo
var Speaker = require('../models/speakers');

// Enrutador para la rama /api

// Middleware de este enrutador
router.use(function(req,res,next){
    debug("Ejecutado middleware del router speaker");
    next();
});
// Mensaje por defecto al acceder al directorio /api del servidor
router.get('/', function(req,res){
    res.json({message: 'Servidor de REST API funcionando!'});
});
//Rutas propiamente dichas, de la rama /speaker de la /api sin parámetros.
router.route('/speakers')
    // Crea un orador cuando el método sea POST
    .post(function(req,res){
        // Creamos una nueva instancia del modelo Speaker
        // Adviértase el uso de minúscula para la instancia y mayúscula para el modelo
        // Como en el esquema objeto - ClaseObjeto
        var speaker = new Speaker;
        //Establecemos las propiedades de la instancia a partir de los parametros recibidos con el request
        speaker.name = req.body.name;
        speaker.company = req.body.company;
        speaker.title= req.body.name;
        speaker.description = req.body.name;
        speaker.picture = req.body.picture;
        speaker.schedule= req.body.schedule;
        //Guardamos en la BD con el método save() que tiene la instancia del modelo
        speaker.save(function(err){
            // Si hay error, lo enviamos
            if(err){
                res.send(err);
            }
            // Si no, Informamos del exito de la operación
            res.json({message: 'Speaker creado correctamente.'})
        });
    })
    // Devuelve todos los speakers cuando el método sea GET, sin parámetros.
    .get(function(req,res){
        // Buscamos en la BD con el método find() -sin filtros, solo cb- que tiene el modelo (no hace falta instancia)
        Speaker.find(function(err,speakers){
            // Si hay errores los enviamos
            if(err){
                res.send(err);
            }
            // Si no, enviamos los resultados de búsqueda
            res.json(speakers);
        });
    });

// Devuelve el speaker indicado cuando el método sea GET, con parámetros.



module.exports = router;
