import React, {useState, Fragment} from 'react';
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';
import {withRouter} from 'react-router-dom';

function NuevoProducto(props) {

    //producto = state, guardarproducto = setstate
    const [producto, guardarproducto] = useState({
        nombre: '',
        precio: ''
    });

    //archivo = state, guardarArchivo = setstate
    const [imagen, guardarImagen] = useState('');

    //Almacena el nuevo producto
    const agregarProducto = async e => {
        e.preventDefault();
        //Crear formdata
        const formData = new FormData();
        formData.append('nombre', producto.nombre);
        formData.append('precio', producto.precio);
        formData.append('imagen', imagen);

        //Almacenar en la BD
        try {
            const res = await clienteAxios.post('/productos', formData, {
                headers: {
                    'Content-Type' : 'multipart/form-data'
                }
            });
            if(res.status === 200) {
                Swal.fire(
                    'Agregado correctamente',
                    res.data.mensaje,
                    'success'
                )
            }
            //Redireccionar
            props.history.push('/productos');
        } catch (error) {
            console.log(error);
            Swal.fire({
                type: 'error',
                title: 'Hubo un error',
                text: 'Vulve a intentarlo'
            })
        }
    }

    //Leer los datos del formulario
    const leerInformacionProducto = e => {
        guardarproducto({
            //Obtener una copia del state y agregar el nuevo
            ...producto,
            [e.target.name] : e.target.value
        })
    }

    //Coloca la imagen en el state
    const leerImagen = e => {
        guardarImagen(e.target.files[0]);
    }

    return (
        <Fragment>
            <h2>Nuevo Producto</h2>

            <form
                onSubmit={agregarProducto}
            >
                <legend>Llena todos los campos</legend>

                <div className="campo">
                    <label>Nombre:</label>
                    <input type="text" placeholder="Nombre Producto" name="nombre" onChange={leerInformacionProducto} />
                </div>

                <div className="campo">
                    <label>Precio:</label>
                    <input type="number" name="precio" min="0.00" step="1" placeholder="Precio" onChange={leerInformacionProducto} />
                </div>

                <div className="campo">
                    <label>Imagen:</label>
                    <input type="file"  name="imagen" onChange={leerImagen} />
                </div>

                <div className="enviar">
                        <input type="submit" className="btn btn-azul" value="Agregar Producto" />
                </div>
            </form>
        </Fragment>

    )
}
export default withRouter(NuevoProducto);