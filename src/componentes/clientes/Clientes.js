import React, {useEffect, useState, Fragment} from 'react';

//importar cliente axios
import clienteAxios from '../../config/axios';

import Cliente from './Cliente';
import NuevoCliente from './NuevoCliente';
import {Link} from 'react-router-dom';
import Spinner from '../layout/Spinner';


function Clientes() {
    //Trabajar con el state
    //clientes=state, guardarClientes = funcion para guardar el state
    const [clientes, guardarClientes] = useState([]);

    

    useEffect(() => {
        //Query al api
        const consultarAPI = async () => {
        const clientesConsulta = await clienteAxios.get('/clientes', {
            headers: {
                Authorization: `Bearer HOLAMUNDO`
            }
        });

        //Colocar el resultado en el state
        guardarClientes(clientesConsulta.data);
    }
        consultarAPI();
    }, [clientes] );

    //Spinner de carga
    if(!clientes.length) return <Spinner/>

    return (
        <Fragment>
            <h2>Clientes</h2>
            <Link to={"/clientes/nuevo"} className="btn btn-verde nvo-cliente"> 
                <i className="fas fa-plus-circle"></i>
                Nuevo Cliente
            </Link>

            <ul className='listado-clientes'>
                {clientes.map(cliente => (
                    <Cliente
                        key={cliente._id}
                        cliente={cliente}
                    />
                ))}
            </ul>
        </Fragment>
    )
}
export default Clientes;