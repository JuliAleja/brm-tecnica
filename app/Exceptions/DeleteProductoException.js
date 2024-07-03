'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class DeleteProductoException extends LogicalException {

  handle(error, { response }) {
    return response.status(422).json({
      error: 'No se puede eliminar este producto, ya que se han hecho compras.Puedes inactivar el producto'
    })
  }
}

module.exports = DeleteProductoException
