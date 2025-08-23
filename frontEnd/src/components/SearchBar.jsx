import React, { useState, useEffect } from "react";
import { Form, ListGroup } from "react-bootstrap";
import { api } from "../services/api";

function SearchBar({ setSelectedItem }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query.length > 1) {
      Promise.all([
        api.get("transformation-centers/"),
        api.get("sectionalizers/"),
      ]).then(([centersRes, sectionRes]) => {
        const centers = centersRes.data.filter((c) =>
          (c.name?.toLowerCase().includes(query.toLowerCase()) ||
           c.cod?.toLowerCase().includes(query.toLowerCase()))
        );
        const sectionals = sectionRes.data.filter((s) =>
          `${s.prefix} ${s.num}`
            .toLowerCase()
            .includes(query.toLowerCase())
        );
        setResults([...centers, ...sectionals]);
      });
    } else {
      setResults([]);
    }
  }, [query]);

  return (
    <div>
      <Form.Control
        type="text"
        placeholder="Buscar..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {results.length > 0 && (
        <ListGroup className="mt-2">
          {results.map((item, idx) => (
            <ListGroup.Item
              key={idx}
              action
              onClick={() => setSelectedItem(item)}
            >
              {"cod" in item
                ? `Centro: ${item.cod} - ${item.name}`
                : `Seccionalizador: ${item.prefix} ${item.num}`}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
}

export default SearchBar;
