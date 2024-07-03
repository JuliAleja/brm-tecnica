'use strict'

const Usuario = use('App/Models/Usuario');
const PermisoAdminExceptionException = use('App/Exceptions/PermisoAdminException')

class UsuarioService {

    async create(request) {
        const { nombre, apellido, genero, email, password, rol } = request.all();
        const usuario = await Usuario.create({
            nombre,
            apellido,
            genero,
            email,
            password,
            rol,
        });

        return usuario;
    }
    async validAdmin(usuario) {
        if (usuario.rol != 1) {
            throw new PermisoAdminExceptionException();
        }
    }

}

module.exports = new UsuarioService();