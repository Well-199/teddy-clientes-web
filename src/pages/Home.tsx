import { useState, useEffect } from 'react'
import { Cliente } from '../types/cliente'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

import '../styles/Home.css'
import add from '../assets/add.png'
import edit from '../assets/edit.png'
import del from '../assets/delete.png'
import logoteddy from '../assets/Logo-Teddy.png'
import clientemenu from '../assets/cliente-menu.png'
import selecionado from '../assets/selecionado.png'
import collapse from '../assets/collapse.png'
import sair from '../assets/sair.png'

const Home = () => {

    const navigate = useNavigate()
    const location = useLocation()

    const [clientes, setClientes] = useState<Cliente[]>([])

    const [paginaAtual, setPaginaAtual] = useState(1)
    const clientesPorPagina = 8

    const indexInicial = (paginaAtual - 1) * clientesPorPagina
    const indexFinal = indexInicial + clientesPorPagina
    const clientesPaginados = clientes.slice(indexInicial, indexFinal)

    const totalPaginas = Math.ceil(clientes.length / clientesPorPagina)

    const [nome, setNome] = useState('')
    const [salario, setSalario] = useState(0)
    const [empresa, setEmpresa] = useState(0)
    const [clienteID, setClienteID] = useState(0)
    const [modalDelete, setModalDelete] = useState(false)
    const [mostrarModal, setMostrarModal] = useState(false)
    const [modalName, setModalName] = useState('Criar cliente')

    const userid = location.state?.userId || localStorage.getItem("@id")
    const username = location.state?.username || localStorage.getItem("@name") || 'Usuário'

    const getClientes = async () => {
        if(userid){
            const req = await fetch(`http://localhost:3000/clientes/${userid}`,{
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'authorization': localStorage.getItem("@token") || ''
                }
            })
            const res = await req.json()
            if(res && res.length > 0){
                setClientes(res)
            }
        }
    }

    const handleCliente = async () => {
        

        if(nome != '' && salario != 0 && empresa != 0){

            const method = modalName.includes('Criar') ? 'POST' : modalName.includes('Editar') ? 'PUT' : 'DELETE' 

            try {
                const req = await fetch(`http://localhost:3000/clientes/${clienteID}`, {
                    method: method,
                    body: JSON.stringify({
                        id: clienteID,
                        nome: nome,
                        salario: salario,
                        valorEmpresa: empresa,
                        usuario: userid
                    }),
                    headers: {
                        'Content-type': 'application/json',
                        'authorization': localStorage.getItem("@token") || ''
                    }
                })
                const res = await req.json()
                if(res.id){
                    const newClientes = clientes.filter(item => item.id != res.id)
                    setClientes(newClientes)
                    getClientes()
                }
            } catch (error) { console.log(error) }
        }

        setMostrarModal(false)
    }

    const openModal = (id: number, action: string) => {
        
        setClienteID(0)
        setNome('')
        setSalario(0)
        setEmpresa(0)
        setModalName('Criar Cliente')
        setModalDelete(false)

        if(id != 0){
            const cliente = clientes.filter(item => item.id === id)
            if(cliente.length > 0){
                setClienteID(cliente[0].id)
                setNome(cliente[0].nome)
                setSalario(cliente[0].salario)
                setEmpresa(cliente[0].valorEmpresa)
            }

            if(action === 'editar'){
                setModalName('Editar Cliente')
            }

            if(action === 'excluir'){
                setModalDelete(true)
                setModalName('Excluir Cliente')
            }
        }
        setMostrarModal(true)
    }

    let newListClient:Cliente[] = []
    const selectedItem = (id: number) => {
        const card = document.getElementById(`card${id}`)

        card?.classList.toggle('active')

        if(card){
            if(card?.classList.contains('active')){

                card.style.backgroundColor = '#B3D4FC'

                const client = clientes.filter(item => item.id == id)
                if(client.length > 0){
                    newListClient.push(client[0])
                }
            } else {
                const client = newListClient.filter(item => item?.id != id)
                newListClient = client
                card.style.backgroundColor = '#fff'
            }
        }
    }

    

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

    const goSelecionados = () => {
        navigate('/Selecionados', { state: { clients: newListClient, username: 'Wellington' } })
    }

    const activetab = window.location.pathname === '/Home' ? '#ff6600' : '#555'

    useEffect(() => { getClientes() }, [mostrarModal])

    return (
        <>
        <header className="main-header">
            <div className="header-container">
                <div className="logo">
                    <img src={logoteddy} alt="Logo Teddy" />
                </div>
                <nav className="nav-links">
                    <a style={{ color: activetab }} onClick={() => navigate('/Home')}>Clientes</a>
                    <a onClick={goSelecionados}>Clientes selecionados</a>
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
                    <a className="sidebar-link" onClick={goSelecionados}>
                        <span className="icon">
                            <img src={selecionado} alt='Selecionados' />
                        </span>
                        <span className="text">Selecionados</span>
                    </a>
                    <a className="sidebar-link">
                        <span className="icon">
                            <img src={clientemenu} alt='Menu Clientes' />
                        </span>
                        <span className="text" style={{ color: activetab }}>Clientes</span>
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
                <span><strong>{clientes.length}</strong> clientes encontrados:</span>
                <span>Clientes por página: <strong>{clientesPorPagina}</strong></span>
            </div>

            <div className="clientes-grid">
                {clientesPaginados.map((cliente) => (
                <div key={cliente.id} className="cliente-card" id={`card${cliente.id}`}>
                    <h2 className="cliente-nome" onClick={() => selectedItem(cliente.id)}>{cliente.nome}</h2>
                    <p className="cliente-info" onClick={() => selectedItem(cliente.id)}>Salário: R$ {cliente.salario}</p>
                    <p className="cliente-info" onClick={() => selectedItem(cliente.id)}>Empresa: R$ {cliente.valorEmpresa}</p>
                    <div className="cliente-acoes">
                        <button className="btn-adicionar" onClick={() => openModal(0, '')}>
                            <img src={add} alt='adicionar'/>
                        </button>
                        <button className="btn-editar" onClick={() => openModal(cliente.id, 'editar')}>
                            <img src={edit} alt='editar'/>
                        </button>
                        <button className="btn-excluir" onClick={() => openModal(cliente.id, 'excluir')}>
                            <img src={del} alt='excluir'/>
                        </button>
                    </div>
                </div>
                ))}
            </div>

            <div className="criar-cliente-container">
                <button className="btn-criar-cliente" onClick={() => openModal(0, '')}>
                    Criar cliente
                </button>
            </div>

            <div className="paginacao">
                {[...Array(totalPaginas)].map((_, i) => (
                <button
                    key={i}
                    onClick={() => setPaginaAtual(i + 1)}
                    className={`pagina-botao ${paginaAtual === i + 1 ? 'ativa' : ''}`}
                >
                    {i + 1}
                </button>
                ))}
            </div>

            {mostrarModal && (
            <div className="modal-overlay">
                <div className="modal">
                    <div className="modal-header">
                        <span>{modalName}:</span>
                        <button className="modal-close" onClick={() => setMostrarModal(false)}>×</button>
                    </div>

                    <div className="modal-body">
                    {!modalDelete ?
                        <>
                        <input
                            type="text"
                            placeholder="Digite o nome:"
                            className="modal-input"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Digite o salário:"
                            className="modal-input"
                            value={salario}
                            onChange={(e) => setSalario(parseFloat(e.target.value))}
                        />
                        <input
                            type="number"
                            placeholder="Digite o valor da empresa:"
                            className="modal-input"
                            value={empresa}
                            onChange={(e) => setEmpresa(parseFloat(e.target.value))}
                        />
                    </>
                    :
                        <span>Você está prestes a excluir o cliente: <strong>{nome}</strong></span>
                    }
                        <button className="modal-submit" onClick={handleCliente}>{modalName}</button>
                    </div>
                </div>
            </div>
            )}

        </div>
        </>
    )
}

export default Home
