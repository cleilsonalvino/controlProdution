import React, { useState } from 'react';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Novo estado para controlar a animação

  const handleLogin = () => {
    if (username === 'admin' && password === '123') {
      setLoading(true); // Ativa a animação
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 3000); // Redireciona após 1.5 segundos
    } else if (username === 'funcionario' && password === 'funcionario123') {
      setLoading(true); // Ativa a animação
      setTimeout(() => {
        window.location.href = '/funcionario';
      }, 3000); // Redireciona após 1.5 segundos
    } else {
      setError('Usuário ou senha incorretos.');
    }
  };

  return (
    <div className="container-md d-flex flex-column justify-content-center align-items-center mt-5 position-relative"> {/* Adicionado position-relative */}
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

      {loading && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)', // Fundo escuro semi-transparente
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000, // Garante que a sobreposição fique por cima de outros elementos
            opacity: 0,
            transition: 'opacity 0.5s ease-in-out',
          }}
          ref={(el) => {
            if (el) {
              setTimeout(() => {
                el.style.opacity = 1; // Inicia o efeito de fade-in
              }, 10);
            }
          }}
        >
          <div
            style={{
              padding: '20px',
              borderRadius: '8px',
              color: 'white',
              opacity: 0,
              transition: 'opacity 0.5s ease-in-out 0.5s', // Delay para aparecer depois do fundo
            }}
            ref={(el) => {
              if (el) {
                setTimeout(() => {
                  el.style.opacity = 1; // Inicia o efeito de fade-in da mensagem
                }, 500);
              }
            }}
          >
            <h2>Bem-vindo!</h2>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;