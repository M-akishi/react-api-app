import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { apiService } from "./apiServices"
import boletaImg from '../img/boleta.svg'
import { Spinner } from "react-bootstrap"
import jsPDF from "jspdf"

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

        const [platos, setPlatos] = useState([]);

        useEffect(() => {
            apiService.getAll("platos")
                .then(response => {
                    setPlatos(response.data);
                })
                .catch((error) => {
                    console.error(error);
                });
        }, []);

        const getPlatoById = (platoId) => {
            // Buscar el plato por el ID en el array de platos cargados
            return platos.find(plato => plato.id === platoId);
        };

        const handleDownloadPDF = () => {
            const doc = new jsPDF();

            // Añadir título
            doc.setFontSize(20);
            doc.text("Boleta", 20, 20);

            // Detalles de la boleta
            doc.setFontSize(12);
            doc.text(`ID: ${boleta.id}`, 20, 30);
            doc.text(`Mesa: ${boleta.mesa ? `Mesa ${boleta.mesa.id}, Capacidad: ${boleta.mesa.capacidad}` : 'No asignada'}`, 20, 40);
            doc.text(`Última actualización: ${new Date(boleta.updated_at).toLocaleString()}`, 20, 50);

            // Detalles de los pedidos
            let yOffset = 60;
            if (boleta.pedidos.length > 0) {
                boleta.pedidos.forEach((pedido, index) => {
                    const plato = getPlatoById(pedido.plato);
                    if (plato) {
                        doc.text(`${plato.nombre} - ${pedido.cantidad} unidad(es) - $${plato.precio}`, 20, yOffset);
                        yOffset += 10;
                    }
                });
            } else {
                doc.text("No hay pedidos asociados.", 20, yOffset);
                yOffset += 10;
            }

            // Total de la boleta
            doc.text(`Total: $${boleta.total}`, 20, yOffset);

            // Descargar el PDF
            doc.save(`boleta_${boleta.id}.pdf`);
        };

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
                                        {boleta.pedidos.map((pedido) => {
                                            const plato = getPlatoById(pedido.plato);
                                            return (
                                                <li key={pedido.id}>
                                                    {plato ? `${plato.nombre} - ${pedido.cantidad} unidad(es) - $${plato.precio}` : 'Buscando...'}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                ) : (
                                    <p>No hay pedidos asociados.</p>
                                )}
                            </div>
                            <h5 className="card-text">Total: ${boleta.total}</h5>
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
                        <button
                            type="button"
                            className="btn btn-success m-2"
                            onClick={handleDownloadPDF}
                            style={{ width: '100%' }}
                        >
                            Descargar PDF
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

        // Calcular el total de la boleta
        const total = pedidos.reduce((sum, pedido) => sum + (pedido.plato.precio * pedido.cantidad), 0);

        // Crear la boleta con el total
        const updatedBoleta = {
            ...boleta,
            total,
        };

        // Crear la boleta en el backend
        apiService
            .create("boletas", updatedBoleta)
            .then(response => {
                // Asignar el ID de la boleta creada
                const boletaId = response.data.Boleta.id;
                console.log("Boleta creada con ID:", response.data.Boleta.id);

                // Crear una promesa por cada pedido que debe ser actualizado con el boletaId
                const pedidosPromises = pedidos.map((pedido) => {
                    // Solo actualizar si el pedido no tiene boleta asignada y está en estado 0
                    if (pedido.boleta_id === null && pedido.estado === 0) {
                        console.log(`Actualizando pedido ${pedido.id} con boletaId: ${boletaId}`);
                        return apiService.update('pedidos', pedido.id, { boleta_id: boletaId });
                    }
                    // Si el pedido no cumple las condiciones, no hacer nada
                    return Promise.resolve();
                });

                // Ejecutar todas las promesas y luego navegar a la lista de boletas
                Promise.all(pedidosPromises)
                    .then(() => {
                        console.log("Todos los pedidos fueron actualizados correctamente.");
                        navigate('/boletas'); // Redirige a la página de boletas
                    })
                    .catch((error) => {
                        console.error("Error al actualizar algunos pedidos:", error);
                    });
            })
            .catch((error) => {
                console.error("Error al crear la boleta:", error);
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
                            <li className="list-group-item" key={pedido.id}>
                                {pedido.plato.nombre} - ${pedido.plato.precio} - {pedido.cantidad} unidad(es)
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export const ElminarBoleta = () => {
    const { id } = useParams();
    const [boleta, setBoleta] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (id) {
            apiService
                .getOne("boletas", id)
                .then(response => {
                    setBoleta(response.data)
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }, [id]);

    const confirmDelete = () => {
        if (id) {
            apiService
                .delete("boletas", id)
                .then(response => {
                    console.log(response.data)
                    navigate("/boletas")
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    };

    if (!boleta) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <div className="container">
            <h1>Eliminar Boleta</h1>
            <div className="alert alert-warning">
                <h4>¿Estás seguro de que deseas eliminar esta Boleta?</h4>
                <p><strong>boleta:</strong> {boleta.id}</p>
                <p><strong>Mesa:</strong> {boleta.mesa}</p>
                <p><strong>Cantidad:</strong> ${boleta.total}</p>
            </div>
            <div className="d-flex">
                <button onClick={confirmDelete} className="btn btn-danger me-2">
                    Eliminar
                </button>
                <button onClick={() => navigate("/boletas")} className="btn btn-secondary">
                    Cancelar
                </button>
            </div>
        </div>
    )
}