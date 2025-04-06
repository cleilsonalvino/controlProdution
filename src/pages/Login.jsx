import React from 'react'

function Login() {
  return (
    <div className='container-md d-flex flex-column justify-content-center align-items-center mt-5'>
        <a href="/funcionario" className='btn btn-primary'>Funcionario</a>
        <br />
        <a href="/dashboard" className='btn btn-primary'>ADM</a>
    </div>
  )
}

export default Login