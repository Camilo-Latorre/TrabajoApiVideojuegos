const Joi = require('joi');

module.exports = { registroSchema: Joi.object({
    Nombre: Joi.string()
      .min(3)
      .max(30)
      .required(),

    Empresa: Joi.string()
      .min(2)
      .max(50)
      .required(),

    Fecha_Lanzamiento: Joi.date()
      .required(),

    Tematica: Joi.string()
    .regex(/^[A-Za-z\s]+$/)
    .required()
      .messages({
        'string.pattern.base': 'La temática solo debe contener letras.',
        'any.required': 'La temática es un campo requerido.',
      }),

    Online: Joi.boolean().valid(true, false).required(),


    Jugadores: Joi.number()
      .integer()
      .max(4)
      .required()
      .messages({
        'any.required': 'La cantidad de jugadores es requerida',
      }),

    Precio: Joi.number()
      .required()
      .messages({
        'any.required': 'El precio del juego debe ser puesto',
      }),

    Edad_Minima: Joi.number()
      .integer()
      .required()
      .messages({
        'any.required': 'Debe poner la edad recomendada para jugar',
      }),
  }),
};
