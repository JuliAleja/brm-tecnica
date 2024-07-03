"use strict";
const UsuarioService = use("App/Services/UsuarioService");

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
     *  @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 201 OK
     *       {
     *           "nombre": "alejandra",
     *           "apellido": "sierra",
     *           "genero": "f",
     *           "email": "alejadra@gmail.com",
     *           "password": "$2a$10$juGhTVuTtfPAS0GLTdPEKOSnYmUlC61YZzXr6LTHieZyye8CDNX8S",
     *           "rol": 2,
     *           "created_at": "2024-07-03 08:48:10",
     *           "updated_at": "2024-07-03 08:48:10",
     *           "id": 2
     *       }
     * 
     * @apiErrorExample {json} Error en la creación:
     *     HTTP/1.1 500 Internal Server Error
     *     {
     *       "error": "Mensaje de error detallado"
     *     }
     */
    async create({ request, response }) {
        const usuarioCreate = await UsuarioService.create(request);
        return response.status(200).send(usuarioCreate)
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
      * @apiSuccessExample {json} Success-Response:
      *     HTTP/1.1 202 OK
      *      {
      *      "type": "bearer",
      *      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImlhdCI6MTcyMDAwOTQ3Nn0.rke-Lpa6UsBLHtGh45gIwYUHIDFncGqQqE6bi_B70DU",
      *      "refreshToken": null
      *      }
      * 
      * @apiErrorExample {json} Error en la autenticación:
      *     HTTP/1.1 401 Unauthorized
      *     {
      *       "error": "Credenciales inválidas"
      *     }      
      */

    async login({ request, auth, response }) {
        const { email, password } = request.all();
        const token = await auth.attempt(email, password);
        return response.status(202).send(token)
    }
}

module.exports = UsuarioController;
