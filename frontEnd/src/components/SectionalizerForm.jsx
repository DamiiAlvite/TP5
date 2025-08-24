
import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { api } from "../services/api";

function SectionalizerForm({ show, handleClose }) {
  const [form, setForm] = useState({
    prefix: "FV",
    num: "",
    location: "",
    connected_centers: [],
    connected_sectionalizers: [],
    source: "",
    destination: "",
  });
  const [centers, setCenters] = useState([]);
  const [sectionalizers, setSectionalizers] = useState([]);
  const [contentTypeIds, setContentTypeIds] = useState({ transformationcenter: "", sectionalizer: "" });

  useEffect(() => {
    api.get("transformation-centers/").then(res => setCenters(res.data));
    api.get("sectionalizers/").then(res => setSectionalizers(res.data));
    api.get("contenttype-ids/").then(res => setContentTypeIds(res.data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e) => {
    const { name, options } = e.target;
    const values = Array.from(options).filter(o => o.selected).map(o => o.value);
    setForm(prev => ({ ...prev, [name]: values }));
  };

  // Fuente y destino: guardamos el string "tipo:id" y lo convertimos en el submit
  const handleSourceChange = (e) => {
    setForm(prev => ({ ...prev, source: e.target.value }));
  };
  const handleDestinationChange = (e) => {
    setForm(prev => ({ ...prev, destination: e.target.value }));
  };

  const handleSubmit = async () => {
    // Extraer tipo e id para source y destination
    let source_content_type = null, source_object_id = null;
    let destination_content_type = null, destination_object_id = null;
    if (form.source) {
      const [type, id] = form.source.split(":");
      source_content_type = contentTypeIds[type];
      source_object_id = id;
    }
    if (form.destination) {
      const [type, id] = form.destination.split(":");
      destination_content_type = contentTypeIds[type];
      destination_object_id = id;
    }
    const payload = {
      prefix: form.prefix,
      num: form.num,
      location: form.location,
      connected_centers: form.connected_centers,
      connected_sectionalizers: form.connected_sectionalizers,
      source_content_type,
      source_object_id,
      destination_content_type,
      destination_object_id,
    };
    const res = await api.post("sectionalizers/", payload);
    const id = res.data.id;
    if (form.connected_centers.length > 0 || form.connected_sectionalizers.length > 0) {
      await api.patch(`sectionalizers/${id}/`, {
        connected_centers: form.connected_centers,
        connected_sectionalizers: form.connected_sectionalizers,
      });
    }
    alert("Seccionalizador creado");
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Nuevo Seccionalizador</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group style={{ display: "flex", alignItems: "center" }}>
            <Form.Label style={{ marginRight: 10 }}>Prefijo</Form.Label>
            <Form.Select
              name="prefix"
              value={form.prefix}
              onChange={handleChange}
              style={{ width: 80, marginRight: 10 }}
            >
              <option value="FV">FV</option>
              <option value="FVC">FVC</option>
              <option value="B">B</option>
              <option value="BC">BC</option>
              <option value="Q">Q</option>
              <option value="QC">QC</option>
              <option value="A">A</option>
              <option value="AC">AC</option>
              <option value="AV">AV</option>
              <option value="AVC">AVC</option>
            </Form.Select>
            <Form.Label style={{ marginRight: 10 }}>Código</Form.Label>
            <Form.Control
              type="number"
              name="num"
              value={form.num}
              onChange={handleChange}
              style={{ width: 120 }}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Ubicación</Form.Label>
            <Form.Control
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Fuente</Form.Label>
            <Form.Select
              name="source"
              value={form.source}
              onChange={handleSourceChange}
            >
              <option value="">Sin fuente</option>
              {centers.map(c => (
                <option key={`center-${c.id}`} value={`transformationcenter:${c.id}`}>Centro: {c.cod} - {c.name}</option>
              ))}
              {sectionalizers.map(s => (
                <option key={`sectionalizer-${s.id}`} value={`sectionalizer:${s.id}`}>Seccionalizador: {s.prefix} {s.num}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label>Destino</Form.Label>
            <Form.Select
              name="destination"
              value={form.destination}
              onChange={handleDestinationChange}
            >
              <option value="">Sin destino</option>
              {centers.map(c => (
                <option key={`center-dest-${c.id}`} value={`transformationcenter:${c.id}`}>Centro: {c.cod} - {c.name}</option>
              ))}
              {sectionalizers.map(s => (
                <option key={`sectionalizer-dest-${s.id}`} value={`sectionalizer:${s.id}`}>Seccionalizador: {s.prefix} {s.num}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SectionalizerForm;
