'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ComprasSchema extends Schema {
  up() {
    this.create('compras', (table) => {
      table.increments()
      table.integer('id_usuario').unsigned().references('id').inTable('usuarios')
      table.date('fecha')
      table.string('medio_pago', 10).notNullable()
      table.string('estado').notNullable()
      table.timestamps()
    })
  }

  down() {
    this.drop('compras')
  }
}

module.exports = ComprasSchema
