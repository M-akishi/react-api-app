import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiService } from "./apiServices";
import { Spinner } from "react-bootstrap";
import platoimg from '../img/platos.svg'

export const Pedidos = () => {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true); // Estado de carga inicial
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().slice(0, 10)
    );
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true); // Comienza la carga al cambiar la fecha
        apiService
            .getAll("pedidos", { fecha: selectedDate }) // Pasar la fecha como parámetro
            .then((response) => {
                setPedidos(response.data);
                setError(null);
            })
            .catch((error) => {
                if (error.code === "ERR_NETWORK") {
                    setError("API está fuera de servicio. Por favor, intenta más tarde.");
                } else {
                    setError("Error al cargar los datos.");
                    console.error(error);
                }
            })
            .finally(() => {
                setLoading(false); // Termina la carga
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
        navigate(`/pedidos/actualizar/${id}`);
    };

    const handleDelete = (id) => {
        navigate(`/pedidos/eliminar/${id}`);
    };

    const PedidoCard = ({ pedido }) => (
        <div className="card mb-3" style={{ height: "auto" }}>
            <div className="row g-0">
                <div className="col-12 col-md-1 d-flex ">
                    <img
                        src={platoimg}
                        className="img-fluid rounded-start"
                        alt={pedido.id}
                        loading="lazy"
                        style={{
                            objectFit: "contain",
                            maxHeight: "10rem",
                            width: "100%",
                            borderTopLeftRadius: "0.25rem",
                            borderBottomLeftRadius: "0.25rem",
                        }}
                    />
                </div>
                <div className="col-12 col-md-8">
                    <div className="card-body">
                        <h5 className="card-title">{pedido.plato.nombre}</h5>
                        <p className="card-text">Cantidad: {pedido.cantidad}</p>
                        <p className="card-text">Precio unidad: ${pedido.plato.precio}</p>
                        <p className="card-text">Mesa: {pedido.mesa.id}</p>
                        <p className="card-text">
                            Estado:{" "}
                            <span
                                className={`btn ${pedido.estado === 1 ? "btn-success" : "btn-danger"
                                    }`}
                            >
                                {pedido.estado === 1 ? "Activo" : "Inactivo"}
                            </span>
                        </p>
                        <p className="card-text">
                            <small className="text-body-secondary">
                                Última actualización: {new Date(pedido.updated_at).toLocaleString()}
                            </small>
                        </p>
                    </div>
                </div>
                <div className="col-12 ms-auto col-md-2 p-2 d-flex flex-column align-items-center justify-content-center">
                    <button
                        type="button"
                        className="btn btn-warning m-2"
                        onClick={() => handleUpdate(pedido.id)}
                        style={{ width: "100%" }}
                    >
                        Actualizar
                    </button>
                    <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => handleDelete(pedido.id)}
                        style={{ width: "100%" }}
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="container-fluid">
            <h1>Lista de Pedidos</h1>
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
                ) : pedidos.length === 0 ? (
                    <p className="text-center mt-4">No hay pedidos para la fecha seleccionada.</p>
                ) : (
                    pedidos.map((pedido) => (
                        <div className="col-12 mb-4" key={pedido.id}>
                            <PedidoCard pedido={pedido} />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export const NewPedido = () => {
    const [pedido, setPedido] = useState({
        plato: '',
        cantidad: '',
        mesa: ''
    })

    const navigate = useNavigate()

    const [platos, setPlatos] = useState([])

    useEffect(() => {
        apiService
            .getAll("platos")
            .then((response) => {
                setPlatos(response.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPedido({
            ...pedido,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        apiService
            .create("pedidos", pedido)
            .then(response => {
                console.log(response)
                navigate('/pedidos')
            })
            .catch((error) => {
                console.log(error)
            })
    };

    const handleCancel = () => {
        // Redirige a la página de productos sin hacer cambios
        navigate('/pedidos');
    };

    return (
        <div className="container">
            <h2>Agregar Nuevo Pedido</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="plato" className="form-label">Plato</label>
                    <select
                        className="form-control"
                        id="plato"
                        name="plato"
                        value={pedido.plato}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecciona un plato</option>
                        {platos.map((plato) => (
                            <option key={plato.id} value={plato.id}>
                                {plato.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="cantidad" className="form-label">Cantidad</label>
                    <input
                        type="text"
                        className="form-control"
                        id="cantidad"
                        name="cantidad"
                        value={pedido.cantidad}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="mesa" className="form-label">Mesa</label>
                    <select
                        className="form-control"
                        id="mesa"
                        name="mesa"
                        value={pedido.mesa}
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
                <button type="submit" className="btn btn-primary">Agregar Pedido</button>
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

export const ActualizarPedido = () => {
    const { id } = useParams()
    const [pedido, setPedido] = useState({
        plato: '',
        cantidad: '',
        mesa: '',
        estado: true
    })
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPedido({
            ...pedido,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const pedidoData = {
            ...pedido,
            estado: pedido.estado === "true" ? true : pedido.estado === "false" ? 0 : pedido.estado
        };

        apiService
            .update("pedidos", id, pedidoData)
            .then(response => {
                console.log(response)
                navigate('/pedidos')
            })
            .catch((error) => {
                console.log(error)
            })

    };

    const handleCancel = () => {
        navigate('/pedidos'); // Redirige a la página de productos sin realizar cambios
    };


    useEffect(() => {
        if (id) { // Aseguramos que el id esté presente
            apiService
                .getOne("pedidos", id)
                .then(response => {
                    const data = response.data;

                    setPedido({
                        plato: data.plato.id,
                        cantidad: data.cantidad,
                        mesa: data.mesa.id,
                        estado: data.estado
                    });
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [id]);

    const [platos, setPlatos] = useState([])

    useEffect(() => {
        apiService
            .getAll("platos")
            .then((response) => {
                setPlatos(response.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])

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
    
    return (
        <div className="container">
            <h2>Agregar Nuevo Pedido</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="plato" className="form-label">Plato</label>
                    <select
                        className="form-control"
                        id="plato"
                        name="plato"
                        value={pedido.plato}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecciona un plato</option>
                        {platos.map((plato) => (
                            <option key={plato.id} value={plato.id}>
                                {plato.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="cantidad" className="form-label">Cantidad</label>
                    <input
                        type="text"
                        className="form-control"
                        id="cantidad"
                        name="cantidad"
                        value={pedido.cantidad}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="mesa" className="form-label">Mesa</label>
                    <select
                        className="form-control"
                        id="mesa"
                        name="mesa"
                        value={pedido.mesa}
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
                                checked={pedido.estado === 1}
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
                                checked={pedido.estado === 0}
                                onChange={handleChange}
                            />
                            Inactivo
                        </label>
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">Actualizar Pedido</button>
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

export const EliminarPedido = () => {

    const { id } = useParams();
    const [pedido, setPedido] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (id) {
            apiService
                .getOne("pedidos", id)
                .then(response => {
                    setPedido(response.data)
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }, [id]);

    const confirmDelete = () => {
        if (id) {
            apiService
                .delete("pedidos", id)
                .then(response => {
                    console.log(response.data)
                    navigate('/pedidos')
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    };

    if (!pedido) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <div className="container">
            <h1>Eliminar Pedido</h1>
            <div className="alert alert-warning">
                <h4>¿Estás seguro de que deseas eliminar este pedido?</h4>
                <p><strong>plato:</strong> {pedido.plato.nombre}</p>
                <p><strong>Cantidad:</strong> {pedido.cantidad}</p>
                <p><strong>Mesa:</strong> {pedido.mesa.id}</p>
            </div>
            <div className="d-flex">
                <button onClick={confirmDelete} className="btn btn-danger me-2">
                    Eliminar
                </button>
                <button onClick={() => navigate('/pedidos')} className="btn btn-secondary">
                    Cancelar
                </button>
            </div>
        </div>
    )
}