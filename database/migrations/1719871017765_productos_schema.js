'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductosSchema extends Schema {
  up() {
    this.create('productos', (table) => {
      table.increments()
      table.integer('n_lote')
      table.string('nombre', 25)
      table.integer('precio')
      table.integer('cantidad_disponible')
      table.string('estado')
      table.date('fecha_ingreso')
      table.timestamps()
    })
  }

  down() {
    this.drop('productos')
  }
}

module.exports = ProductosSchema
