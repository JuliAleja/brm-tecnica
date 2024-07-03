'use strict'

const Producto = use('App/Models/Producto');
const StockProductoException = use('App/Exceptions/StockProductoException')

class ProductoService {

    async create(request) {
        const { nLote, nombre, precio, cantidadDisponible, fechaIngreso } = request.all();
        const productoCreate = Producto.create({
            n_lote: nLote,
            nombre: nombre,
            precio: precio,
            cantidad_disponible: cantidadDisponible,
            fecha_ingreso: fechaIngreso
        });
        return productoCreate;
    }
    async all() {
        const productos = await Producto.all();
        return productos;
    }

    async findById(idProducto) {
        const producto = await Producto.find(idProducto);
        return producto;
    }

    async update(request, id) {
        const { nLote, nombre, precio, cantidadDisponible, fechaIngreso } = request.all();
        const producto = await this.findById(id);
        producto.fill({
            n_lote: nLote,
            nombre: nombre,
            precio: precio,
            cantidad_disponible: cantidadDisponible,
            fecha_ingreso: fechaIngreso
        });
        const productoUpdate = await producto.save();
        return productoUpdate;
    }
    async updateStock(cantidad, id) {
        const producto = await this.findById(id);
        producto.cantidad_disponible = producto.cantidad_disponible - cantidad;
        const productoUpdate = await producto.save();
        return productoUpdate;
    }

    async destroy(id) {
        const producto = await Producto.find(id);
        const aux = await producto.delete();
        return aux;
    }
    async verificarStock(idProducto, cantidadSolicitada) {
        const producto = await this.findById(idProducto);
        if (producto.cantidad_disponible < cantidadSolicitada) {
            const error = new StockProductoException();
            error.producto = producto;
            error.cantidadSolicitada = cantidadSolicitada;
            throw error;
        }
    }
    async findByIdUsuario(idUsuario) {
        const producto = await Producto.query()
            .with('comprasproductos', (comprasProductosQuery) => {
                comprasProductosQuery.with('compras', (comprasQuery) => {
                    comprasQuery.where('id_usuario', idUsuario)
                })
            })
            .fetch();
        const productoArray = producto.toJSON();
        return productoArray;
    }
}

module.exports = new ProductoService();