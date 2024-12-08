import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { apiService } from "./apiServices"
import boletaImg from '../img/boleta.svg'
import { Spinner } from "react-bootstrap"

export const Boletas = () => {
    const [boletas, setBoletas] = useState()
    const [loading, setLoading] = useState([])
    const [error, setError] = useState(null)
    const navigate = useNavigate()
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().slice(0, 10)
    );


    useEffect(() => {
        setLoading(true);
        apiService
            .getAll('boletas', { fecha: selectedDate })  // Pasas el filtro de fecha aquí
            .then(response => {
                setBoletas(response.data);
                setError(null);
            })
            .catch(error => {
                if (error.code === "ERR_NETWORK") {
                    setError("API está fuera de servicio. Por favor, intenta más tarde.");
                } else {
                    setError("Error al cargar los datos.");
                    console.error(error);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, [selectedDate]);

    if (error) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <p className="text-danger">{error}</p>
            </div>
        );
    }

    const handleUpdate = (id) => {
        navigate(`/boletas/actualizar/${id}`);
    };

    const handleDelete = (id) => {
        navigate(`/boletas/eliminar/${id}`);
    };

    const BoletaCard = ({ boleta }) => {
        return (
            <div className="card mb-3" style={{ height: 'auto' }}>
                <div className="row g-0">
                    <div className="col-12 col-md-1 d-flex ">
                        <img
                            src={boletaImg}
                            className="img-fluid rounded-start"
                            alt={boleta.id}
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
                            <h5 className="card-title">ID: {boleta.id}</h5>
                            <p className="card-text">Mesa: {boleta.mesa ? `Mesa ${boleta.mesa.id}, Capacidad: ${boleta.mesa.capacidad}` : 'No asignada'}</p>
                            <p className="card-text">
                                <small className="text-body-secondary">
                                    Última actualización: {new Date(boleta.updated_at).toLocaleString()}
                                </small>
                            </p>
                            <div>
                                {boleta.pedidos.length > 0 ? (
                                    <ul>
                                        {boleta.pedidos.map((pedido) => (
                                            <li key={pedido.plato.nombre}>{pedido.plato} - {pedido.cantidad} unidad(es)</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No hay pedidos asociados.</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="col-12 ms-auto col-md-2 p-2 d-flex flex-column align-items-center justify-content-center">
                        <button
                            type="button"
                            className="btn btn-warning m-2"
                            onClick={() => handleUpdate(boleta.id)}
                            style={{ width: '100%' }}
                        >
                            Actualizar
                        </button>
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => handleDelete(boleta.id)}
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
            <h1>Lista de Boletas</h1>
            <div>
                <input
                    type="date"
                    className="form-control mb-4"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    style={{ maxWidth: "200px" }}
                />
                {loading ? (
                    <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ height: "50vh" }}
                    >
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : boletas.length === 0 ? (
                    <p className="text-center mt-4">No hay boletas para la fecha seleccionada.</p>
                ) : (
                    boletas.map((boleta) => (
                        <div className="col-12 mb-4" key={boleta.id}>
                            <BoletaCard boleta={boleta} />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export const NewBoleta = () => {
    const [boleta, setBoleta] = useState({
        mesa: '',
        total: ''
    })

    const navigate = useNavigate()

    const [mesas, setMesas] = useState([])

    useEffect(() => {
        apiService
            .getAll("mesas")
            .then((response) => {
                setMesas(response.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])

    const [pedidos, setPedidos] = useState([])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBoleta({
            ...boleta,
            [name]: value
        });

        if (name === "mesa" && value) {
            apiService
                .getAll(`pedidos`, { mesa_id: value, boleta: null, estado: 0 })
                .then((response) => {
                    setPedidos(response.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            setPedidos([]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        if (pedidos.length === 0) {
            alert("No puedes crear una boleta sin pedidos relacionados.");
            return;
        }
    
        const total = pedidos.reduce((sum, pedido) => sum + (pedido.plato.precio * pedido.cantidad), 0);
    
        const updatedBoleta = {
            ...boleta,
            total,
        };
    
 
        apiService
            .create("boletas", updatedBoleta)
            .then(response => {
                const boletaId = response.data.id;
    
       
                const pedidosPromises = pedidos.map(pedido => {
                    if (pedido.boleta_id === null && pedido.estado === 0) {
                        return apiService.update('pedidos', pedido.id, { boleta_id: boletaId });
                    }
                    return Promise.resolve();
                });
    

                Promise.all(pedidosPromises)
                    .then(() => {
                        navigate('/boletas'); 
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleCancel = () => {
        // Redirige a la página de productos sin hacer cambios
        navigate('/boletas');
    };

    return (
        <div className="container">
            <h2>Agregar Nueva Boleta</h2>
            <form onSubmit={handleSubmit}>


                <div className="mb-3">
                    <label htmlFor="mesa" className="form-label">Mesa</label>
                    <select
                        className="form-control"
                        id="mesa"
                        name="mesa"
                        value={boleta.mesa}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecciona una mesa</option>
                        {mesas.map((mesa) => (
                            <option key={mesa.id} value={mesa.id}>
                                mesa N: {mesa.id}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Cerrar boleta</button>
                <button
                    type="button"
                    className="btn btn-secondary ms-2"
                    onClick={handleCancel}
                >
                    Cancelar
                </button>
            </form>

            {pedidos.length > 0 && (
                <div className="mt-4">
                    <h3>Pedidos de la Mesa</h3>
                    <ul className="list-group">
                        {pedidos.map((pedido) => (
                            <li className="list-group-item" key={pedido.plato.id}>
                                {pedido.plato.nombre} - ${pedido.plato.precio} - {pedido.cantidad} unidad(es)
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}