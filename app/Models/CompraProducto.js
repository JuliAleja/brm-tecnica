'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class CompraProducto extends Model {

    static get table() {
        return 'compras_productos'
    }
    productos() {
        return this.belongsTo("App/Models/Producto", 'id_producto', 'id');
    }
    compras() {
        return this.belongsTo("App/Models/Compra", 'id_compra', 'id');
    }

}

module.exports = CompraProducto
