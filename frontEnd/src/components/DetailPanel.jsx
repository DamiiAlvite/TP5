import React from "react";
import { Card, Button } from "react-bootstrap";
import { api } from "../services/api";

function DetailPanel({ selectedItem, setSelectedItem }) {
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

  return (
    <Card>
      <Card.Body>
        <Card.Title>
          {"cod" in selectedItem
            ? `Centro de Transformación ${selectedItem.cod}`
            : `Seccionalizador ${selectedItem.prefix} ${selectedItem.num}`}
        </Card.Title>
        <Card.Text>
          {Object.entries(selectedItem).map(([key, value]) => (
            <div key={key}>
              <strong>{key}:</strong> {String(value)}
            </div>
          ))}
        </Card.Text>
        <Button variant="danger" onClick={handleDelete}>
          Eliminar
        </Button>
      </Card.Body>
    </Card>
  );
}

export default DetailPanel;
