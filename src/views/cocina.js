import React, { useState, useEffect } from "react";
import { apiService } from "../pages/apiServices";
import { Spinner } from "react-bootstrap";
import platoImg from "../img/platos.svg"

export const Cocina = () => {

    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true); // Estado de carga inicial
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState("");

    useEffect(() => {
        const storedDate = sessionStorage.getItem("selectedDate");
        if (storedDate) {
          setSelectedDate(storedDate);
        } else {
          const today = new Date().toISOString().slice(0, 10);
          setSelectedDate(today);
          sessionStorage.setItem("selectedDate", today);
        }
      }, []);

    useEffect(() => {
        if (!selectedDate) return

        setLoading(true);

        const params = { fecha: selectedDate, estado: 1 };

        apiService
            .getAll("pedidos", params)
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

    const handleDateSelection = (selectedDate) => {
        sessionStorage.setItem("selectedDate", selectedDate);
        setSelectedDate(selectedDate)
    };

    if (error) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <p className="text-danger">{error}</p>
            </div>
        );
    }

    const handleComplete = (id) => {
        const updatedData = { estado: 0 };
        apiService
            .update("pedidos", id, updatedData)
            .then((response) => {
                console.log("Pedido actualizado correctamente:", response.data);
                window.location.reload();
            })
            .catch((error) => {
                console.error("Error al actualizar el pedido:", error);
                // Aquí puedes mostrar un mensaje de error al usuario
            });

    };

    const PedidoCard = ({ pedido }) => (
        <div className="card mb-3" style={{ height: "auto" }}>
            <div className="row g-0">
                <div className="col-12 col-md-1 d-flex ">
                    <img
                        src={platoImg}
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
                        onClick={() => handleComplete(pedido.id)}
                        style={{ width: "100%" }}
                    >
                        Terminar
                    </button>
                </div>
            </div>
        </div>
    );

    return (<>
        <nav className="navbar bg-dark navbar-expand-lg border-bottom border-body" data-bs-theme="dark">
            <div className="container-fluid">
                <div className="navbar-brand">Cocina</div>
            </div>
        </nav>
        <div className="container-fluid">
            <h1>Lista de Pedidos</h1>
            <div>
                <div className="d-flex gap-2">
                    <input
                        type="date"
                        className="form-control mb-4"
                        value={selectedDate}
                        onChange={(e) => {
                            handleDateSelection(e.target.value);
                        }}
                        style={{ maxWidth: "200px" }}
                    />
                </div>
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

    </>);
}