import React from "react";
import { Card, Button } from "react-bootstrap";
import { api } from "../services/api";
import CenterEditForm from "./CenterEditForm";
import SectionalizerEditForm from "./SectionalizerEditForm";

function DetailPanel({ selectedItem, setSelectedItem }) {
  const [sourceDetail, setSourceDetail] = React.useState(null);
  const [destinationDetail, setDestinationDetail] = React.useState(null);
  const [contentTypeIds, setContentTypeIds] = React.useState({ transformationcenter: null, sectionalizer: null });

  // Cargar los content type IDs al montar
  React.useEffect(() => {
    api.get("contenttype-ids/").then(res => setContentTypeIds(res.data));
  }, []);

  React.useEffect(() => {
    // Mostrar detalles de fuente y destino usando content_type y object_id
    const fetchSource = async () => {
      if (
        selectedItem &&
        selectedItem.source_content_type &&
        selectedItem.source_object_id &&
        contentTypeIds.sectionalizer &&
        contentTypeIds.transformationcenter
      ) {
        if (parseInt(selectedItem.source_content_type) === parseInt(contentTypeIds.sectionalizer)) {
          // Es seccionalizador
          const res = await api.get(`sectionalizers/${selectedItem.source_object_id}/`);
          setSourceDetail(res.data);
        } else if (parseInt(selectedItem.source_content_type) === parseInt(contentTypeIds.transformationcenter)) {
          // Es centro
          const res = await api.get(`transformation-centers/${selectedItem.source_object_id}/`);
          setSourceDetail(res.data);
        } else {
          setSourceDetail(null);
        }
      } else {
        setSourceDetail(null);
      }
    };
    const fetchDestination = async () => {
      if (
        selectedItem &&
        selectedItem.destination_content_type &&
        selectedItem.destination_object_id &&
        contentTypeIds.sectionalizer &&
        contentTypeIds.transformationcenter
      ) {
        if (parseInt(selectedItem.destination_content_type) === parseInt(contentTypeIds.sectionalizer)) {
          const res = await api.get(`sectionalizers/${selectedItem.destination_object_id}/`);
          setDestinationDetail(res.data);
        } else if (parseInt(selectedItem.destination_content_type) === parseInt(contentTypeIds.transformationcenter)) {
          const res = await api.get(`transformation-centers/${selectedItem.destination_object_id}/`);
          setDestinationDetail(res.data);
        } else {
          setDestinationDetail(null);
        }
      } else {
        setDestinationDetail(null);
      }
    };
    fetchSource();
    fetchDestination();
  }, [selectedItem, contentTypeIds]);
  const [connectedCenters, setConnectedCenters] = React.useState([]);
  const [connectedSectionalizers, setConnectedSectionalizers] = React.useState([]);
  const [showEdit, setShowEdit] = React.useState(false);

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

  // Renderizado de formularios de edición
  const handleEditClick = () => setShowEdit(true);
  const handleEditClose = () => setShowEdit(false);
  const handleEditSave = (updatedItem) => {
    setSelectedItem(updatedItem);
    setShowEdit(false);
  };

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

  // Campos a mostrar en español y ocultar los internos
  const camposMostrar = [
    { key: "location", label: "Ubicación" },
    { key: "name", label: "Nombre" },
    { key: "rem_ctrl", label: "Telemando" },
    { key: "type", label: "Tipo" },
  ];

  // Renderizado especial para seccionalizador
  const isSectionalizer = !('cod' in selectedItem);
  return (
    <>
      <Card>
        <Card.Body>
          <Card.Title>
            {isSectionalizer
              ? `Seccionalizador ${selectedItem.prefix} ${selectedItem.num}`
              : `${selectedItem.prefix || "CT"} ${selectedItem.cod}`}
          </Card.Title>
          <Card.Text>
            {isSectionalizer ? (
              <>
                <div>
                  <strong>Ubicación:</strong> {selectedItem.location}
                </div>
                <div>
                  <strong>Fuente:</strong> {sourceDetail ? `${sourceDetail.prefix} ${sourceDetail.num || sourceDetail.cod}` : "Sin fuente"}
                </div>
                <div>
                  <strong>Destino:</strong> {destinationDetail ? `${destinationDetail.prefix} ${destinationDetail.num || destinationDetail.cod}` : "Sin destino"}
                </div>
              </>
            ) : (
              // ...existing code...
              <>
                {camposMostrar
                  .filter(c => selectedItem[c.key] !== undefined)
                  .map(c => (
                    <div key={c.key}>
                      <strong>{c.label}:</strong> {String(selectedItem[c.key])}
                    </div>
                  ))}
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
              </>
            )}
          </Card.Text>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="primary" onClick={handleEditClick}>
              Editar
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Eliminar
            </Button>
          </div>
        </Card.Body>
      </Card>
      {/* Modal de edición */}
      {showEdit && (
        isSectionalizer ? (
          <SectionalizerEditForm
            show={showEdit}
            handleClose={handleEditClose}
            item={selectedItem}
            onSave={handleEditSave}
          />
        ) : (
          <CenterEditForm
            show={showEdit}
            handleClose={handleEditClose}
            item={selectedItem}
            onSave={handleEditSave}
          />
        )
      )}
    </>
  );
}

export default DetailPanel;
