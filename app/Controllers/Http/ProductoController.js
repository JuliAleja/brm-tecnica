'use strict'

const ProductoService = use("App/Services/ProductoService");
const CompraProductoService = use("App/Services/CompraProductoService");
const UsuarioService = use("App/Services/UsuarioService");
const FormatoService = use('App/Services/FormatoService');

class ProductoController {
    /**
         * @api {post} /productos/crear Crear un nuevo producto
         * @apiName CrearProducto
         * @apiGroup Producto
         * 
         * @apiBody  {Integer} nLote Numero de lote .
         * @apiBody  {String} nombre Nombre del producto.
         * @apiBody  {Integer} precio Precio del producto.
         * @apiBody  {Integer} cantidadDisponible Cantidad disponible del producto ingresado.
         *
         * @apiSuccess   {Integer} id Identificador de producto.
         * @apiSuccess   {String} nombre Nombre del producto.
         * @apiSuccess   {Integer} numeroLote Numero de lote .
         * @apiSuccess   {Integer} precio Precio del producto.
         * @apiSuccess   {Integer} cantidadDisponible Cantidad disponible del producto ingresado.
         * @apiSuccess   {Date} fechaIngreso Fecha e la que se igreso el producto.
         * @apiSuccess   {String} estado Estado del producto.
         *
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 201 OK
         *       {
         *           "id": 3,
         *           "nombre": "cat1",
         *           "numeroLote": 1,
         *           "precio": 10000,
         *           "cantidadDisponible": 30,
         *           "fechaIngreso": "2024-07-03",
         *           "estado": "ACTIVO"
         *       }
         * 
         * @apiErrorExample {json} Error en la creación:
         *     HTTP/1.1 500 Internal Server Error
         *     {
         *       "error": "Mensaje de error detallado"
         *     }
         * 
         * @apiErrorExample {json} Error en los permisos:
         *     HTTP/1.1 401 Unauthorized
         *     {
         *       "error": "Mensaje de error detallado"
         *     }
         */
    async create({ auth, request, response }) {
        const usuario = await auth.getUser();
        await UsuarioService.validAdmin(usuario);
        const fechaNow = await FormatoService.fechaNowFormat();
        const productoCreate = await ProductoService.create(request, fechaNow);
        const responseProdcuto = {
            id: productoCreate.id,
            nombre: productoCreate.nombre,
            numeroLote: productoCreate.n_lote,
            precio: productoCreate.precio,
            cantidadDisponible: productoCreate.cantidad_disponible,
            fechaIngreso: productoCreate.fecha_ingreso,
            estado: productoCreate.estado,

        };
        return response.status(201).send(responseProdcuto)
    }

    /**
            * @api {get} /productos Lista de productos 
            * @apiName ListaProductos
            * @apiGroup Producto
            * 
            *
            * @apiSuccess   {Integer} id Identificador de producto.
            * @apiSuccess   {String} nombre Nombre del producto.
            * @apiSuccess   {Integer} numeroLote Numero de lote .
            * @apiSuccess   {Integer} precio Precio del producto.
            * @apiSuccess   {Integer} cantidadDisponible Cantidad disponible del producto ingresado.
            * @apiSuccess   {Date} fechaIngreso Fecha e la que se igreso el producto.
            * @apiSuccess   {String} estado Estado del producto.
            * 
            * @apiSuccessExample {json} Success-Response:
            *     HTTP/1.1 200 OK
            * [
            *       {
            *           "id": 3,
            *           "nombre": "cat1",
            *           "numeroLote": 1,
            *           "precio": 10000,
            *           "cantidadDisponible": 30,
            *           "fechaIngreso": "2024-07-03",
            *           "estado": "ACTIVO"
            *       } 
            * ]
            * 
            *
            * @apiErrorExample {json} Error en el servidor:
            *     HTTP/1.1 404 Internal Server Error
            *     {
            *       "error": "Mensaje de error detallado"
            *     }
            * 
            * @apiErrorExample {json} Error en los permisos:
            *     HTTP/1.1 401 Unauthorized
            *     {
            *       "error": "Mensaje de error detallado"
            *     }
            */

    async all({ auth, response }) {
        const usuario = await auth.getUser();
        await UsuarioService.validAdmin(usuario);
        const productos = await ProductoService.all();
        let productosResponse = [];
        productos.rows.forEach(producto => {
            const responseProducto = {
                id: producto.id,
                nombre: producto.nombre,
                numeroLote: producto.n_lote,
                precio: producto.precio,
                cantidadDisponible: producto.cantidad_disponible,
                fechaIngreso: producto.fecha_ingreso,
                estado: producto.estado,

            };
            productosResponse.push(responseProducto);
        });

        return response.status(200).send(productosResponse)
    }
    /**
        * @api {get} /productos/:id Producto detallado
        * @apiName ProductoDetallado
        * @apiGroup Producto
        * 
        * @apiParam  {Integer} id Identificador de producto.
        * @apiParamExample {json} Request-Example:
        *     {
        *       "id": 1
        *     }
        *
        *
        * @apiSuccess   {Integer} id Identificador de producto.
        * @apiSuccess   {String} nombre Nombre del producto.
        * @apiSuccess   {Integer} numeroLote Numero de lote .
        * @apiSuccess   {Integer} precio Precio del producto.
        * @apiSuccess   {Integer} cantidadDisponible Cantidad disponible del producto ingresado.
        * @apiSuccess   {Date} fechaIngreso Fecha e la que se igreso el producto.
        * @apiSuccess   {String} estado Estado del producto.
        *
        * @apiSuccessExample {json} Success-Response:
        *     HTTP/1.1 200 OK
        *       {
        *           "id": 3,
        *           "nombre": "cat1",
        *           "numeroLote": 1,
        *           "precio": 10000,
        *           "cantidadDisponible": 30,
        *           "fechaIngreso": "2024-07-03",
        *           "estado": "ACTIVO"
        *       }
        * 
        * @apiErrorExample {json} Error en la Error en el servido:
        *     HTTP/1.1 404 Internal Server Error
        *     {
        *       "error": "Mensaje de error detallado"
        *     }
        * 
        * @apiErrorExample {json} Error en los permisos:
        *     HTTP/1.1 401 Unauthorized
        *     {
        *       "error": "Mensaje de error detallado"
        *     }
        */
    async findById({ params, auth, response }) {
        const usuario = await auth.getUser();
        await UsuarioService.validAdmin(usuario);
        const { id } = params;
        const producto = await ProductoService.findById(id);
        const responseProducto = {
            id: producto.id,
            nombre: producto.nombre,
            numeroLote: producto.n_lote,
            precio: producto.precio,
            cantidadDisponible: producto.cantidad_disponible,
            fechaIngreso: producto.fecha_ingreso,
            estado: producto.estado,

        };
        return response.status(200).send(responseProducto)
    }

    /**
         * @api {put} /productos/:id EditarProducto
         * @apiName EdiarProducto
         * @apiGroup Producto
         * 
         * @apiParam  {Integer} id Identificador de producto.
         * @apiParamExample {json} Request-Example:
         *     {
         *       "id": 1
         *     }
         * 
         * @apiBody  {Integer} nLote Numero de lote .
         * @apiBody  {Integer} precio Precio del producto.
         * @apiBody  {Integer} cantidadDisponible Cantidad disponible del producto ingresado.
         * @apiBody  {Date} fechaIngreso Fecha a la que se ingreso el producto.
         * @apiBody  {String} nombre Nombre del producto.
         * 
         * @apiSuccess   {Integer} id Identificador de producto.
         * @apiSuccess   {String} nombre Nombre del producto.
         * @apiSuccess   {Integer} numeroLote Numero de lote .
         * @apiSuccess   {Integer} precio Precio del producto.
         * @apiSuccess   {Integer} cantidadDisponible Cantidad disponible del producto ingresado.
         * @apiSuccess   {Date} fechaIngreso Fecha e la que se igreso el producto.
         * @apiSuccess   {String} estado Estado del producto.
         *
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *       {
         *           "id": 3,
         *           "nombre": "cat1",
         *           "numeroLote": 1,
         *           "precio": 10000,
         *           "cantidadDisponible": 30,
         *           "fechaIngreso": "2024-07-03",
         *           "estado": "ACTIVO"
         *       }
         * 
         * @apiErrorExample {json} Error en el servidor:
         *     HTTP/1.1 4040 Internal Server Error
         *     {
         *       "error": "Mensaje de error detallado"
         *     }
         * 
         * @apiErrorExample {json} Error en los permisos:
         *     HTTP/1.1 401 Unauthorized
         *     {
         *       "error": "Mensaje de error detallado"
         *     }
         */

    async update({ params, request, auth, response }) {
        const usuario = await auth.getUser();
        await UsuarioService.validAdmin(usuario);
        const { id } = params;
        const productoUpdate = await ProductoService.update(request, id);
        const responseProducto = {
            id: productoUpdate.id,
            nombre: productoUpdate.nombre,
            numeroLote: productoUpdate.n_lote,
            precio: productoUpdate.precio,
            cantidadDisponible: productoUpdate.cantidad_disponible,
            fechaIngreso: productoUpdate.fecha_ingreso,
            estado: productoUpdate.estado,

        };
        return response.status(200).send(responseProducto)
    }
    /**
         * @api {patch} /productos/:id Cambiar Estado Producto
         * @apiName EstadoProducto
         * @apiGroup Producto
         * 
         * @apiParam  {Integer} id Identificador de producto.
         * @apiParamExample {json} Request-Example:
         *     {
         *       "id": 1
         *     }
         * 
         * @apiSuccess   {Integer} id Identificador de producto.
         * @apiSuccess   {String} nombre Nombre del producto.
         * @apiSuccess   {Integer} numeroLote Numero de lote .
         * @apiSuccess   {Integer} precio Precio del producto.
         * @apiSuccess   {Integer} cantidadDisponible Cantidad disponible del producto ingresado.
         * @apiSuccess   {Date} fechaIngreso Fecha e la que se igreso el producto.
         * @apiSuccess   {String} estado Estado del producto.
         *
         * 
         *  @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *       {
         *           "id": 3,
         *           "nombre": "cat1",
         *           "numeroLote": 1,
         *           "precio": 10000,
         *           "cantidadDisponible": 30,
         *           "fechaIngreso": "2024-07-03",
         *           "estado": "ACTIVO"
         *       }
         * 
         * @apiErrorExample {json}Error en el servidor:
         *     HTTP/1.1 404 Internal Server Error
         *     {
         *       "error": "Mensaje de error detallado"
         *     }
         * 
         * @apiErrorExample {json} Error en los permisos:
         *     HTTP/1.1 401 Unauthorized
         *     {
         *       "error": "Mensaje de error detallado"
         *     }
         */

    async status({ params, auth, response }) {
        const usuario = await auth.getUser();
        await UsuarioService.validAdmin(usuario);
        const { id } = params;
        const productoStatus = await ProductoService.status(id);
        const responseProducto = {
            id: productoStatus.id,
            nombre: productoStatus.nombre,
            numeroLote: productoStatus.n_lote,
            precio: productoStatus.precio,
            cantidadDisponible: productoStatus.cantidad_disponible,
            fechaIngreso: productoStatus.fecha_ingreso,
            estado: productoStatus.estado,
        };
        return response.status(200).send(responseProducto)
    }
    /**
         * @api {delete} /productos/:id Cambiar Estado Producto
         * @apiName EstadoProducto
         * @apiGroup Producto
         * 
         * @apiParam  {Integer} id Identificador de producto.
         * @apiParamExample {json} Request-Example:
         *     {
         *       "id": 1
         *     }
         * 
         * @apiSuccess   {Integer} id Identificador de producto.
         * @apiSuccess   {String} nombre Nombre del producto.
         * @apiSuccess   {Integer} numeroLote Numero de lote .
         * @apiSuccess   {Integer} precio Precio del producto.
         * @apiSuccess   {Integer} cantidadDisponible Cantidad disponible del producto ingresado.
         * @apiSuccess   {Date} fechaIngreso Fecha e la que se igreso el producto.
         * @apiSuccess   {String} estado Estado del producto.
         * 
         *  @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *       {
         *           "id": 3,
         *           "nombre": "cat1",
         *           "numeroLote": 1,
         *           "precio": 10000,
         *           "cantidadDisponible": 30,
         *           "fechaIngreso": "2024-07-03",
         *           "estado": "ACTIVO"
         *       }
         *
         * @apiErrorExample {json} Error en el servidor:
         *     HTTP/1.1 404 Internal Server Error
         *     {
         *       "error": "Mensaje de error detallado"
         *     }
         * 
         * @apiErrorExample {json} Error en los permisos:
         *     HTTP/1.1 401 Unauthorized
         *     {
         *       "error": "Mensaje de error detallado"
         *     }
         * 
         * @apiErrorExample {json} Error de negocio:
         *     HTTP/1.1 422 BussinesException
         *     {
         *       "error": "Mensaje de error detallado"
         *     }
         */

    async destroy({ params, auth, response }) {
        const usuario = await auth.getUser();
        await UsuarioService.validAdmin(usuario);
        const { id } = params;
        await CompraProductoService.verifyproducto(id);
        const productoDelete = await ProductoService.destroy(id);
        const responseProducto = {
            id: productoDelete.id,
            nombre: productoDelete.nombre,
            numeroLote: productoDelete.n_lote,
            precio: productoDelete.precio,
            cantidadDisponible: productoDelete.cantidad_disponible,
            fechaIngreso: productoDelete.fecha_ingreso,
            estado: productoDelete.estado,
        };
        return response.status(200).send(responseProducto)
    }



}

module.exports = ProductoController
