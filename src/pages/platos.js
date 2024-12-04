import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { Spinner } from "react-bootstrap";
import { apiService } from "./apiServices";
import platoImg from '../img/platos.svg';

export const Platos = () => {
    const [platos, setPlatos] = useState([]);
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    useEffect(() => {
        apiService
            .getAll("platos")
            .then((response) => {
                setPlatos(response.data)
                setError(null)
            })
            .catch((error) => {
                if (error.code === "ERR_NETWORK") {
                    setError("API está fuera de servicio. Por favor, intenta más tarde.");
                } else {
                    setError("Error al cargar los datos.");
                    console.error(error);
                }
            })
    }, [])

    if (error) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <p className="text-danger">{error}</p>
            </div>
        );
    }

    // Si no hay productos, mostramos el spinner de carga
    if (platos.length === 0) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }
    const handleUpdate = (id) => {
        navigate(`/platos/actualizar/${id}`)
    };

    const handleDelete = (id) => {
        navigate(`/platos/eliminar/${id}`)
    };

    const handleIngredientes = (id) => {
        navigate(`/platos/ingredientes/${id}`)
    };

    const PlatoCard = ({ plato }) => {
        return (
            <div className="card mb-3" style={{ height: 'auto' }}>
                <div className="row g-0">
                    <div className="col-12 col-md-1 d-flex ">
                        <img
                            src={platoImg}
                            className="img-fluid rounded-start"
                            alt={plato.nombre}
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
                            <h5 className="card-title">{plato.nombre}</h5>
                            <p className="card-text">Tipo: {plato.tipo}</p>
                            <p className="card-text">Cantidad disponibles: {plato.cantidad_disponibles}</p>
                            <p className="card-text">
                                <small className="text-body-secondary">
                                    Fecha De uso: {plato.fecha}
                                </small>
                            </p>

                            {/* Aquí se agregan los ingredientes */}
                            <div>
                                <h6>Ingredientes:</h6>
                                <ul>
                                    {plato.ingredientes.map((ingrediente) => (
                                        <li key={ingrediente.id}>
                                            {ingrediente.nombre} ({ingrediente.cantidad} {ingrediente.medida})
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 ms-auto col-md-2 p-2 d-flex flex-column align-items-center justify-content-center">
                        <button
                            type="button"
                            className="btn btn-warning m-2"
                            onClick={() => handleUpdate(plato.id)}
                            style={{ width: '100%' }}
                        >
                            Actualizar
                        </button>
                        <button
                            type="button"
                            className="btn btn-success m-2"
                            onClick={() => handleIngredientes(plato.id)}
                            style={{ width: '100%' }}
                        >
                            Agregar ingredientes
                        </button>
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => handleDelete(plato.id)}
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
            <h1>Lista de Platos</h1>
            <div>
                {platos.map((plato) => (
                    <div className="col-12 mb-4" key={plato.id}>
                        <PlatoCard plato={plato} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export const NewPlato = () => {
    const navigate = useNavigate()
    //formulario platos
    const [plato, setPlato] = useState({
        nombre: '',
        tipo: '',
        fecha: '',
        cantidad_disponibles: '',
    })
    const [tipoPlatos, setTipoPlatos] = useState([])

    //select tipos
    useEffect(() => {
        apiService
            .getAll("tipoPlatos")
            .then((response) => {
                setTipoPlatos(response.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        apiService
            .create("platos", plato)
            .then(response => {
                console.log(response)
                navigate('/platos')
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPlato({
            ...plato,
            [name]: value
        });
    };

    const handleCancel = () => {
        navigate('/platos');
    };

    return (
        <div className="container">
            <h2>Agregar Nuevo Plato</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre</label>
                    <input
                        type="text"
                        className="form-control"
                        id="nombre"
                        name="nombre"
                        value={plato.nombre}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="tipo" className="form-label">Tipo</label>
                    <select
                        className="form-control"
                        id="tipo"
                        name="tipo"
                        value={plato.tipo}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecciona un tipo</option>
                        {tipoPlatos.map((tipo) => (
                            <option key={tipo.id} value={tipo.id}>
                                {tipo.tipo} {/* Asume que 'tipo' es el campo de nombre o descripción */}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="fecha" className="form-label">Fecha de uso</label>
                    <input
                        type="date"
                        className="form-control"
                        id="fecha"
                        name="fecha"
                        value={plato.fecha}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="cantidad_disponibles" className="form-label">Cantidad</label>
                    <input
                        type="number"
                        className="form-control"
                        id="cantidad_disponibles"
                        name="cantidad_disponibles"
                        value={plato.cantidad_disponibles}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Agregar Plato</button>
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
}

export const PlatoActualizar = () => {
    const { id } = useParams()
    const [plato, setPlato] = useState({
        nombre: '',
        tipo: '',
        fecha: '',
        cantidad_disponibles: '',
    })
    const navigate = useNavigate()
    const [tipoPlatos, setTipoPlatos] = useState([])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPlato({
            ...plato,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        apiService
            .update("platos", id, plato)
            .then(response => {
                console.log(response)
                navigate('/platos')
            })
            .catch((error) => {
                console.log(error)
            })

    };

    const handleCancel = () => {
        navigate('/platos'); // Redirige a la página de productos sin realizar cambios
    };

    useEffect(() => {
        if (id) { // Aseguramos que el id esté presente
            apiService
                .getOne("platos", id)
                .then(response => {
                    const data = response.data;

                    setPlato({
                        nombre: data.nombre,
                        tipo: data.tipo,
                        fecha: data.fecha,
                        cantidad_disponibles: data.cantidad_disponibles
                    });
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [id]);



    //select tipos
    useEffect(() => {
        apiService
            .getAll("tipoPlatos")
            .then((response) => {
                setTipoPlatos(response.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])

    if (!plato) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <div className="container">
            <h2>Actualizar Plato</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre</label>
                    <input
                        type="text"
                        className="form-control"
                        id="nombre"
                        name="nombre"
                        value={plato.nombre}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="tipo" className="form-label">Tipo</label>
                    <select
                        className="form-control"
                        id="tipo"
                        name="tipo"
                        value={plato.tipo}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecciona un tipo</option>
                        {tipoPlatos.map((tipo) => (
                            <option key={tipo.id} value={tipo.id}>
                                {tipo.tipo} {/* Asume que 'tipo' es el campo de nombre o descripción */}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="fecha" className="form-label">Fecha de uso</label>
                    <input
                        type="date"
                        className="form-control"
                        id="fecha"
                        name="fecha"
                        value={plato.fecha}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="cantidad_disponibles" className="form-label">Cantidad</label>
                    <input
                        type="number"
                        className="form-control"
                        id="cantidad_disponibles"
                        name="cantidad_disponibles"
                        value={plato.cantidad_disponibles}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Actualizar Plato</button>
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
}

export const PlatoEliminar = () => {
    const { id } = useParams();
    const [plato, setPlato] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (id) {
            apiService
                .getOne("platos", id)
                .then(response => {
                    setPlato(response.data)
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }, [id]);

    const confirmDelete = () => {
        if (id) {
            apiService
                .delete("platos", id)
                .then(response => {
                    console.log(response.data)
                    navigate('/platos')
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    };

    if (!plato) {
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
                <p><strong>Nombre:</strong> {plato.nombre}</p>
                <p><strong>Fecha Uso:</strong> {plato.fecha}</p>
                <p><strong>Cantidad:</strong> {plato.cantidad_disponibles}</p>
            </div>
            <div className="d-flex">
                <button onClick={confirmDelete} className="btn btn-danger me-2">
                    Eliminar
                </button>
                <button onClick={() => navigate('/platos')} className="btn btn-secondary">
                    Cancelar
                </button>
            </div>
        </div>
    )
}

export const PlatoIngredientes = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [ingrediente, setIngrediente] = useState({
        producto_id: "",
        cantidad: "",
    });

    const [ingredientes, setIngredientes] = useState([]);
    const [productos, setProductos] = useState([]);

    // Cargar los ingredientes existentes del plato y la lista de productos
    useEffect(() => {
        // Cargar ingredientes del plato
        apiService
            .getOne("platos", id)
            .then((response) => {
                const ingredientes = response.data.ingredientes.map((ingrediente) => ({
                    producto_id: ingrediente.id,
                    nombre: ingrediente.nombre || "", // Suponiendo que viene el nombre del producto
                    cantidad: ingrediente.cantidad,
                }));
                setIngredientes(ingredientes);
            })
            .catch((error) => console.error("Error al cargar los ingredientes:", error));

        // Cargar lista de productos
        apiService
            .getAll("productos")
            .then((response) => {
                setProductos(response.data);
            })
            .catch((error) => console.error("Error al cargar los productos:", error));
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setIngrediente({
            ...ingrediente,
            [name]: value,
        });
    };

    const handleCancel = () => {
        navigate('/platos');
    };

    const handleAddIngrediente = (e) => {
        e.preventDefault();

        if (ingrediente.producto_id && ingrediente.cantidad) {
            const productoSeleccionado = productos.find(
                (prod) => prod.id === parseInt(ingrediente.producto_id)
            );

            setIngredientes([
                ...ingredientes,
                {
                    producto_id: ingrediente.producto_id,
                    nombre: productoSeleccionado ? productoSeleccionado.nombre : "Desconocido",
                    cantidad: ingrediente.cantidad,
                },
            ]);

            setIngrediente({ producto_id: "", cantidad: "" }); // Limpiar formulario
        } else {
            alert("Por favor, completa todos los campos antes de agregar el ingrediente.");
        }
    };

    const handleRemoveIngrediente = (index) => {
        const updatedIngredientes = ingredientes.filter((_, i) => i !== index);
        setIngredientes(updatedIngredientes);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = ingredientes.map((ing) => ({
            producto_id: ing.producto_id,
            cantidad: ing.cantidad,
        }));


        apiService
            .update("platos", id, { ingredientes: payload })
            .then(() => {
                navigate('/platos')
            })
            .catch((error) => {
                console.error("Error al guardar ingredientes:", error);
            });
    };

    return (
        <div className="container">
            <h2>Agregar Ingredientes</h2>
            <form onSubmit={handleAddIngrediente}>
                <div className="row mb-3">
                    <div className="col">
                        <select
                            className="form-control"
                            name="producto_id"
                            value={ingrediente.producto_id}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecciona un producto</option>
                            {productos.map((producto) => (
                                <option key={producto.id} value={producto.id}>
                                    {producto.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col">
                        <input
                            type="number"
                            className="form-control"
                            name="cantidad"
                            placeholder="Cantidad"
                            value={ingrediente.cantidad}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-auto">
                        <button className="btn btn-primary" type="submit">
                            Agregar
                        </button>
                    </div>
                </div>
            </form>

            <h3>Ingredientes Agregados</h3>
            {ingredientes.length > 0 ? (
                <table className="table">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ingredientes.map((ing, index) => (
                            <tr key={index}>
                                <td>{ing.nombre}</td>
                                <td>{ing.cantidad}</td>
                                <td>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleRemoveIngrediente(index)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No se han agregado ingredientes.</p>
            )}

            <button
                className="btn btn-success mt-3"
                onClick={handleSubmit}
                disabled={ingredientes.length === 0}
            >
                Guardar Ingredientes
            </button>
            <button
                type="button"
                className="btn btn-secondary mt-3 ms-2"
                onClick={handleCancel}
            >
                Cancelar
            </button>
        </div>
    );
};