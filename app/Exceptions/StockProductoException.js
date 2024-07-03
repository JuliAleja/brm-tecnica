'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class StockProductoException extends LogicalException {

  handle(error, { response }) {
    const { producto, cantidadSolicitada } = error;
    return response.status(404).json({
      error: `No hay suficiente cantidad disponible para el producto ${producto.nombre}. Stock disponible: ${producto.cantidad_disponible}, cantidad solicitada: ${cantidadSolicitada}`
    })
  }

}

module.exports = StockProductoException
