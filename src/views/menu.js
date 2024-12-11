import React, { useState, useEffect } from "react";
import { apiService } from "../pages/apiServices";

export const MenuClientes = () => {
    const [platos, setPlatos] = useState([]);
    const [platosPorTipo, setPlatosPorTipo] = useState({});


    useEffect(() => {
        apiService.getAll("platos")
            .then(response => {
                setPlatos(response.data);
                organizarPlatosPorTipo(response.data);
            })
            .catch((error) => {
                console.error("Error al obtener los platos:", error);
            });
    }, []);


    const organizarPlatosPorTipo = (platos) => {
        const platosOrganizados = platos.reduce((acc, plato) => {
            if (!acc[plato.tipo]) {
                acc[plato.tipo] = [];
            }
            acc[plato.tipo].push(plato);
            return acc;
        }, {});
        setPlatosPorTipo(platosOrganizados);
        console.log(platosOrganizados)
    };

    return (
        <>
            <nav className="navbar bg-dark navbar-expand-lg border-bottom border-body" data-bs-theme="dark">
                <div className="container-fluid">
                    <div className="navbar-brand">Menu del Restaurante</div>
                </div>
            </nav>
            <div className="container-fluid m-2">
                {Object.keys(platosPorTipo).map((tipo) => (
                    <div key={tipo}>
                        <h3>{tipo}</h3>
                        <ul>
                            {platosPorTipo[tipo].map((plato) => (
                                <li key={plato.id}>
                                    <strong>{plato.nombre}</strong> - ${plato.precio}
                                    <ul>
                                        {plato.ingredientes.length > 0 ? (
                                            <li><strong>Ingredientes:</strong> {plato.ingredientes.map(ingrediente => ingrediente.nombre).join(', ')}</li>
                                        ) : (
                                            <li>No tiene ingredientes especificados.</li>
                                        )}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </>
    );
}