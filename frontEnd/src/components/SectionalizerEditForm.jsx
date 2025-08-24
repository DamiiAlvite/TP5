import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { api } from "../services/api";

function SectionalizerEditForm({ show, handleClose, item, onSave }) {
  const [form, setForm] = useState({ ...item });
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

  const handleSourceChange = (e) => {
    setForm(prev => ({ ...prev, source: e.target.value }));
  };
  const handleDestinationChange = (e) => {
    setForm(prev => ({ ...prev, destination: e.target.value }));
  };

  useEffect(() => {
    // Inicializar source y destination para el select
    if (item.source_content_type && item.source_object_id) {
      let type = item.source_content_type === contentTypeIds.transformationcenter ? "transformationcenter" : "sectionalizer";
      setForm(prev => ({ ...prev, source: `${type}:${item.source_object_id}` }));
    }
    if (item.destination_content_type && item.destination_object_id) {
      let type = item.destination_content_type === contentTypeIds.transformationcenter ? "transformationcenter" : "sectionalizer";
      setForm(prev => ({ ...prev, destination: `${type}:${item.destination_object_id}` }));
    }
  }, [item, contentTypeIds]);

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
    await api.patch(`sectionalizers/${item.id}/`, payload);
    const res = await api.get(`sectionalizers/${item.id}/`);
    onSave(res.data);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Seccionalizador</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group style={{ display: "flex", alignItems: "center" }}>
            <Form.Label style={{ marginRight: 10 }}>Prefijo</Form.Label>
            <Form.Select name="prefix" value={form.prefix} onChange={handleChange} style={{ width: 80, marginRight: 10 }}>
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
            <Form.Control type="text" name="location" value={form.location || ""} onChange={handleChange} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Fuente</Form.Label>
            <Form.Select name="source" value={form.source || ""} onChange={handleSourceChange}>
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
            <Form.Select name="destination" value={form.destination || ""} onChange={handleDestinationChange}>
              <option value="">Sin destino</option>
              {centers.map(c => (
                <option key={`center-dest-${c.id}`} value={`transformationcenter:${c.id}`}>Centro: {c.cod} - {c.name}</option>
              ))}
              {sectionalizers.map(s => (
                <option key={`sectionalizer-dest-${s.id}`} value={`sectionalizer:${s.id}`}>Seccionalizador: {s.prefix} {s.num}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label>Centros conectados</Form.Label>
            <Form.Select name="connected_centers" multiple value={form.connected_centers} onChange={handleSelectChange}>
              {centers.map(c => (
                <option key={c.id} value={c.id}>{c.cod} - {c.name}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label>Seccionalizadores conectados</Form.Label>
            <Form.Select name="connected_sectionalizers" multiple value={form.connected_sectionalizers} onChange={handleSelectChange}>
              {sectionalizers.map(s => (
                <option key={s.id} value={s.id}>{s.prefix} {s.num}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
        <Button variant="primary" onClick={handleSubmit}>Guardar</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SectionalizerEditForm;
