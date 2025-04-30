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

    try {
      const req = await fetch('http://localhost:3000/usuarios/login', {
        method: 'POST',
        body: JSON.stringify({ nome: name.trim() }),
        headers: { 'Content-Type': 'application/json' }
      })
      const res = await req.json()
      console.log(res)
      if(res.error){
        localStorage.removeItem('@token')
        setError(res.message)
        return
      }

      if(res.token){
        localStorage.setItem('@token', res.token)
        localStorage.setItem("@id", res.id)
        navigate('/Home', { state: { userId: res.id } })
        return
      }
    } catch (error) { console.log(error) }
    
  }

  useEffect(() => { /*console.log(name)*/ }, [name])

  return (
    <div className='container'>
      <div className='section'>
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
    </div>
  )
}

export default Login
