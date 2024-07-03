'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class PermisoAdminException extends LogicalException {
  handle(error, { response }) {
    return response.status(404).json({
      error: 'Acceso denegado. Este usuario no tiene los permisos necesarios para realizar esta acción. Por favor, contacte al administrador del sistema.'
    })
  }
}

module.exports = PermisoAdminException
