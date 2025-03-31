import React from "react";

function Pesquisar() {
  return (
    <div className="w-100 d-flex align-items-end ms-3">
      <input
        type="text"
        className="form-control"
        placeholder="Pesquisar"
        aria-label="Username"
        aria-describedby="addon-wrapping"
      />
    </div>
  );
}

export default Pesquisar;
