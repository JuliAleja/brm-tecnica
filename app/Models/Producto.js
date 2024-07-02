'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Producto extends Model {

    comprasproductos() {
        return this.hasMany("App/Models/CompraProducto", 'id', 'id_producto');
    }

}

module.exports = Producto
