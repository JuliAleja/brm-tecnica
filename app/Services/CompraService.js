'use strict'

const Usuario = use("App/Models/Usuario");
const Compra = use("App/Models/Compra");
const NotFoundException = use('App/Exceptions/NotFoundException')


class CompraService {

    async findByIdCliente(id) {
        const compra = await Usuario.query()
            .where('id', id)
            .with('compras', (comprasQuery) => {
                comprasQuery.with('comprasproductos', (comprasProductosQuery) => {
                    comprasProductosQuery.with('productos')
                })
            })
            .fetch();
        const comprasArray = compra.toJSON();
        if (comprasArray.length == 0) {
            throw new NotFoundException();
        }
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
            .where('id', idCompra).andWhere('id_usuario', idUsuario)
            .with('usuarios').with('comprasproductos', (comprasProductosQuery) => {
                comprasProductosQuery.with('productos');
            })
            .fetch();
        const comprasArray = usuarioConCompra.toJSON();
        if (comprasArray.length == 0) {
            throw new NotFoundException();
        }
        return comprasArray;
    }
    Ñ
}

module.exports = new CompraService();