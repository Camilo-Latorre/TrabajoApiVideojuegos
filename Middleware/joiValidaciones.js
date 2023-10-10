const joi = require('joi');

let joiValidacion = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      const { details } = error;
      const errorMessages = details.map((detail) => detail.message);
      return res.status(422).json({ error: errorMessages });
    }

    next();
  };
};

module.exports = joiValidacion;

