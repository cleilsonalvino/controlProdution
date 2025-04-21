import React, { useState } from 'react';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (username === 'admin' && password === '123') {
      // Simulação de login bem-sucedido para o administrador
      window.location.href = '/dashboard'; // Redireciona para a página de administrador
    } else if (username === 'funcionario' && password === 'funcionario123') {
      // Simulação de login bem-sucedido para o funcionário (pode adicionar mais lógica aqui)
      window.location.href = '/funcionario'; // Redireciona para a página de funcionário
    } else {
      setError('Usuário ou senha incorretos.');
    }
  };

  return (
    <div className="container-md d-flex flex-column justify-content-center align-items-center mt-5">
      <h1>Sistema de Controle de Produção</h1>
      <img src="/logo-dr-pequena.png" alt="" />
      {error && <div className="alert alert-danger w-100">{error}</div>}
      <div className="form-group w-100">
        <label htmlFor="username">Usuário:</label>
        <input
          type="text"
          className="form-control"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="form-group w-100">
        <label htmlFor="password">Senha:</label>
        <input
          type="password"
          className="form-control"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button className="btn btn-primary mt-3 w-100" onClick={handleLogin}>
        Entrar
      </button>

    </div>
  );
}

export default Login;