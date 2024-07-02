'use strict'

const Usuario = use("App/Models/Usuario");
const Compra = use("App/Models/Compra");


class CompraController {

    async findByIdCliente({ params, auth, response }) {
        await auth.getUser();
        const { idCliente } = params;
        const compra = await Usuario.query()
            .where('id', idCliente)
            .with('compras', (comprasQuery) => {
                comprasQuery.with('comprasproductos', (comprasProductosQuery) => {
                    comprasProductosQuery.with('productos')
                })
            })
            .fetch();

        const comprasArray = compra.toJSON();

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
        });;

        return responseCompras;
    }

    async sale({ request }) {
        const compras = request.all();
        const comprasArray = compras.toJSON();
        console.log(comprasArray);
    }

}

module.exports = CompraController
