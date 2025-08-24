import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { api } from "../services/api";

function CenterEditForm({ show, handleClose, item, onSave }) {
  const [form, setForm] = useState({ ...item });
  const [centers, setCenters] = useState([]);
  const [sectionalizers, setSectionalizers] = useState([]);

  useEffect(() => {
    api.get("transformation-centers/").then(res => setCenters(res.data));
    api.get("sectionalizers/").then(res => setSectionalizers(res.data));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSelectChange = (e) => {
    const { name, options } = e.target;
    const values = Array.from(options).filter(o => o.selected).map(o => o.value);
    setForm({ ...form, [name]: values });
  };

  const handleSubmit = async () => {
    const { id, ...data } = form;
    await api.patch(`transformation-centers/${item.id}/`, data);
    const res = await api.get(`transformation-centers/${item.id}/`);
    onSave(res.data);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Centro de Transformación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group style={{ display: "flex", alignItems: "center" }}>
            <Form.Label style={{ marginRight: 10 }}>Tipo</Form.Label>
            <Form.Select name="prefix" value={form.prefix} onChange={handleChange} style={{ width: 80, marginRight: 10 }}>
              <option value="CT">CT</option>
              <option value="PT">PT</option>
            </Form.Select>
            <Form.Label style={{ marginRight: 10 }}>Código</Form.Label>
            <Form.Control
              type="text"
              name="cod"
              value={form.cod}
              onChange={handleChange}
              style={{ width: 120 }}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Nombre</Form.Label>
            <Form.Control type="text" name="name" value={form.name || ""} onChange={handleChange} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Telemando</Form.Label>
            <Form.Check type="checkbox" name="rem_ctrl" checked={form.rem_ctrl || false} onChange={handleChange} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Tipo</Form.Label>
            <Form.Select name="type" value={form.type} onChange={handleChange}>
              <option value="NIVEL">A nivel</option>
              <option value="SUBT">Subterránea</option>
              <option value="POZO">Pozo</option>
              <option value="PLAT">Plataforma</option>
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label>Ubicación</Form.Label>
            <Form.Control type="text" name="location" value={form.location || ""} onChange={handleChange} />
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

export default CenterEditForm;
