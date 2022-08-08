import React, {Fragment, useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
//Importar cliente axios
import clienteAxios from '../../config/axios';
import Producto from './Producto';
import Spinner from '../layout/Spinner';

function Productos() {

    //Productos = state, guardarProductos = funcion para guardar el state
    const [productos, guardarProductos] = useState([]);

    //UseEffect para consultar api cuando cargue
    useEffect( () => {
        //Query a la api
        const consultarApi = async () => {
            const productosConsulta = await clienteAxios.get('/productos');
            guardarProductos(productosConsulta.data)
        }
        consultarApi();
    }, [productos]);

    //Spinner de carga
    if(!productos.length) return <Spinner/>

    return (
        <Fragment>
            <h2>Productos</h2>

            <Link to={'/productos/nuevo'} className="btn btn-verde nvo-cliente"> 
            <i className="fas fa-plus-circle"></i>
                Nuevo Producto
            </Link>

            <ul className="listado-productos">
                {productos.map(producto => (
                    <Producto
                        key={producto._id}
                        producto={producto}
                    />
                ))}
            </ul>
        </Fragment>
    )
}
export default Productos;