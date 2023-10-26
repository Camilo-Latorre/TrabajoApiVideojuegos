//librerias
require('dotenv').config()
const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const Joi = require('joi');
const path = require('path');
const logRequest = require('./access.log');

const app = express();
const PORT = process.env.PORT || 4000;
const APP_NAME = process.env.APP_NAME || 'My App';
const txtName = './db/videojuegos.txt';
const { readFile, writeFile } = require('./src/file_system.js');
const joiValidacion = require('./Middleware/joiValidaciones.js');
const { registroSchema } = require('./schemas/Registro.js');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set('views', './src/views');
app.set('view engine', 'ejs') 
// aca le decimos que vamos a utilizar como motor de plantilla ejs

// Listar videojuegos
app.get('/videojuegos', (req, res) => {
    logRequest(req);
    const filtro = req.query.filtro;
    const videojuegos = readFile(txtName);

    if (filtro) {
        const videojuegosFiltrados = videojuegos.filter(videojuego => videojuego.Nombre.toLowerCase().includes(filtro.toLowerCase()));
        res.render('videojuegos/index', { videojuegos: videojuegosFiltrados });
    } else {
        res.render('videojuegos/index', { videojuegos: videojuegos });
    }
});
app.get('/videojuegos/create', (req,res) =>{
    logRequest(req);
    //Mostrar el formulario
    res.render('videojuegos/create');
})

// Crear videojuego
app.post('/videojuegos', (req, res) => {
    logRequest(req);
    try {
        // Validación con Joi
        const { error } = registroSchema.validate(req.body);
        if (error) {
            res.status(400).json({ "ok": false, "message": error.details[0].message });
            return;
        }

        // Crear un nuevo videojuego
        let { Nombre, Empresa, Tematica, Online, Jugadores, Fecha_Lanzamiento, Precio, Edad_Minima } = req.body;

        // Generar un nuevo ID para el videojuego
        const id = uuidv4();

        // Crear un objeto de videojuego con el ID generado
        let nuevoVideojuego = {
            id,
            Nombre,
            Empresa,
            Tematica,
            Online,
            Jugadores,
            Fecha_Lanzamiento,
            Precio,
            Edad_Minima,
        };

        // Obtener la lista actual de videojuegos y agregar el nuevo videojuego
        const videojuegos = readFile(txtName);
        videojuegos.push(nuevoVideojuego);

        // Escribir la lista actualizada de videojuegos en el archivo
        writeFile(txtName, videojuegos);

        // Redirigir al usuario a la lista de videojuegos
        res.redirect('/videojuegos');
    } catch (error) {
        console.error(error);
        res.json({ message: 'Error al almacenar el videojuego' });
    }
});

// Obtener un videojuego por ID
app.get('/videojuegos/:id', (req, res) => {
    logRequest(req);
    const id = req.params.id;
    const videojuegos = readFile(txtName);
    const videojuegoEncontrado = videojuegos.find(videojuego => videojuego.id === id);

    if (!videojuegoEncontrado) {
        res.status(404).json({ 'ok': false, message: "Videojuego no encontrado" });
        return;
    }

    res.json({ "ok": true, Videojuego: videojuegoEncontrado });
});

// Actualizar un videojuego por ID
app.put('/videojuegos/:id', joiValidacion(registroSchema), (req, res) => {
    logRequest(req);
    const id = req.params.id;
    const videojuegos = readFile(txtName);
    const videojuegoIndex = videojuegos.findIndex(videojuego => videojuego.id === id);

    if (videojuegoIndex < 0) {
        res.status(404).json({ "ok": false, message: "No se encontró el videojuego" });
        return;
    }

    const videojuegoToUpdate = videojuegos[videojuegoIndex];
    const updatedVideojuego = { ...videojuegoToUpdate, ...req.body };

    videojuegos[videojuegoIndex] = updatedVideojuego;
    writeFile(txtName, videojuegos);

    res.json({ "ok": true, Videojuego: updatedVideojuego });
});

// Borrar un videojuego por ID
app.delete('/videojuegos/:id', (req, res) => {
    logRequest(req);
    const id = req.params.id;
    const videojuegos = readFile(txtName);
    const videojuegoIndex = videojuegos.findIndex(videojuego => videojuego.id === id);

    if (videojuegoIndex < 0) {
        res.status(404).json({ "ok": false, message: "No se encontró el videojuego" });
        return;
    }

    videojuegos.splice(videojuegoIndex, 1);
    writeFile(txtName, videojuegos);

    res.json({ "ok": true, message: "Videojuego eliminado exitosamente" });
});



app.listen(4000, () => {
    console.log(`${APP_NAME} está corriendo en http://localhost:${PORT}`);
});

