'use strict'

const ProductoService = use("App/Services/ProductoService");
const CompraService = use("App/Services/CompraService");
const CompraProductoService = use("App/Services/CompraProductoService");
const FormatoService = use("App/Services/CompraProductoService");


class CompraController {

    async findByIdCliente({ params, auth, response }) {
        await auth.getUser();
        const { idCliente } = params;
        const comprasArray = await CompraService.findByIdCliente(idCliente);
        const responseCompras = comprasArray.map(usuario => {
            return {
                idCliente: usuario.id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                genero: usuario.genero === 'f' ? 'Femenino' : 'Masculino',
                rol: usuario.rol,
                email: usuario.email.toLowerCase(),
                compras: usuario.compras.map(compra => {
                    let totalCompra = 0;
                    const productos = compra.comprasproductos.map(cp => {
                        totalCompra += cp.total;
                        return {
                            idProducto: cp.productos.id,
                            nombreProducto: cp.productos.nombre,
                            precioProducto: cp.productos.precio,
                            cantidad: cp.cantidad,
                            total: cp.total
                        };
                    });

                    return {
                        idCompra: compra.id,
                        fecha: compra.fecha,
                        medioPago: compra.medio_pago,
                        estado: compra.estado,
                        productos: productos,
                        totalCompra: totalCompra
                    };
                })
            };
        });
        return responseCompras;
    }

    async sale({ request, auth }) {
        const usuario = await auth.getUser();
        const compras = request.all();
        let requestComprasProductos = [];
        const comprasArray = Object.values(compras);
        let responseCompras = [];
        for (const element of comprasArray) {
            const compraCreate = await CompraService.create(usuario.id, FormatoService.fechaNowFormat(), element.metodoPago);
            await ProductoService.verificarStock(element.idProducto, element.cantidad);
            const producto = await ProductoService.findById(element.idProducto);
            const compraProducto = {
                id_compra: compraCreate.id,
                id_producto: element.idProducto,
                cantidad: element.cantidad,
                total: producto.precio * element.cantidad
            };
            await ProductoService.updateStock(element.cantidad, element.idProducto)
            requestComprasProductos.push(compraProducto);
            const compraResponse = {
                idCompra: compraCreate.id,
                idUsuario: element.idUsuario,
                fecha: compraCreate.fecha,
                medioPago: compraCreate.medio_pago,
                estado: compraCreate.estado,
                productos: {
                    idProducto: producto.id,
                    nombreProducto: producto.nombre,
                    precioProducto: producto.precio,
                    cantidad: element.cantidad,
                    total: producto.precio * element.cantidad
                }
            };
            responseCompras.push(compraResponse);
        }
        await CompraProductoService.createMany(requestComprasProductos);
        return responseCompras;
    }
    async invoice({ params, auth }) {
        const usuario = await auth.getUser();
        const { id } = params;
        const comprasArray = await CompraService.findByIdClienteIdCompra(usuario.id, id);
        const responseInvoice = comprasArray.map(compras => {
            let totalCompra = 0;
            const detalleCompra = compras.comprasproductos.map(cp => {
                totalCompra += cp.total;
                return {
                    idProducto: cp.productos.id,
                    nombreProducto: cp.productos.nombre,
                    precioProducto: cp.productos.precio,
                    cantidad: cp.cantidad,
                    total: cp.total
                };
            });
            const usuario = {
                idUsusario: compras.usuarios.id,
                nombre: compras.usuarios.nombre,
                apellido: compras.usuarios.apellido,
                tipo: compras.usuarios.rol == 1 ? "ADMINISTRADOR" : "CLIENTE",
                email: compras.usuarios.email

            };
            const compra = {
                idCompra: compras.id,
                fechaCompra: compras.fecha,
                medioPago: compras.medio_pago,
                estado: compras.estado,
                detalleCompra: detalleCompra,
                totalCompra: totalCompra
            }
            return {
                usuario: usuario,
                compra: compra
            }
        });
        return responseInvoice;
    }
    async productosSales({ auth }) {
        const usuario = await auth.getUser();
        const productosArray = await ProductoService.findByIdUsuario(usuario.id);
        const productosResponse = [];
        productosArray.forEach(element => {
            let cantidadComprada = 0;
            let totalCompra = 0;
            element.comprasproductos.map(cp => {
                cantidadComprada += cp.cantidad
                totalCompra += cp.total
            });
            const producto = {
                idProducto: element.id,
                nombreProducto: element.nombre,
                precioProducto: element.precio,
                cantidadDisponible: element.cantidad,
                cantidadComprada: cantidadComprada,
                totalCompra: totalCompra,
            }
            productosResponse.push(producto);
        });
        return productosResponse;
    }


}

module.exports = CompraController
