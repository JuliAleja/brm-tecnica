'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ComprasProductosSchema extends Schema {
  up() {
    this.create('compras_productos', (table) => {
      table.increments()
      table.integer('id_compra').unsigned().references('id').inTable('compras')
      table.integer('id_producto').unsigned().references('id').inTable('productos')
      table.integer('cantidad')
      table.integer('total')
      table.timestamps()
    })
  }

  down() {
    this.drop('compras_productos')
  }
}

module.exports = ComprasProductosSchema
