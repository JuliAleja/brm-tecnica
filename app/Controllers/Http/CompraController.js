'use strict'

const ProductoService = use("App/Services/ProductoService");
const CompraService = use("App/Services/CompraService");
const CompraProductoService = use("App/Services/CompraProductoService");
const FormatoService = use("App/Services/FormatoService");
const NotFoundException = use('App/Exceptions/NotFoundException')


class CompraController {
    /**
    * @api {get} /compras/clientes/:idCliente Listado de compras por cliente
    * @apiName ListadoComprasCliente
    * @apiGroup Compras
    *
    * @apiParam  {Integer} idCliente Identificador de usuario.
      
    * @apiParamExample {json} Request-Example:
    *     {
    *       "idCliente": 1
    *     }
    * 
    * @apiSuccess {Integer} idCliente Identificador de usuario.
    * @apiSuccess {String}  nombre Nombre del usuario.
    * @apiSuccess {String}  apellido Apellido del usuario.
    * @apiSuccess {String}  genero Género del usuario.
    * @apiSuccess {String}  email Email del usuario.
    * @apiSuccess {String}  tipo Tipo del usuario (ADMINISTRADOR, CLIENTE).
    * @apiSuccess {Object}  compras Informacion de la compra.
    * @apiSuccess {Integer} compras.idCompra Identificador de Compra.
    * @apiSuccess {Date}    compras.fecha Fecha de compra.
    * @apiSuccess {String}  compras.medioPago Medio de pago se relizo en la compra.
    * @apiSuccess {String}  compras.estado Estado de la compra(EN PROCESO,PAGO).z
    * @apiSuccess {Integer} compras.totalCompra Total de la compra.
    * @apiSuccess {Object}  productos Informacion del producto comprado.
    * @apiSuccess {Integer} productos.idProducto Identificador de Producto.
    * @apiSuccess {String}  productos.nombreProducto Nombre de producto.
    * @apiSuccess {Integer} productos.precioProducto Precio de producto inidividual.
    * @apiSuccess {Integer} productos.cantidad Cantidad de productos comprados.
    * @apiSuccess {Integer} productos.total Total del precio por la cantidad de productos comprados.
    * @apiSuccessExample {json} Success-Response:
    *     HTTP/1.1 202 OK
    *      {
    *        "idCliente": 1,
    *        "nombre": "julieth",
    *        "apellido": "sierra",
    *        "genero": "Femenino",
    *        "tipo": "ADMINISTRADOR",
    *        "email": "julieth@gmail.com",
    *        "compras": [
    *            {
    *                "idCompra": 1,
    *                "fecha": "2024-07-03T05:00:00.000Z",
    *                "medioPago": "Efectivo",
    *                "estado": "PAGO",
    *                "productos": [
    *                    {
    *                        "idProducto": 2,
    *                        "nombreProducto": "cat1",
    *                        "precioProducto": 10000,
    *                        "cantidad": 1,
    *                        "total": 10000
    *                    }
    *                ],
    *                "totalCompra": 10000
    *            },
    *            {
    *                "idCompra": 2,
    *                "fecha": "2024-07-03T05:00:00.000Z",
    *                "medioPago": "E fectivo",
    *                "estado": "PAGO",
    *                "productos": [
    *                    {
    *                        "idProducto": 2,
    *                        "nombreProducto": "cat1",
    *                        "precioProducto": 10000,
    *                        "cantidad": 1,
    *                        "total": 10000
    *                    }
    *                ],
    *                "totalCompra": 10000
    *            }
    *        ]
    *      } 
    * @apiErrorExample {json} Error en la autenticación:
    *     HTTP/1.1 401 Unauthorized
    *     {
    *       "error": "Credenciales inválidas"
    *     }   
    *    
    * @apiErrorExample {json} Error en el servidor:
    *     HTTP/1.1 404 NotFound
    *     {
    *       "error": "No se encotro registros"
    *     }      
    */

    async findByIdCliente({
        params,
        auth,
        response
    }) {
        await auth.getUser();
        const {
            idCliente
        } = params;
        const comprasArray = await CompraService.findByIdCliente(idCliente);
        const responseCompras = comprasArray.map(usuario => {
            return {
                idCliente: usuario.id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                genero: usuario.genero === 'f' ? 'Femenino' : 'Masculino',
                tipo: usuario.rol == 1 ? "ADMINISTRADOR" : "CLIENTE",
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
        return response.status(200).send(responseCompras)
    }
    /**
        * @api {post} /compras/  Efectuar compra
        * @apiName EfectuarCompra
        * @apiGroup Compras
        *
        * @apiBody  {Array}   Array donde contine una n cantidad de objetos.
        * @apiBody  {Object}  Objeto donde contiene la idProducto,cantidad,metodoPago.
        * @apiBody  {Integer} idProducto Identificador de producto.
        * @apiBody  {Integer} cantidad Cantidad de compra.
        * @apiBody  {Integer} metodoPago Metodo de pago ej("Efectivo","Credito").        
        * 
        * @apiSuccess {Integer} idCompra Identificador de Compra.
        * @apiSuccess {Date}    fecha Fecha de compra.
        * @apiSuccess {String}  medioPago Medio de pago se relizo en la compra.
        * @apiSuccess {String}  estado Estado de la compra(EN PROCESO,PAGO).
        * @apiSuccess {Object}  productos Informcion del producto comprado.
        * @apiSuccess {Integer} productos.idProducto Identificador de Producto.
        * @apiSuccess {String}  productos.nombreProducto Nombre de producto.
        * @apiSuccess {Integer} productos.precioProducto Precio de producto inidividual.
        * @apiSuccess {Integer} productos.cantidad Cantidad de productos comprados.
        * @apiSuccess {Integer} productos.total Total del precio por la cantidad de productos comprados.
        * 
        * @apiSuccessExample {json} Success-Response:
        *     HTTP/1.1 202 OK
        *      {
        *          "idCompra": 3,
        *          "fecha": "2024-07-03",
        *          "medioPago": "Efectivo",
        *          "estado": "PAGO",
        *          "productos": {
        *              "idProducto": 2,
        *              "nombreProducto": "cat1",
        *              "precioProducto": 10000,
        *              "cantidad": 1,
        *              "total": 10000
        *          }
        *      }
        *    
        * @apiErrorExample {json} Error en la autenticación:
        *     HTTP/1.1 401 Unauthorized
        *     {
        *       "error": "Credenciales inválidas"
        *     }      
        * @apiErrorExample {json} Error en el servidor:
        *     HTTP/1.1 404 NotFound
        *     {
        *       "error": "No se encotro registros"
        *     }      
        */
    async sale({
        request,
        auth,
        response
    }) {
        const usuario = await auth.getUser();
        const compras = request.all();
        let requestComprasProductos = [];
        const comprasArray = Object.values(compras);
        let responseCompras = [];
        const fechaNow = await FormatoService.fechaNowFormat();

        for (const element of comprasArray) {
            const compraCreate = await CompraService.create(usuario.id, fechaNow, element.metodoPago);
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
        return response.status(200).send(responseCompras)

    }

    /**
        * @api {get} /compras/factura/:id  Factura compra
        * @apiName FacturaCompra
        * @apiGroup Compras
        * @apiParam  {Integer} id Identificador de compra.
        * 
        * @apiParamExample {json} Request-Example:
        *     {
        *       "id": 1
        *     }
        * @apiSuccess {Integer} idUsusario Identificador de usuario.
        * @apiSuccess {String}  nombre Nombre del usuario.
        * @apiSuccess {String}  apellido Apellido del usuario.
        * @apiSuccess {String}  email Email del usuario.
        * @apiSuccess {String}  tipo Tipo del usuario (ADMINISTRADOR, CLIENTE).
        * @apiSuccess {Object}  compras Informacion de la compra.
        * @apiSuccess {Integer} compras.idCompra Identificador de Compra.
        * @apiSuccess {Date}    compras.fechaCompra Fecha de compra.
        * @apiSuccess {String}  compras.medioPago Medio de pago se relizo en la compra.
        * @apiSuccess {String}  compras.estado Estado de la compra(EN PROCESO,PAGO).z
        * @apiSuccess {Integer} compras.totalCompra Total de la compra.
        * @apiSuccess {Object}  detalleCompra Informacion del producto comprado.
        * @apiSuccess {Integer} detalleCompra.idProducto Identificador de Producto.
        * @apiSuccess {String}  detalleCompra.nombreProducto Nombre de producto.
        * @apiSuccess {Integer} detalleCompra.precioProducto Precio de producto inidividual.
        * @apiSuccess {Integer} detalleCompra.cantidad Cantidad de productos comprados.
        * @apiSuccess {Integer} detalleCompra.total Total del precio por la cantidad de productos comprados.
        * 
        * @apiSuccessExample {json} Success-Response:
        *     HTTP/1.1 202 OK
        *      [
        *           {
        *               "usuario": {
        *                   "idUsusario": 1,
        *                   "nombre": "julieth",
        *                   "apellido": "sierra",
        *                   "tipo": "ADMINISTRADOR",
        *                   "email": "julieth@gmail.com"
        *               },
        *               "compra": {
        *                   "idCompra": 1,
        *                   "fechaCompra": "2024-07-03T05:00:00.000Z",
        *                   "medioPago": "Efectivo",
        *                   "estado": "PAGO",
        *                   "detalleCompra": [
        *                       {
        *                           "idProducto": 2,
        *                           "nombreProducto": "cat1",
        *                           "precioProducto": 10000,
        *                           "cantidad": 1,
        *                           "total": 10000
        *                       }
        *                   ],
        *                   "totalCompra": 10000
        *               }
        *           }
        *       ]
        *    
        * @apiErrorExample {json} Error en la autenticación:
        *     HTTP/1.1 401 Unauthorized
        *     {
        *       "error": "Credenciales inválidas"
        *     }      
        * @apiErrorExample {json} Error en el servidor:
        *     HTTP/1.1 404 NotFound
        *     {
        *       "error": "No se encotro registros"
        *     }      
        */

    async invoice({
        params,
        auth,
        response
    }) {
        const usuario = await auth.getUser();
        const {
            id
        } = params;
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
        return response.status(200).send(responseInvoice)
    }

    /**
        * @api {get} /compras/productos  Listado de productos comprado
        * @apiName ListadoProductosCompra
        * @apiGroup Compras

        * @apiSuccess {Integer} idProducto Identificador de Producto.
        * @apiSuccess {String}  nombreProducto Nombre de producto.
        * @apiSuccess {Integer} precioProducto Precio de producto inidividual.
        * @apiSuccess {Integer} cantidadDisponible Cantidad de productos en inventario.
        * @apiSuccess {Integer} cantidadComprada Cantidad de productos comprados.
        * @apiSuccess {Integer} totalCompra Total del precio por la cantidad de productos comprados.
        * 
        * @apiSuccessExample {json} Success-Response:
        *     HTTP/1.1 202 OK
        *      [
        *           {
        *               "idProducto": 2,
        *               "nombreProducto": "cat1",
        *               "precioProducto": 10000,
        *               "cantidadDisponible": 27,
        *               "cantidadComprada": 3,
        *               "totalCompra": 30000
        *           }
        *       ]
        *    
        * @apiErrorExample {json} Error en la autenticación:
        *     HTTP/1.1 401 Unauthorized
        *     {
        *       "error": "Credenciales inválidas"
        *     }      
        * @apiErrorExample {json} Error en el servidor:
        *     HTTP/1.1 404 NotFound
        *     {
        *       "error": "No se encotro registros"
        *     }       
        */

    async productosSales({
        auth, response
    }) {
        const usuario = await auth.getUser();
        const comprasArray = await CompraService.findByIdCliente(usuario.id);
        const productosList = [];
        let productMap = {};
        let compras = [];
        comprasArray.map(usuario => {
            compras = usuario.compras;
        });
        if (compras.length == 0) {
            throw new NotFoundException();
        }
        compras.forEach(element => {
            let cantidadComprada = 0;
            let totalCompra = 0;
            element.comprasproductos.map(cp => {
                cantidadComprada += cp.cantidad
                totalCompra += cp.total
                const producto = {
                    idProducto: cp.productos.id,
                    nombreProducto: cp.productos.nombre,
                    precioProducto: cp.productos.precio,
                    cantidadDisponible: cp.productos.cantidad_disponible,
                    cantidadComprada: cantidadComprada,
                    totalCompra: totalCompra,
                }
                productosList.push(producto);
            });
        });
        productosList.forEach(producto => {
            const { idProducto, nombreProducto, precioProducto, cantidadDisponible, cantidadComprada, totalCompra } = producto;

            if (productMap[idProducto]) {
                productMap[idProducto].cantidadComprada += cantidadComprada;
                productMap[idProducto].totalCompra += totalCompra;
            } else {
                productMap[idProducto] = {
                    idProducto,
                    nombreProducto,
                    precioProducto,
                    cantidadDisponible,
                    cantidadComprada,
                    totalCompra
                };
            }
        });
        return response.status(200).send(Object.values(productMap))
    }


}

module.exports = CompraController
