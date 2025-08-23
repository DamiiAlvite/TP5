import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { api } from "../services/api";

function CenterForm({ show, handleClose }) {
  const [form, setForm] = useState({
    cod: "",
    name: "",
    rem_ctrl: false,
    type: "NIVEL",
    location: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async () => {
    await api.post("transformation-centers/", form);
    alert("Centro creado");
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Nuevo Centro de Transformación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Código</Form.Label>
            <Form.Control
              type="text"
              name="cod"
              value={form.cod}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Check
            type="checkbox"
            label="Control Remoto"
            name="rem_ctrl"
            checked={form.rem_ctrl}
            onChange={handleChange}
          />
          <Form.Group>
            <Form.Label>Tipo</Form.Label>
            <Form.Select name="type" value={form.type} onChange={handleChange}>
              <option value="NIVEL">A nivel</option>
              <option value="SUBT">Subterránea</option>
              <option value="POZO">Pozo</option>
            </Form.Select>
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

export default CenterForm;

