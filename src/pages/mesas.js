import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiService } from "./apiServices";
import { Spinner } from "react-bootstrap";
import mesaImg from '../img/mesas.svg'

export const Mesas = () => {
    const [mesas, setMesas] = useState([])
    const navigate = useNavigate()
    const [error, setError] = useState(null)

    useEffect(() => {

        apiService
            .getAll('mesas')
            .then(response => {
                setMesas(response.data)
                setError(null)
            })
            .catch((error) => {
                if (error.code === "ERR_NETWORK") {
                    setError("API está fuera de servicio. Por favor, intenta más tarde.");
                } else {
                    setError("Error al cargar los datos.");
                    console.error(error);
                }
            });
    }, [])

    if (error) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <p className="text-danger">{error}</p>
            </div>
        );
    }

    if (mesas.length === 0) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    const handleUpdate = (id) => {
        navigate(`/mesas/actualizar/${id}`)
    };

    const handleDelete = (id) => {
        navigate(`/mesas/eliminar/${id}`)
    };

    const handlePedidos = (id) => {
        navigate(`/pedidos/${id}`)
    };

    const MesaCard = ({ mesa }) => {
        return (
            <div className="card mb-3" style={{ height: 'auto' }}>
                <div className="row g-0">
                    <div className="col-12 col-md-1 d-flex ">
                        <img
                            src={mesaImg}
                            className="img-fluid rounded-start"
                            alt={mesa.id}
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
                            <h5 className="card-title">ID: {mesa.id}</h5>
                            <p className="card-text">Capacidad: {mesa.capacidad}</p>
                            <p className="card-text">Trabajador: {mesa.trabajador_asignado}</p>
                            <p className="card-text">
                                Estado:{" "}
                                <span
                                    className={`btn ${mesa.estado === 1 ? "btn-success" : "btn-danger"
                                        }`}
                                >
                                    {mesa.estado === 1 ? "Activo" : "Inactivo"}
                                </span>
                            </p>
                            <p className="card-text">
                                <small className="text-body-secondary">
                                    Última actualización: {new Date(mesa.updated_at).toLocaleString()}
                                </small>
                            </p>
                        </div>
                    </div>
                    <div className="col-12 ms-auto col-md-2 p-2 d-flex flex-column align-items-center justify-content-center">
                        <button
                            type="button"
                            className="btn btn-warning"
                            onClick={() => handleUpdate(mesa.id)}
                            style={{ width: '100%' }}
                        >
                            Actualizar
                        </button>
                        <button
                            type="button"
                            className="btn btn-danger m-2"
                            onClick={() => handleDelete(mesa.id)}
                            style={{ width: '100%' }}
                        >
                            Eliminar
                        </button>
                        <button
                            type="button"
                            className="btn btn-success"
                            onClick={() => handlePedidos(mesa.id)}
                            style={{ width: '100%' }}
                        >
                            Pedidos
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="container-fluid">
            <h1>Lista de Mesas</h1>
            <div>
                {mesas.map((mesa) => (
                    <div className="col-12 mb-4" key={mesa.id}>
                        <MesaCard mesa={mesa} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export const NewMesa = () => {
    const navigate = useNavigate()
    const [mesa, setMesa] = useState({
        capacidad: '',
        trabajador_asignado: null,
        estado: true
    })

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setMesa({
            ...mesa,
            [name]: type === 'checkbox' ? checked : value, // Utilizamos checked para los booleanos
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const mesaData = {
            ...mesa,
            estado: mesa.estado === "true" ? true : mesa.estado === "false" ? 0 : mesa.estado
        };

        apiService
        .create('mesas', mesaData)
        .then(response => {
            console.log(response)
            navigate('/mesas')
        })
        .catch(error => {
            console.log(error)
        })  
    };

    const handleCancel = () => {
        navigate('/mesas');
    };

    return (
        <div className="container mt-2">
            <h2>Registrar Mesa</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="capacidad" className="form-label">
                        Capacidad
                    </label>
                    <input
                        type="number"
                        className="form-control"
                        id="capacidad"
                        name="capacidad"
                        value={mesa.capacidad}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="trabajador_asignado" className="form-label">
                        Trabajador Asignado
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="trabajador_asignado"
                        name="trabajador_asignado"
                        value={mesa.trabajador_asignado || ''}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="estado" className="form-label">
                        Estado
                    </label>
                    <div>
                        <label className="form-check-label me-3">
                            <input
                                type="radio"
                                className="form-check-input"
                                id="estado_activo"
                                name="estado"
                                value={true}
                                checked={mesa.estado === 1}
                                onChange={handleChange}
                            />
                            Activo
                        </label>
                        <label className="form-check-label">
                            <input
                                type="radio"
                                className="form-check-input"
                                id="estado_inactivo"
                                name="estado"
                                value={false}
                                checked={mesa.estado === 0}
                                onChange={handleChange}
                            />
                            Inactivo
                        </label>
                    </div>
                </div>

                <button type="submit" className="btn btn-primary">
                    Registrar Mesa
                </button>
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

export const MesaActualizar = () => {
    const { id } = useParams();
    const navigate = useNavigate()
    const [mesa, setMesa] = useState({
        capacidad: '',
        trabajador_asignado: null,
        estado: true
    })

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setMesa({
            ...mesa,
            [name]: type === 'checkbox' ? checked : value, // Utilizamos checked para los booleanos
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const mesaData = {
            ...mesa,
            estado: mesa.estado === "true" ? true : mesa.estado === "false" ? 0 : mesa.estado
        };

        apiService
        .update('mesas', id, mesaData)
        .then(response => {
            console.log(response)
            navigate('/mesas')
        })
        .catch(error => {
            console.log(error)
        })  
    };

    const handleCancel = () => {
        navigate('/mesas');
    };

    useEffect(() => {
        apiService
        .getOne("mesas", id)
        .then(response => {
            setMesa({
                capacidad: response.data.capacidad,
                trabajador_asignado: response.data.trabajador_asignado,
                estado: response.data.estado
            })
        })
        .catch(error => {
            console.log(error)
        })
    },[id])

    return (
        <div className="container mt-2">
            <h2>Registrar Mesa</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="capacidad" className="form-label">
                        Capacidad
                    </label>
                    <input
                        type="number"
                        className="form-control"
                        id="capacidad"
                        name="capacidad"
                        value={mesa.capacidad}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="trabajador_asignado" className="form-label">
                        Trabajador Asignado
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="trabajador_asignado"
                        name="trabajador_asignado"
                        value={mesa.trabajador_asignado || ''}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="estado" className="form-label">
                        Estado
                    </label>
                    <div>
                        <label className="form-check-label me-3">
                            <input
                                type="radio"
                                className="form-check-input"
                                id="estado_activo"
                                name="estado"
                                value={true}
                                checked={mesa.estado === 1}
                                onChange={handleChange}
                            />
                            Activo
                        </label>
                        <label className="form-check-label">
                            <input
                                type="radio"
                                className="form-check-input"
                                id="estado_inactivo"
                                name="estado"
                                value={false}
                                checked={mesa.estado === 0}
                                onChange={handleChange}
                            />
                            Inactivo
                        </label>
                    </div>
                </div>

                <button type="submit" className="btn btn-primary">
                    Actualizar mesa
                </button>
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

export const MesaEliminar = () => {
    const { id } = useParams()
    const [mesa, setMesa] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (id) {
            apiService
            .getOne('mesas', id)
            .then(response => {
                setMesa(response.data)
            })
            .catch(error => {
                console.log(error)
            })
        }
    },[id])

    const confirmDelete = () => {
        if (id) {            
            apiService
            .delete("mesas",id)
            .then(response => {
                console.log(response.data)
                navigate('/mesas')
            })
            .catch((error) => {
                console.log(error)
            })
        }
    };

    if (!mesa) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <div className="container">
            <h1>Eliminar Mesa</h1>
            <div className="alert alert-warning">
                <h4>¿Estás seguro de que deseas eliminar esta Mesa?</h4>
                <p><strong>ID:</strong> {mesa.id}</p>
                <p><strong>Capacidad:</strong> {mesa.capacidad}</p>
                <p><strong>Estado:</strong> {mesa.estado === 1 ? "Activo" : "Inactivo"}</p>
            </div>
            <div className="d-flex">
                <button onClick={confirmDelete} className="btn btn-danger me-2">
                    Eliminar
                </button>
                <button onClick={() => navigate('/mesas')} className="btn btn-secondary">
                    Cancelar
                </button>
            </div>
        </div>
    );
}
