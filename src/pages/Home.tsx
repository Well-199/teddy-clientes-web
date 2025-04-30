import { useState, useEffect } from 'react'
import { Cliente } from '../types/cliente'
import { useLocation } from 'react-router-dom'

import '../styles/Home.css'
import add from '../assets/add.png'
import edit from '../assets/edit.png'
import del from '../assets/delete.png'

const Home = () => {

    const location = useLocation()

    const [clientes, setClientes] = useState<Cliente[]>([])

    const [paginaAtual, setPaginaAtual] = useState(1)
    const clientesPorPagina = 6

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

    const getClientes = async () => {
        console.log(userid)
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
            console.log(res)
        }
    }

    const handleCliente = async () => {
        

        if(nome != '' && salario != 0 && empresa != 0){
            console.log(modalName)

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
                console.log(res)
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

        console.log(id)

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

    useEffect(() => { getClientes() }, [mostrarModal])

    return (
        <div className="clientes-container">
        <div className="clientes-titulo">
            <span><strong>{clientes.length}</strong> clientes encontrados:</span>
            <span>Clientes por página: <strong>6</strong></span>
        </div>

    <div className="clientes-grid">
        {clientesPaginados.map((cliente) => (
        <div key={cliente.id} className="cliente-card">
            <h2 className="cliente-nome">{cliente.nome}</h2>
            <p className="cliente-info">Salário: R$ {cliente.salario}</p>
            <p className="cliente-info">Empresa: R$ {cliente.valorEmpresa}</p>
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


  )
}

export default Home
