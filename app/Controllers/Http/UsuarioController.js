"use strict";
const Usuario = use("App/Models/Usuario");

class UsuarioController {
    /**
     * @api {post} /usuarios/crear Crear un nuevo usuario
     * @apiName CrearUsuario
     * @apiGroup Usuarios
     *
     * @apiBody  {String} nombre Nombre del usuario.
     * @apiBody  {String} apellido Apellido del usuario.
     * @apiBody  {String} genero Género del usuario.
     * @apiBody  {String} email Email del usuario.
     * @apiBody  {String} password Contraseña del usuario.
     * @apiBody  {integer} rol Rol del usuario ( 1 ->Adminitrador, 2->Cliente).
     *
     * @apiSuccess   {String} nombre Nombre del usuario.
     * @apiSuccess   {String} apellido Apellido del usuario.
     * @apiSuccess   {String} genero Género del usuario.
     * @apiSuccess   {String} email Email del usuario.
     * @apiSuccess   {String} password Contraseña del usuario.
     * @apiSuccess   {integer} rol Rol del usuario ( 1 ->Adminitrador, 2->Cliente).
     *
     * @apiErrorExample {json} Error en la creación:
     *     HTTP/1.1 500 Internal Server Error
     *     {
     *       "error": "Mensaje de error detallado"
     *     }
     */
    async create({ request }) {
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

    /**
      * @api {post} /usuarios/login Iniciar sesión 
      * @apiName Iniciar sesión 
      * @apiGroup Usuarios
      *
  
      * @apiBody  {String} email Email del usuario.
      * @apiBody  {String} password Contraseña del usuario.
      *
      * @apiSuccess {String} token Token de autenticación para el usuario.
      *
      * @apiErrorExample {json} Error en la autenticación:
      *     HTTP/1.1 401 Unauthorized
      *     {
      *       "error": "Credenciales inválidas"
      *     }      
      */

    async login({ request, auth }) {
        const { email, password } = request.all();
        const token = await auth.attempt(email, password);
        return token;
    }
}

module.exports = UsuarioController;
