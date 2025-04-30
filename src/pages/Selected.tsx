import { useState, useEffect } from 'react'
import { Cliente } from '../types/cliente'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

import '../styles/Home.css'
import logoteddy from '../assets/Logo-Teddy.png'
import clientemenu from '../assets/cliente-menu.png'
import selecionado from '../assets/selecionado.png'
import collapse from '../assets/collapse.png'
import clear from '../assets/clear.png'
import sair from '../assets/sair.png'

const Selecionados = () => {

    const navigate = useNavigate()
    const location = useLocation()

    const [clientes, setClientes] = useState<Cliente[]>([])

    const username = location.state?.username || localStorage.getItem("@name") || 'Usuário'

    const logout = () => {
        localStorage.removeItem("@id")
        localStorage.removeItem("@token")
        localStorage.removeItem("@nome")
        navigate('/')
    }

    const toggleSidebar = () => {
        const sidebar = document.getElementById('sidebar')
        sidebar?.classList.toggle('open')
    }

    const removeClient = (id: number) => {
        const newClients = clientes.filter(item => item.id != id)
        setClientes(newClients)
    }

    const activetab = window.location.pathname === '/Selecionados' ? '#ff6600' : '#555'

    useEffect(() => { 
        if(location.state?.clients){
            setClientes(location.state?.clients)
        }
     }, [])

    return (
        <>
        <header className="main-header">
            <div className="header-container">
                <div className="logo">
                    <img src={logoteddy} alt="Logo Teddy" />
                </div>
                <nav className="nav-links">
                    <a onClick={() => navigate('/Home')}>Clientes</a>
                    <a style={{ color: activetab }} onClick={() => navigate('/Selecionados')}>Clientes selecionados</a>
                    <a onClick={logout}>Sair</a>
                </nav>
                <div className="user">
                    Olá, <strong>{username}!</strong>
                </div>
            </div>
        </header>


        <div className="clientes-container">

            <button className="menu-toggle" onClick={toggleSidebar}>☰</button>

            <aside className="sidebar" id="sidebar">
                <div className="sidebar-header">
                    <img src={logoteddy} alt="Logo Teddy" className="sidebar-logo" />
                </div>
                <div className='collapse' onClick={toggleSidebar}>
                    <img src={collapse} alt='Collapse' />
                </div>
                <nav className="sidebar-nav">
                    <a className="sidebar-link" onClick={() => navigate('/Selecionados')}>
                        <span className="icon">
                            <img src={selecionado} alt='Selecionados' />
                        </span>
                        <span className="text" style={{ color: activetab }}>Selecionados</span>
                    </a>
                    <a className="sidebar-link" onClick={() => navigate('/Home')}>
                        <span className="icon">
                            <img src={clientemenu} alt='Menu Clientes' />
                        </span>
                        <span className="text">Clientes</span>
                    </a>
                    <a onClick={logout} className="sidebar-link">
                        <span className="icon">
                            <img src={sair} alt='Sair' />
                        </span>
                        <span className="text">Sair</span>
                    </a>
                </nav>
            </aside>

            <div className="clientes-titulo">
                <span><strong>Clientes selecionados:</strong></span>
            </div>

            <div className="clientes-grid">
                {clientes.map((cliente) => (
                <div key={cliente.id} className="cliente-card">
                    <h2 className="cliente-nome">{cliente.nome}</h2>
                    <p className="cliente-info">Salário: R$ {cliente.salario}</p>
                    <p className="cliente-info">Empresa: R$ {cliente.valorEmpresa}</p>
                    <div className="cliente-acoes">
                        <button className="btn-adicionar"></button>
                        <button className="btn-editar"></button>
                        <button className="btn-excluir" onClick={() => removeClient(cliente.id)}>
                            <img src={clear} alt='excluir'/>
                        </button>
                    </div>
                </div>
                ))}
            </div>

            <div className="criar-cliente-container">
                <button className="btn-criar-cliente" onClick={() => setClientes([])}>
                    Limpar clientes selecionados
                </button>
            </div>
        </div>
        </>
    )
}

export default Selecionados
