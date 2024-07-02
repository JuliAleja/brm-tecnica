'use strict'

const Producto = use("App/Models/Producto");

class ProductoController {

    async create({ auth, request }) {
        await auth.getUser();
        const { nLote, nombre, precio, cantidadDisponible, fechaIngreso } = request.all();
        const producto = new Producto();
        producto.fill({
            n_lote: nLote,
            nombre: nombre,
            precio: precio,
            cantidad_disponible: cantidadDisponible,
            fecha_ingreso: fechaIngreso
        });
        await producto.save(producto);
        return producto;
    }

    async all({ auth }) {
        await auth.getUser();
        const productos = await Producto.all();
        return productos;
    }

    async findById({ params, auth }) {
        await auth.getUser();
        const { id } = params;
        const producto = await Producto.find(id);
        return producto;
    }
    async update({ params, request, auth }) {
        await auth.getUser();
        const { id } = params;
        const { nLote, nombre, precio, cantidadDisponible, fechaIngreso } = request.all();
        const producto = await Producto.find(id);

        producto.fill({
            n_lote: nLote,
            nombre: nombre,
            precio: precio,
            cantidad_disponible: cantidadDisponible,
            fecha_ingreso: fechaIngreso
        });
        await producto.save(producto);
        return producto;
    }

    async destroy({ params, auth }) {
        await auth.getUser();
        const { id } = params;
        const producto = await Producto.find(id);
        const aux = await producto.delete();
        return aux;
    }



}

module.exports = ProductoController
