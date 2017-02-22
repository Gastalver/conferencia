/**
 * Created by Miguel on 21/02/2017.
 */
var express = require('express');
// Creamos un enrutador, que usaremos para el path /api y sus subpaths
var router = express.Router();
var debug = require('debug')('conferencia:server');

// Importamos el modelo
var Speaker = require('../models/speakers');

// Middleware General de este enrutador
router.use(function (req, res, next) {
    debug("Ejecutado middleware del router speakers");
    next();
});
// Mensaje por defecto al acceder al directorio / de este enrutador
router.get('/', function (req, res) {
    res.json({message: 'Servidor de REST API funcionando!'});
});
/*
 Rutas propiamente dichas de este enrutador. Este método .route() permite 'adherir' todos los verbos a continuación.
 Así organizamos mejor los handlers. Por rutas.

 Empezamos por la ruta /speakers, sin parámetros.
 */

//noinspection ChainedFunctionCallJS,ChainedFunctionCallJS
router.route('/speakers')
// Crea un orador cuando el método sea POST
    .post(function (req, res) {
        // Creamos una nueva instancia del modelo Speaker
        // Adviértase el uso de minúscula para la instancia y mayúscula para el modelo
        // Como en el esquema objeto - ClaseObjeto
        var speaker = new Speaker;
        //Establecemos las propiedades de la instancia a partir de los parametros recibidos con el request
        speaker.name = req.body.name;
        speaker.company = req.body.company;
        speaker.title = req.body.title;
        speaker.description = req.body.description;
        speaker.picture = req.body.picture;
        speaker.schedule = req.body.schedule;
        //Guardamos en la BD con el método save() que tiene la instancia del modelo
        speaker.save(function (err) {
            // Si hay error, lo enviamos
            if (err) {
                res.send(err);
            }
            // Si no, Informamos del exito de la operación
            res.json({message: 'Speaker creado correctamente.'})
        });
    })
    // Devuelve todos los speakers cuando el método sea GET, sin parámetros.
    .get(function (req, res) {
        // Buscamos en la BD con el método find() -sin filtros, solo cb- que tiene el modelo (no hace falta instancia)
        Speaker.find(function (err, speakers) {
            // Si hay errores los enviamos
            if (err) {
                res.send(err);
            }
            // Si no, enviamos los resultados de búsqueda
            res.json(speakers);
        });
    });

// Devuelve el speaker indicado cuando el método sea GET, con parámetros.

// Ahora añadimos al router la ruta /speaker con el parámetro speaker_id, que formalmente es otra.

//noinspection ChainedFunctionCallJS,ChainedFunctionCallJS,ChainedFunctionCallJS
router.route('/speakers/:speaker_id')
// Devuelve el speaker con el ID indicado cuando el método sea GET.
    .get(function (req, res) {
        Speaker.findById(req.params.speaker_id, function (err, speaker) {
            if (err)
                res.send(err);
            res.json(speaker);
        });
    })
    // Actualiza el speaker con el ID indicado cuando el método sea PUT
    .put(function (req, res) {
        Speaker.findById(req.params.speaker_id, function (err, speaker) {
            if (err)
                res.send(err);

            // Tomamos los datos enviados por el request y los asignamos a la instancia.
            speaker.name = req.body.name;
            speaker.company = req.body.company;
            speaker.title = req.body.title;
            speaker.description = req.body.description;
            speaker.picture = req.body.picture;
            speaker.schedule = req.body.schedule;

            // Grabamos la instancia con los nuevos valores. No olvidar el callback de la grabación
            speaker.save(function (err) {
                if (err)
                    res.send(err);
                // Informamos
                res.json({message: 'Speaker correctamente actualizado'});

            });
        });
    })
    .delete(function (req, res) {
        Speaker.remove({_id: req.params.speaker_id}, function (err, speaker) {
            if (err)
                res.send(err);
            res.json({message: 'Speaker correctamente eliminado'});
        });
    });

module.exports = router;
