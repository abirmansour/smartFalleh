// File: Modal.jsx
import React from "react";
import "./Modal.css";

export default function Modal({ isOpen, onClose, children, title }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // empêche la fermeture quand on clique à l’intérieur
      >
        {/* Header */}
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button
            onClick={onClose}
            className="modal-close-btn"
            aria-label="Fermer"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
