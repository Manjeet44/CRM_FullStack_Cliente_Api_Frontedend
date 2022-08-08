import React, {useState} from 'react';
import Swal from 'sweetalert2';
import { withRouter } from 'react-router-dom';
import clienteAxios from '../../config/axios';

function Login(props){

    //State con los datos del formulario
    const [credenciales, guardarCredenciales] = useState({});

    //Iniciar Sesion en el Servidor
    const iniciarSesion = async e => {
        e.preventDefault();

        //Autenticar al usuario
        try {
            const respuesta = await clienteAxios.post('/iniciar-sesion', credenciales);
            
            //Extraer el token y colocarlo en localstorage
            const {token} = respuesta.data;
            localStorage.setItem('token', token);

            Swal.fire(
                'Login Correcto',
                'Has iniciado Sesion',
                'success'
            )
            props.history.push('/');
            
        } catch (error) {
            console.log(error);
            Swal.fire({
                type: 'error',
                title: 'Hubo un error',
                text: error.response.data.mensaje
            })
        }
    }


    //Almacenar lo que el usuario escribe en el state
    const leerDatos = e => {
        guardarCredenciales({
            ...credenciales,
            [e.target.name] : e.target.value
        })
    }
    return(
        <div className='login'>
            <h2>Iniciar Sesion</h2>
            <div className="contenedor-formulario">
                <form
                    onSubmit={iniciarSesion}
                >
                    <div className="campo">
                        <label>Email</label>
                        <input 
                            type="text" 
                            name='email'
                            placeholder='Tu email'
                            onChange={leerDatos}
                        />
                    </div>

                    <div className="campo">
                        <label>Password</label>
                        <input 
                            type="password" 
                            name='password'
                            placeholder='Tu password'
                            required
                            onChange={leerDatos}
                        />
                    </div>
                    <input type="submit" value='Iniciar Sesion' className="btn btn-verde btn-block" />
                </form>
            </div>
        </div>
    )
}

export default withRouter(Login);
