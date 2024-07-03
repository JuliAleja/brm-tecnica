'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
  Route.post('crear', 'UsuarioController.create');
  Route.post('login', 'UsuarioController.login');
}).prefix('usuarios')

Route.group(() => {
  Route.post('crear', 'ProductoController.create');
  Route.get('/', 'ProductoController.all');
  Route.get(':id', 'ProductoController.findById');
  Route.put(':id', 'ProductoController.update');
  Route.delete(':id', 'ProductoController.destroy');
}).prefix('productos')

Route.group(() => {
  Route.post('/', 'CompraController.sale');
  Route.get('factura/:id', 'CompraController.invoice');
  Route.get('productos', 'CompraController.productosSales');
  Route.get('clientes/:idCliente', 'CompraController.findByIdCliente');
}).prefix('compras')
