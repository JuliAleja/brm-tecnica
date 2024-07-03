'use strict'

const ProductoService = use("App/Services/ProductoService");
const UsuarioService = use("App/Services/UsuarioService");

class ProductoController {

    async create({ auth, request }) {
        const usuario = await auth.getUser();
        await UsuarioService.validAdmin(usuario);
        const productoCreate = await ProductoService.create(request)
        return productoCreate;
    }

    async all({ auth }) {
        const usuario = await auth.getUser();
        await UsuarioService.validAdmin(usuario);
        const productos = await ProductoService.all();
        return productos;
    }

    async findById({ params, auth }) {
        const usuario = await auth.getUser();
        await UsuarioService.validAdmin(usuario);
        const { id } = params;
        const producto = await ProductoService.findById(id);
        return producto;
    }
    async update({ params, request, auth }) {
        const usuario = await auth.getUser();
        await UsuarioService.validAdmin(usuario);
        const { id } = params;
        const productoUpdate = await ProductoService.update(request, id);
        return productoUpdate;
    }

    async destroy({ params, auth }) {
        const usuario = await auth.getUser();
        await UsuarioService.validAdmin(usuario);
        const { id } = params;
        const productoDelete = await ProductoService.destroy(id);
        return productoDelete;
    }



}

module.exports = ProductoController
