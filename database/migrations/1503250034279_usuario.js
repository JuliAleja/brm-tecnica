'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UsuarioSchema extends Schema {
  up() {
    this.create('usuarios', (table) => {
      table.increments()
      table.string('nombre', 80).notNullable()
      table.string('apellido', 80).notNullable()
      table.string('genero', 1)
      table.integer('rol', 1)
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      table.timestamps()
    })
  }

  down() {
    this.drop('usuarios')
  }
}

module.exports = UsuarioSchema

