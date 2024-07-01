const {ipcRenderer} = require('electron')
const { contextBridge} = require('electron')

// status de conexão (verificar se o banco de dados está conectado)
ipcRenderer.send('send-message', 'Status do banco de dados:')

ipcRenderer.on('db-status', (event, status) => {
    console.log(status)
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
  openRelatorio: () => ipcRenderer.send('open-relatorio')
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