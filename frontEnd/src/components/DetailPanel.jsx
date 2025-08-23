import React from "react";
import { Card, Button } from "react-bootstrap";
import { api } from "../services/api";

function DetailPanel({ selectedItem, setSelectedItem }) {
  const [sourceDetail, setSourceDetail] = React.useState(null);
  const [destinationDetail, setDestinationDetail] = React.useState(null);

  React.useEffect(() => {
    // Mostrar detalles de fuente y destino si son IDs
    if (selectedItem && selectedItem.source) {
      if (typeof selectedItem.source === "number" || typeof selectedItem.source === "string") {
        api.get(`sectionalizers/${selectedItem.source}/`).then(res => setSourceDetail(res.data));
      } else {
        setSourceDetail(selectedItem.source);
      }
    } else {
      setSourceDetail(null);
    }
    if (selectedItem && selectedItem.destination) {
      if (typeof selectedItem.destination === "number" || typeof selectedItem.destination === "string") {
        api.get(`transformation-centers/${selectedItem.destination}/`).then(res => setDestinationDetail(res.data));
      } else {
        setDestinationDetail(selectedItem.destination);
      }
    } else {
      setDestinationDetail(null);
    }
  }, [selectedItem]);
  const [connectedCenters, setConnectedCenters] = React.useState([]);
  const [connectedSectionalizers, setConnectedSectionalizers] = React.useState([]);

  React.useEffect(() => {
    // Si los centros conectados son IDs, obtener los datos completos
    if (selectedItem && selectedItem.connected_centers && selectedItem.connected_centers.length > 0) {
      if (typeof selectedItem.connected_centers[0] === "number") {
        Promise.all(selectedItem.connected_centers.map(id =>
          api.get(`transformation-centers/${id}/`).then(res => res.data)
        )).then(setConnectedCenters);
      } else {
        setConnectedCenters(selectedItem.connected_centers);
      }
    } else {
      setConnectedCenters([]);
    }
    // Si los seccionalizadores conectados son IDs, obtener los datos completos
    if (selectedItem && selectedItem.connected_sectionalizers && selectedItem.connected_sectionalizers.length > 0) {
      if (typeof selectedItem.connected_sectionalizers[0] === "number") {
        Promise.all(selectedItem.connected_sectionalizers.map(id =>
          api.get(`sectionalizers/${id}/`).then(res => res.data)
        )).then(setConnectedSectionalizers);
      } else {
        setConnectedSectionalizers(selectedItem.connected_sectionalizers);
      }
    } else {
      setConnectedSectionalizers([]);
    }
  }, [selectedItem]);
  if (!selectedItem) {
    return <p>Selecciona un elemento para ver sus detalles.</p>;
  }

  const handleDelete = async () => {
    if ("cod" in selectedItem) {
      await api.delete(`transformation-centers/${selectedItem.id}/`);
    } else {
      await api.delete(`sectionalizers/${selectedItem.id}/`);
    }
    setSelectedItem(null);
    alert("Eliminado correctamente");
  };

  // Helper para mostrar nombre completo de centro
  const renderCenter = (center) => {
    if (!center) return null;
    return `${center.cod} - ${center.name || ''}`;
  };

  // Helper para mostrar nombre completo de seccionalizador
  const renderSectionalizer = (sec) => {
    if (!sec) return null;
    return `${sec.prefix} ${sec.num}`;
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>
          {"cod" in selectedItem
            ? `Centro de Transformación ${selectedItem.cod}`
            : `Seccionalizador ${selectedItem.prefix} ${selectedItem.num}`}
        </Card.Title>
        <Card.Text>
          {/* Mostrar campos normales excepto los asociados */}
          {Object.entries(selectedItem)
            .filter(([key]) => key !== "connected_centers" && key !== "connected_sectionalizers" && key !== "source" && key !== "destination")
            .map(([key, value]) => (
              <div key={key}>
                <strong>{key}:</strong> {String(value)}
              </div>
            ))}

          {/* Mostrar fuente */}
          {typeof selectedItem.source !== "undefined" && (
            <div>
              <strong>Fuente:</strong> {sourceDetail ? `${sourceDetail.prefix} ${sourceDetail.num}` : selectedItem.source}
            </div>
          )}

          {/* Mostrar destino */}
          {typeof selectedItem.destination !== "undefined" && (
            <div>
              <strong>Destino:</strong> {destinationDetail ? `${destinationDetail.cod} - ${destinationDetail.name}` : selectedItem.destination}
            </div>
          )}

          {/* Mostrar centros conectados */}
          {connectedCenters.length > 0 && (
            <div style={{ marginTop: 10 }}>
              <strong>Centros conectados:</strong>
              <ul>
                {connectedCenters.map((c, idx) => (
                  <li key={idx}>{renderCenter(c)}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Mostrar seccionalizadores conectados */}
          {connectedSectionalizers.length > 0 && (
            <div style={{ marginTop: 10 }}>
              <strong>Seccionalizadores conectados:</strong>
              <ul>
                {connectedSectionalizers.map((s, idx) => (
                  <li key={idx}>{renderSectionalizer(s)}</li>
                ))}
              </ul>
            </div>
          )}
        </Card.Text>
        <Button variant="danger" onClick={handleDelete}>
          Eliminar
        </Button>
      </Card.Body>
    </Card>
  );
}

export default DetailPanel;
