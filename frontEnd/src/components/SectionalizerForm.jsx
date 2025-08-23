import React, { useState } from "react";
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

  React.useEffect(() => {
    api.get("transformation-centers/").then(res => setCenters(res.data));
    api.get("sectionalizers/").then(res => setSectionalizers(res.data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSelectChange = (e) => {
    const { name, options } = e.target;
    const values = Array.from(options).filter(o => o.selected).map(o => o.value);
    setForm({ ...form, [name]: values });
  };

  const handleSubmit = async () => {
    // Crear el seccionalizador sin los asociados
    const { connected_centers, connected_sectionalizers, source, destination, ...baseData } = form;
    const res = await api.post("sectionalizers/", { ...baseData, source: source || null, destination: destination || null });
    const id = res.data.id;
    // Actualizar los asociados si hay
    if (connected_centers.length > 0 || connected_sectionalizers.length > 0 || source || destination) {
      await api.patch(`sectionalizers/${id}/`, {
        connected_centers,
        connected_sectionalizers,
        source: source || null,
        destination: destination || null,
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
            <Form.Select name="source" value={form.source} onChange={handleChange}>
              <option value="">Sin fuente</option>
              {sectionalizers.map(s => (
                <option key={s.id} value={s.id}>{s.prefix} {s.num}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label>Destino</Form.Label>
            <Form.Select name="destination" value={form.destination} onChange={handleChange}>
              <option value="">Sin destino</option>
              {centers.map(c => (
                <option key={c.id} value={c.id}>{c.cod} - {c.name}</option>
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
