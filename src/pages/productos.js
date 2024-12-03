import React, { useEffect, useState } from "react";
import axios from "axios";
import verdurasImg from '../img/verduras.svg';
import { useNavigate, useParams } from 'react-router-dom';
import { Spinner } from "react-bootstrap";

const baseURL = "http://127.0.0.1:8000/api/productos";

export const Productos = () => {
    const [productos, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(baseURL, {
            headers: {
                'Accept': 'application/json',
            }
        })
            .then((response) => {
                setProducts(response.data)
            })
    }, [])

    const handleUpdate = (id) => {
        navigate(`/producto/actualizar/${id}`)
    };

    const handleDelete = (id) => {
        navigate(`/producto/eliminar/${id}`)
    };

    // Si no hay productos, mostramos el spinner de carga
    if (productos.length === 0) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    const ProductCard = ({ product }) => {
        return (
            <div className="card mb-3" style={{ height: 'auto' }}>
                <div className="row g-0">
                    <div className="col-12 col-md-1 d-flex ">
                        <img
                            src={verdurasImg}
                            className="img-fluid rounded-start"
                            alt={product.nombre}
                            loading="lazy"
                            style={{
                                objectFit: 'contain',
                                maxHeight: '10rem',
                                width: '100%',
                                borderTopLeftRadius: '0.25rem',
                                borderBottomLeftRadius: '0.25rem',
                            }}
                        />
                    </div>
                    <div className="col-12 col-md-8">
                        <div className="card-body">
                            <h5 className="card-title">{product.nombre}</h5>
                            <p className="card-text">Cantidad: {product.cantidad} {product.medida}</p>
                            <p className="card-text">Precio: ${product.precio}</p>
                            <p className="card-text">
                                <small className="text-body-secondary">
                                    Última actualización: {new Date(product.updated_at).toLocaleString()}
                                </small>
                            </p>
                        </div>
                    </div>
                    <div className="col-12 ms-auto col-md-2 p-2 d-flex flex-column align-items-center justify-content-center">
                        <button
                            type="button"
                            className="btn btn-warning m-2"
                            onClick={() => handleUpdate(product.id)}
                            style={{ width: '100%' }}
                        >
                            Actualizar
                        </button>
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => handleDelete(product.id)}
                            style={{ width: '100%' }}
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="container-fluid">
            <h1>Lista de Productos</h1>
            <div>
                {productos.map((product) => (
                    <div className="col-12 mb-4" key={product.id}>
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export const NewProducto = () => {
    // Estado para los datos del producto
    const [producto, setProducto] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        cantidad: '',
        medida: ''
    });

    // Instanciamos el hook de navegación para redirigir
    const navigate = useNavigate();

    // Función para manejar el cambio de los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProducto({
            ...producto,
            [name]: value
        });
    };

    // Función para manejar el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();

        // Aquí realizamos la solicitud POST para crear el producto
        axios.post(baseURL, producto, {
            headers: {
                'Accept': 'application/json',
            }
        })
            .then(response => {
                console.log('Producto agregado:', response.data);
                // Aquí puedes redirigir o mostrar un mensaje de éxito
                navigate('/productos');  // Redirige a la página de productos después de agregar
            })
            .catch(error => {
                console.error('Hubo un error al agregar el producto:', error);
            });
    };

    // Función para manejar el botón de cancelar
    const handleCancel = () => {
        // Redirige a la página de productos sin hacer cambios
        navigate('/productos');
    };

    return (
        <div className="container">
            <h2>Agregar Nuevo Producto</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre</label>
                    <input
                        type="text"
                        className="form-control"
                        id="nombre"
                        name="nombre"
                        value={producto.nombre}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="medida" className="form-label">Medida</label>
                    <input
                        type="text"
                        className="form-control"
                        id="medida"
                        name="medida"
                        value={producto.medida}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="cantidad" className="form-label">Cantidad</label>
                    <input
                        type="number"
                        className="form-control"
                        id="cantidad"
                        name="cantidad"
                        value={producto.cantidad}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="precio" className="form-label">Precio</label>
                    <input
                        type="number"
                        className="form-control"
                        id="precio"
                        name="precio"
                        value={producto.precio}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Agregar Producto</button>
                <button
                    type="button"
                    className="btn btn-secondary ms-2"
                    onClick={handleCancel}
                >
                    Cancelar
                </button>
            </form>
        </div>
    );
};


export const ProductoActualizar = () => {
    const { id } = useParams(); // Obtenemos el id de la URL
    const [producto, setProducto] = useState(null); // Almacenamos el producto
    const navigate = useNavigate();

    // Maneja los cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProducto({
            ...producto,
            [name]: value,
        });
    };

    // Maneja el envío del formulario para actualizar el producto
    const handleSubmit = (e) => {
        e.preventDefault();

        // Realizamos la solicitud PATCH para actualizar el producto
        axios.patch(`${baseURL}/${id}`, producto, {
            headers: {
                'Accept': 'application/json',
            },
        })
            .then(response => {
                console.log('Producto actualizado:', response.data);
                navigate('/productos');  // Redirige a la página de productos después de actualizar
            })
            .catch(error => {
                console.error('Hubo un error al actualizar el producto:', error);
            });
    };

    // Maneja la cancelación y redirige a la lista de productos
    const handleCancel = () => {
        navigate('/productos'); // Redirige a la página de productos sin realizar cambios
    };

    useEffect(() => {
        if (id) { // Aseguramos que el id esté presente
            axios.get(`${baseURL}/${id}`, {  // Solicitamos el producto con el id
                headers: {
                    'Accept': 'application/json',
                },
            })
                .then((response) => {
                    setProducto(response.data); // Guardamos los datos del producto
                })
                .catch((error) => {
                    console.error("Error al obtener el producto:", error);
                    // Maneja el error aquí (opcional)
                });
        }
    }, [id]); // Dependencia de id

    // Si el producto no se ha cargado aún
    if (!producto) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    // Formulario de actualización del producto
    return (
        <div className="container">
            <h1>Actualizar Producto</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre</label>
                    <input
                        type="text"
                        className="form-control"
                        id="nombre"
                        name="nombre"
                        value={producto.nombre}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="medida" className="form-label">Medida</label>
                    <input
                        type="text"
                        className="form-control"
                        id="medida"
                        name="medida"
                        value={producto.medida}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="cantidad" className="form-label">Cantidad</label>
                    <input
                        type="number"
                        className="form-control"
                        id="cantidad"
                        name="cantidad"
                        value={producto.cantidad}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="precio" className="form-label">Precio</label>
                    <input
                        type="number"
                        className="form-control"
                        id="precio"
                        name="precio"
                        value={producto.precio}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Actualizar Producto</button>
                <button
                    type="button"
                    className="btn btn-secondary ms-2"
                    onClick={handleCancel}
                >
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export const ProductoEliminar = () => {
    const { id } = useParams(); // Obtenemos el id de la URL
    const [producto, setProducto] = useState(null); // Almacenamos el producto
    const navigate = useNavigate();

    // Efecto para obtener los datos del producto por ID
    useEffect(() => {
        if (id) {
            axios
                .get(`${baseURL}/${id}`, { // Solicita el producto con el id
                    headers: {
                        'Accept': 'application/json',
                    },
                })
                .then((response) => {
                    setProducto(response.data); // Guardamos los datos del producto
                })
                .catch((error) => {
                    console.error('Error al obtener el producto:', error);
                });
        }
    }, [id]);

    // Función para confirmar la eliminación
    const confirmDelete = () => {
        if (id) {
            axios
                .delete(`${baseURL}/${id}`) // Realiza la eliminación del producto
                .then((response) => {
                    console.log('Producto eliminado:', response.data);
                    navigate('/productos'); // Redirige al listado de productos después de eliminar
                })
                .catch((error) => {
                    console.error('Error al eliminar el producto:', error);
                });
        }
    };

    // Si no se ha encontrado el producto
    if (!producto) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <div className="container">
            <h1>Eliminar Producto</h1>
            <div className="alert alert-warning">
                <h4>¿Estás seguro de que deseas eliminar este producto?</h4>
                <p><strong>Nombre:</strong> {producto.nombre}</p>
                <p><strong>Cantidad:</strong> {producto.cantidad} {producto.medida}</p>
                <p><strong>Precio:</strong> ${producto.precio}</p>
            </div>
            <div className="d-flex">
                <button onClick={confirmDelete} className="btn btn-danger me-2">
                    Eliminar
                </button>
                <button onClick={() => navigate('/productos')} className="btn btn-secondary">
                    Cancelar
                </button>
            </div>
        </div>
    );
};