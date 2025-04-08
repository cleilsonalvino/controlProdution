import React from "react";

function FiltroPedidos({ label, valor, aoMudar, placeholder }) {
  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <input
        type="text"
        className="form-control"
        value={valor}
        onChange={(e) => aoMudar(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

export default FiltroPedidos;
