//librerias
const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const Joi = require('joi');

const app = express();
const txtName = './db/videojuegos.txt';
const { readFile, writeFile } = require('./src/file_system.js');
const joiValidacion = require('./Middleware/joiValidaciones.js');
const { registroSchema } = require('./schemas/Registro.js');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Listar videojuegos
app.get('/videojuegos', (req, res) => {
    const data = readFile(txtName);
    res.json(data);
});

// Crear videojuego
app.post('/videojuegos', joiValidacion(registroSchema), (req, res) => {
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

    res.json({ "ok": true, Videojuego: nuevoVideojuego });
});

// Obtener un videojuego por ID
app.get('/videojuegos/:id', (req, res) => {
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
    console.log("API está corriendo en http://localhost:4000");
});
