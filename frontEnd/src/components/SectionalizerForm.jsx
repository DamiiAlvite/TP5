import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { api } from "../services/api";

function SectionalizerForm({ show, handleClose }) {
  const [form, setForm] = useState({
    prefix: "FV",
    num: "",
    location: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    await api.post("sectionalizers/", form);
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
          <Form.Group>
            <Form.Label>Prefijo</Form.Label>
            <Form.Select
              name="prefix"
              value={form.prefix}
              onChange={handleChange}
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
          </Form.Group>
          <Form.Group>
            <Form.Label>Número</Form.Label>
            <Form.Control
              type="number"
              name="num"
              value={form.num}
              onChange={handleChange}
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
