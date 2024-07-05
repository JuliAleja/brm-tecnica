'use strict'

const Producto = use('App/Models/Producto');
const StockProductoException = use('App/Exceptions/StockProductoException')
const NotFoundException = use('App/Exceptions/NotFoundException')

class ProductoService {

    async create(request, fechaIngreso) {
        const { numeroLote, nombre, precio, cantidadDisponible } = request.all();
        const productoCreate = Producto.create({
            n_lote: numeroLote,
            nombre: nombre,
            precio: precio,
            cantidad_disponible: cantidadDisponible,
            estado: "ACTIVO",
            fecha_ingreso: fechaIngreso
        });
        return productoCreate;
    }
    async all() {
        const productos = await Producto.all();
        if (productos.length == 0) {
            throw new NotFoundException();
        }
        return productos;
    }

    async findById(idProducto) {
        const producto = await Producto.find(idProducto);
        if (!producto) {
            throw new NotFoundException();
        }
        return producto;
    }

    async update(request, id) {
        const { numeroLote, nombre, precio, cantidadDisponible, fechaIngreso } = request.all();
        const producto = await this.findById(id);
        if (!producto) {
            throw new NotFoundException();
        }
        producto.fill({
            id: producto.id,
            n_lote: numeroLote == undefined ? producto.n_lote : numeroLote,
            nombre: nombre == undefined ? producto.nombre : nombre,
            precio: precio == undefined ? producto.precio : precio,
            cantidad_disponible: cantidadDisponible == undefined ? producto.cantidad_disponible : cantidadDisponible,
            fecha_ingreso: fechaIngreso == undefined ? producto.fecha_ingreso : fechaIngreso
        });
        await producto.save();
        return producto;
    }
    async updateStock(cantidad, id) {
        const producto = await this.findById(id);
        if (!producto) {
            throw new NotFoundException();
        }
        producto.cantidad_disponible = producto.cantidad_disponible - cantidad;
        const productoUpdate = await producto.save();
        return productoUpdate;
    }

    async status(id) {
        const producto = await Producto.find(id);
        if (!producto) {
            throw new NotFoundException();
        }
        producto.fill({
            id: producto.id,
            estado: producto.estado == "ACTIVO" ? "INACTIVO" : "ACTIVO",
        });
        await producto.save();
        return producto;
    }
    async verificarStock(idProducto, cantidadSolicitada) {
        const producto = await this.findById(idProducto);
        if (!producto) {
            throw new NotFoundException();
        }
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
        if (productoArray.length == 0) {
            throw new NotFoundException();
        }
        return productoArray;
    }
    async destroy(id) {
        const producto = await Producto.find(id);
        if (!producto) {
            throw new NotFoundException();
        }
        await producto.delete();
        return producto;
    }
}

module.exports = new ProductoService();