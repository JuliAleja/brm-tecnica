'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Compra extends Model {

    usuarios() {
        return this.belongsTo("App/Models/Usuario", 'id_usuario', 'id');
    }

    comprasproductos() {
        return this.hasMany("App/Models/CompraProducto", 'id', 'id_compra');
    }

}

module.exports = Compra
