import React, {useState, useEffect, Fragment} from 'react';
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';
import {withRouter} from 'react-router-dom';
import Spinner from '../layout/Spinner';

function EditarProductos(props) {

    //Obtener el ID del producto
    const { id } = props.match.params;

    //producto = state y funcion para actz
    const [ producto, guardarProducto] = useState({
        nombre: '',
        precio: '',
        imagen: ''
    })

    //archivo = state, guardarArchivo = setstate
    const [archivo, guardarArchivo] = useState('');
    
    //Cuando el componente carga
    useEffect(()=> {
        //Consultar la api para traer el producto a editar
        const consultarAPI = async () => {
        const productoConsulta = await clienteAxios.get(`/productos/${id}`);
        guardarProducto(productoConsulta.data)
        }
        consultarAPI();
    }, []);

    //Edita un producto en la BD
    const editarProducto = async e => {
        e.preventDefault();
        //Crear formdata
        const formData = new FormData();
        formData.append('nombre', producto.nombre);
        formData.append('precio', producto.precio);
        formData.append('imagen', imagen);

        //Almacenar en la BD
        try {
            const res = await clienteAxios.put(`/productos/${id}`, formData, {
                headers: {
                    'Content-Type' : 'multipart/form-data'
                }
            });
            if(res.status === 200) {
                Swal.fire(
                    'Guardado correctamente',
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
        guardarProducto({
            //Obtener una copia del state y agregar el nuevo
            ...producto,
            [e.target.name] : e.target.value
        })
    }

    //Coloca la imagen en el state
    const leerImagen = e => {
        guardarArchivo(e.target.files[0]);
    }

    const {nombre, precio, imagen} = producto;

    if(!nombre) return <Spinner/>

    return (
        <Fragment>
            <h2>Editar Producto</h2>

            <form
                onSubmit={editarProducto}
            >
                <legend>Llena todos los campos</legend>

                <div className="campo">
                    <label>Nombre:</label>
                    <input type="text" placeholder="Nombre Producto" name="nombre" onChange={leerInformacionProducto} defaultValue={nombre} />
                </div>

                <div className="campo">
                    <label>Precio:</label>
                    <input type="number" name="precio" min="0.00" step="1" placeholder="Precio" onChange={leerInformacionProducto} defaultValue={precio} />
                </div>

                <div className="campo">
                    <label>Imagen:</label>
                    {imagen ? (
                        <img src={`http://localhost:5000/${imagen}`} alt="imagen" width="300" />
                    ) : null }
                    <input type="file"  name="imagen" onChange={leerImagen} />
                </div>

                <div className="enviar">
                        <input type="submit" className="btn btn-azul" value="Guardar Cambios" />
                </div>
            </form>
        </Fragment>
    )
}

export default withRouter(EditarProductos);