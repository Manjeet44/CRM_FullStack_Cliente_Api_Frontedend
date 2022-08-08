import React, {useState, useEffect, Fragment} from 'react';
import clienteAxios from '../../config/axios';
import FormBuscarProducto from './FormBuscarProducto';
import FormCantidadProducto from './FormCantidadProducto';
import Swal from 'sweetalert2';
import {withRouter} from 'react-router-dom';

function NuevoPedido(props) {
    
    //Extraer ID de cliente
    const {id} = props.match.params;

    //State
    const [cliente, guardarCliente] = useState({});
    const [busqueda, guardarBusqueda] = useState('');
    const [productos, guardarProductos] = useState([]);
    const [total, guardarTotal] = useState(0);

    useEffect(() => {
        //Obtener el cliente
        const consultarAPI = async () => {
            //Consultar el cliente actual
            const resultado = await clienteAxios.get(`/clientes/${id}`);
            guardarCliente(resultado.data);
        }
        consultarAPI();

        //Actualizar el total a pagar
        actualizarTotal();
    }, [productos])

    const buscarProducto = async e => {
        e.preventDefault();
        //Obtener los productos de la busqueda
        const resultadoBusqueda = await clienteAxios.post(`/productos/busqueda/${busqueda}`);
        //Si no hay resultados una alerta, contrario agregarlo al state
        if(resultadoBusqueda.data[0]) {
            let productoResultado = resultadoBusqueda.data[0];
            //Agregar la llava producto
            productoResultado.producto = resultadoBusqueda.data[0]._id;
            productoResultado.cantidad = 0;
            //Ponerlo en el State
            guardarProductos([...productos, productoResultado])
        } else {
            //No hay resutlado
            Swal.fire({
                type: 'error',
                title: 'No resultados',
                text: 'No hay resultados'
            })
        }
    }
    //Almacena busqueda en el state
    const leerDatosBusqueda = e => {
        guardarBusqueda(e.target.value);
    }

    //Actualizar la cantidad de productos
    const restarProductos = i => {
        const todosProductos = [...productos];

        if(todosProductos[i].cantidad === 0) return;
        todosProductos[i].cantidad--;

        //Almacenarlo al state
        guardarProductos(todosProductos);
    }
    const sumarProductos = i => {
        const todosProductos = [...productos];
        todosProductos[i].cantidad++;
        guardarProductos(todosProductos);
    }

    //Elimina un producto del state
    const eliminarPorductoPedido = id => {
        const todosProductos = productos.filter(producto => producto.producto !== id);
        guardarProductos(todosProductos);
    }

    //Actualizar total a pagar
    const actualizarTotal = () => {
        if(productos.length === 0) {
            guardarTotal(0);
            return;
        }

        let nuevoTotal = 0;

        productos.map(producto => nuevoTotal += (producto.cantidad * producto.precio));
        guardarTotal(nuevoTotal);
    }

    //Almacena el pedido en la BD
    const realizarPedido = async e => {
        e.preventDefault();

        //Extraer el ID
        const {id} = props.match.params;

        //Construir el objeto
        const pedido = {
            "cliente" : id,
            "pedido" : productos,
            "total" : total
        }
        
        //Almacenarlo en la BD
        const resultado = await clienteAxios.post(`/pedidos/nuevo/${id}`, pedido);

        //Leer resultado
        if(resultado.status === 200) {
            //Todo bien
            Swal.fire({
                type: 'success',
                title: 'Correcto',
                text: resultado.data.mensaje
                })
            } else {
                Swal.fire({
                    type: 'error',
                    title: 'Hubo un error',
                    text: 'Vuelve a intentarlo'
                })
            }
        //Redireccionar
        props.history.push('/pedidos');
    }
    
    return (
        <Fragment>
            <h2>Nuevo Pedido</h2>

                <div className="ficha-cliente">
                    <h3>Datos de Cliente</h3>
                    <p>Nombre: {cliente.nombre} {cliente.apellido}</p>
                    <p> Telefono: {cliente.telefono}</p>
                </div>
                <FormBuscarProducto
                    buscarProducto={buscarProducto}
                    leerDatosBusqueda={leerDatosBusqueda}
                />
                    <ul className="resumen">
                        {productos.map((producto, index) => (
                            <FormCantidadProducto 
                                key={producto.producto}
                                producto={producto}
                                restarProductos={restarProductos}
                                sumarProductos={sumarProductos}
                                eliminarPorductoPedido={eliminarPorductoPedido}
                                index={index}
                            />
                        ))}
                    </ul>
                    <p className='total'>Total a Pagar: <span> {total} € </span></p>
                    {total > 0 ? (
                        <form
                            onSubmit={realizarPedido}
                        >
                            <input type="submit" className="btn btn-verde btn-block" value="Realizar Pedido" />
                        </form>
                    ) : null}
                
            </Fragment>
    )
}

export default withRouter(NuevoPedido);