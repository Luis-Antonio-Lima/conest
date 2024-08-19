const {ipcRenderer} = require('electron')
const { contextBridge} = require('electron')

// status de conexão (verificar se o banco de dados está conectado)
ipcRenderer.send('send-message', 'Status do banco de dados:')

ipcRenderer.on('db-status', (event, status) => {
    console.log(status)
    if (status === 'Banco de dados conectado.') {
        document.getElementById('statusBanco').src = '../public/img/dbon.png'
    } else {
        document.getElementById('statusBanco').src = '../public/img/dboff.png'
    }
})

contextBridge.exposeInMainWorld('api', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  hello: () => ipcRenderer.send('send-message', "Oi"),
  openAbout: () => ipcRenderer.send('open-about'),
  openClient: () => ipcRenderer.send('open-client'),
  openForne: () => ipcRenderer.send('open-forne'),
  openProdut: () => ipcRenderer.send('open-produt'),
  openRelatorio: () => ipcRenderer.send('open-relatorio'),
  newCliente: (cliente) => ipcRenderer.send('new-cliente', cliente),
  newFornecedor: (fornecedor) => ipcRenderer.send('new-fornecedor', fornecedor),
  infoSearchClienteDialog: () => ipcRenderer.send('dialog-infoSearchClienteDialog'),
  infoSearchFornecedorDialog: () => ipcRenderer.send('dialog-infoSearchFornecedorDialog'),
  focusSearch: (args) => ipcRenderer.on('focus-search', args),
  searchClient: (nomeCliente) => ipcRenderer.send ('search-client', nomeCliente),
  nameClient: (args) => ipcRenderer.on('name-client', args),
  updateClient: (cliente) => ipcRenderer.send('update-cliente', cliente),
  deleteClient: (idCli) => ipcRenderer.send('delete-cliente', idCli),
  clearSearch: (args) => ipcRenderer.on('clear-search', args),
  dataCliente: (dadosCliente) => ipcRenderer.on('data-client', dadosCliente),
  clearCliente: (clearCliente) => ipcRenderer.on('clear-all-cliente', clearCliente),
  nameForne: (args) => ipcRenderer.on('nome-forne', args),
  searchForne: (razaoForne) => ipcRenderer.send('search-forne', razaoForne),
  dataForne: (dadosForne) => ipcRenderer.on('data-forne', dadosForne),
  clearFornecedor: (clearFornecedor) => ipcRenderer.on('clear-all-forne', clearFornecedor),
  updateForne: (fornecedor) => ipcRenderer.send('update-fornecedor', fornecedor),
  deleteForne: (idForne) => ipcRenderer.send('delete-fornecedor', idForne),
  alert: () => ipcRenderer.send('alert-dados'),
  focusRazao: (foco) => ipcRenderer.on('focus-razao', foco)
})

// Inserir data na página
function obterData() {
    const data = new Date()
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }
    return data.toLocaleDateString('pt-br', options)
}

// Interagir diretamente no DOM do documento html (index.html)
window.addEventListener('DOMContentLoaded', () => {
    const dataAtual = document.getElementById('dataAtual').innerHTML = obterData()
})