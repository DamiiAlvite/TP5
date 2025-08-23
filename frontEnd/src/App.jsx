import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import SearchBar from "./components/SearchBar";
import DetailPanel from "./components/DetailPanel";
import CenterForm from "./components/CenterForm";
import SectionalizerForm from "./components/SectionalizerForm";

function App() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [showCenterForm, setShowCenterForm] = useState(false);
  const [showSectionalizerForm, setShowSectionalizerForm] = useState(false);

  return (
    <Container fluid className="p-4">
      <Row>
        {/* Columna izquierda */}
        <Col md={4} className="border-end pe-3">
          <h4>Búsqueda</h4>
          <SearchBar setSelectedItem={setSelectedItem} />

          <div className="mt-3">
            <Button
              variant="primary"
              className="me-2"
              onClick={() => setShowCenterForm(true)}
            >
              Nuevo Centro
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowSectionalizerForm(true)}
            >
              Nuevo Seccionalizador
            </Button>
          </div>
        </Col>

        {/* Columna derecha */}
        <Col md={8} className="ps-3">
          <DetailPanel
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
          />
        </Col>
      </Row>

      {/* Formularios modales */}
      <CenterForm
        show={showCenterForm}
        handleClose={() => setShowCenterForm(false)}
      />
      <SectionalizerForm
        show={showSectionalizerForm}
        handleClose={() => setShowSectionalizerForm(false)}
      />
    </Container>
  );
}

export default App;
