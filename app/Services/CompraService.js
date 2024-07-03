'use strict'

const Usuario = use("App/Models/Usuario");
const Compra = use("App/Models/Compra");


class CompraService {

    async findByIdCliente(id) {
        console.log(id);
        const compra = await Usuario.query()
            .where('id', id)
            .with('compras', (comprasQuery) => {
                comprasQuery.with('comprasproductos', (comprasProductosQuery) => {
                    comprasProductosQuery.with('productos')
                })
            })
            .fetch();
        const comprasArray = compra.toJSON();
        console.log("findByIdCliente", comprasArray);
        return comprasArray;
    }
    async create(idUsuario, fechaActual, metodoPago) {
        const compraCreate = await Compra.create({
            id_usuario: idUsuario,
            fecha: fechaActual,
            medio_pago: metodoPago,
            estado: "PAGO",
        });

        return compraCreate;
    }
    async findByIdClienteIdCompra(idUsuario, idCompra) {
        const usuarioConCompra = await Compra.query()
            .where('id', idCompra).andWhere('id', idUsuario)
            .with('usuarios').with('comprasproductos', (comprasProductosQuery) => {
                comprasProductosQuery.with('productos');
            })
            .fetch();
        const comprasArray = usuarioConCompra.toJSON();
        return comprasArray;
    }

}

module.exports = new CompraService();