'use strict'

const CompraProducto = use("App/Models/CompraProducto");
const DeleteProductoException = use('App/Exceptions/DeleteProductoException')


class CompraProductoService {


    async createMany(compraProductos) {
        const compraProductoCreateMany = await CompraProducto.createMany(compraProductos);
        return compraProductoCreateMany;
    }
    async verifyproducto(idProducto) {
        const compraProducto = await CompraProducto.query()
            .where('id_producto', idProducto)
            .fetch();
        const compraProductoArray = compraProducto.toJSON();
        if (compraProductoArray.length > 0) {
            throw new DeleteProductoException();
        }
        return true;
    }

}

module.exports = new CompraProductoService();