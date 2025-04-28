import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Login.css'
import toenter from '../assets/Entrar.png'

function Login() {

  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError('')
    setName(event.target.value)
  }

  const access = async () => {

    if(name == '') return setError('Campo nome não pode ser vazio!')
    if(name.length < 3) return setError('Nome deve ter no minimo 3 caracteres!')
    
    // api que recebe o nome e valida o acesso
    localStorage.setItem('@token', "cjabsb7ety7")
    navigate('/Home')
  }

  useEffect(() => {
    // console.log(name)
  }, [name])

  return (
    <div className='container'>
      <div className='title'>Olá seja bem-vindo!</div>
      <div className='inputName'>
        <input type='text' placeholder='Digite o seu nome.' onChange={handleChange}/>
      </div>
      {error&&
        <p className='error'>{error}</p>
      }
      <div className='buttonToEnter' onClick={access}>
        <img src={toenter} alt='to-enter'/>
      </div>
    </div>
  )
}

export default Login
