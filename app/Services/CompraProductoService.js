'use strict'

const CompraProducto = use("App/Models/CompraProducto");


class UsuarioService {


    async createMany(compraProductos) {
        const compraProductoCreateMany = await CompraProducto.createMany(compraProductos);
        return compraProductoCreateMany;
    }

}

module.exports = new UsuarioService();