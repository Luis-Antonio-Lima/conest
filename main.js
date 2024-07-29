const {ipcMain} = require('electron')
const { app, BrowserWindow, Menu, shell} = require('electron/main')
const path = require('node:path')

//importar o modulo de conexão
const {conectar, desconectar} = require('./database.js')

// janela principal (definir o objeto win como variável pública)
let win
const createWindow = () => {
    win = new BrowserWindow({
        width: 1280,
        height: 720,
        resizable: false,
        icon: './src/public/img/armazenamento.png',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    // Iniciar a janela com o menu personalizado
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))

    win.loadFile('./src/views/index.html')
}

// janela principal (definir o objeto win como variável pública)
//janela sobre
let produt //Resolver bug de abertura de várias janelas

const produtWindow = () => {
    const father = BrowserWindow.getFocusedWindow()
    if (father) {
        // Se a janela about n estiver aberta (bug 1) abrir
        if (!produt) {
            produt = new BrowserWindow({
                width: 1280, //largura
                height: 720, //altura
                resizable: false, //evitar o redimensionamento
                //titleBarStyle: 'hidden', //esconder barra de título e menu
                autoHideMenuBar: true, //esconder o menu
                icon: './src/public/img/produto.png',
                parent: father, //estabelece a relação parent-child
                modal: true
            })
        }
        produt.loadFile('./src/views/produtos.html')
    }
    // nativeTheme.themeSource = 'dark'

    // bug 2 (reabrir a janela ao se estiver fechada)
    produt.on('closed', () => {
        produt = null
    })
}

// janela principal (definir o objeto win como variável pública)
//janela sobre
let client //Resolver bug de abertura de várias janelas

const clientWindow = () => {
    const father = BrowserWindow.getFocusedWindow()
    if (father) {
        // Se a janela about n estiver aberta (bug 1) abrir
        if (!client) {
            client = new BrowserWindow({
                width: 1280, //largura
                height: 720, //altura
                resizable: false, //evitar o redimensionamento
                //titleBarStyle: 'hidden', //esconder barra de título e menu
                autoHideMenuBar: true, //esconder o menu
                icon: './src/public/img/cliente.png',
                parent: father, //estabelece a relação parent-child
                modal: true
            })
        }
    }
    // nativeTheme.themeSource = 'dark'
    client.loadFile('./src/views/clientes.html')

    // bug 2 (reabrir a janela ao se estiver fechada)
    client.on('closed', () => {
        client = null
    })
}

//janela fornecedor
let forne //Resolver bug de abertura de várias janelas

const forneWindow = () => {
    const father = BrowserWindow.getFocusedWindow()
    if (father) {
        // Se a janela about n estiver aberta (bug 1) abrir
        if (!forne) {
            forne = new BrowserWindow({
                width: 1280, //largura
                height: 720, //altura
                resizable: false, //evitar o redimensionamento
                //titleBarStyle: 'hidden', //esconder barra de título e menu
                autoHideMenuBar: true, //esconder o menu
                icon: './src/public/img/fornecedores.png',
                parent: father, //estabelece a relação parent-child
                modal: true
            })
        }
    }
    // nativeTheme.themeSource = 'dark'
    forne.loadFile('./src/views/fornecedores.html')

    // bug 2 (reabrir a janela ao se estiver fechada)
    forne.on('closed', () => {
        forne = null
    })
}

// janela relatorio
let rela //Resolver bug de abertura de várias janelas

const relatorioWindow = () => {
    const father = BrowserWindow.getFocusedWindow()
    if (father) {
        // Se a janela about n estiver aberta (bug 1) abrir
        if (!rela) {
            rela = new BrowserWindow({
                width: 1280, //largura
                height: 720, //altura
                resizable: false, //evitar o redimensionamento
                //titleBarStyle: 'hidden', //esconder barra de título e menu
                autoHideMenuBar: true, //esconder o menu
                icon: './src/public/img/relatorio.png',
                parent: father, //estabelece a relação parent-child
                modal: true
            })
        }
    }
    // nativeTheme.themeSource = 'dark'
    rela.loadFile('./src/views/relatorios.html')

    // bug 2 (reabrir a janela ao se estiver fechada)
    rela.on('closed', () => {
        rela = null
    })
}

//janela sobre
let about //Resolver bug de abertura de várias janelas

const aboutWindow = () => {
    const father = BrowserWindow.getFocusedWindow()
    if (father) {
        // Se a janela about n estiver aberta (bug 1) abrir
        if (!about) {
            about = new BrowserWindow({
                width: 460, //largura
                height: 250, //altura
                resizable: false, //evitar o redimensionamento
                //titleBarStyle: 'hidden', //esconder barra de título e menu
                autoHideMenuBar: true, //esconder o menu
                icon: './src/public/img/pc.png',
                parent: father,
                modal:true
            })
        }
    }
    // nativeTheme.themeSource = 'dark'
    about.loadFile('./src/views/sobre.html')

    // bug 2 (reabrir a janela ao se estiver fechada)
    about.on('closed', () => {
        about = null
    })
}

// iniciar a aplicação
app.whenReady().then(() => {

    //status de conexão com o banco de dados
    ipcMain.on('send-message', (event, message) => {
        console.log(`<<< ${message}`)
        statusConexao()
    })

    //desconectar do banco ao encerrar a janela
    app.on('before-quit', async () => {
        await desconectar()
    })

    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

// Template do menu personalizado

const template = [
    {
        label: 'Arquivo',
        submenu: [
            {
                label: 'Clientes',
                click: () => clientWindow(),
                accelerator: 'Alt+C'
            },
            {
                label: 'Fornecedores',
                click: () => forneWindow(),
                accelerator: 'Alt+F'
            },
            {
                label: 'Produtos',
                click: () => produtWindow(),
                accelerator: 'Alt+P'
            },
            {
                label: 'Sair',
                click: () => app.quit(),
                accelerator: 'Alt+F4'
            }
        ]
    },
    {
        label: 'Exibir',
        submenu: [
            {
                label: 'Recarregar',
                role: 'reload',
            },
            {
                label: 'Ferramentas do desenvolvedor',
                role: 'toggleDevTools'
            },
            {
                type: 'separator'
            },
            {
                label: 'Aplicar zoom',
                role: 'zoomIn'
            },
            {
                label: 'Reduzir zoom',
                role: 'zoomOut'
            },
            {
                label: 'Restaurar o zoom padrão',
                role: 'resetZoom'
            }
        ]
    },
    {
        label: 'Relatórios',
    },
    {
        label: 'Ajuda',
        submenu: [
            {
                label: 'Docs',
                click: () => shell.openExternal('https://www.electronjs.org/docs/latest/'),
                accelerator: 'Alt+F1'
            },
            {
                type: 'separator'
            },
            {
                label: 'Sobre',
                click: () => aboutWindow(),
            }
        ]
    },
]

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

ipcMain.on('open-about', () => {
    aboutWindow()
})

ipcMain.on('open-forne', () => {
    forneWindow()
})

ipcMain.on('open-client', () => {
    clientWindow()
})

ipcMain.on('open-produt', () => {
    produtWindow()
})

ipcMain.on('open-relatorio', () => {
    relatorioWindow()
})

//==================================================================================//
//função que verifica o status da conexão
const statusConexao = async () => {
    try {
        await conectar()
        win.webContents.send('db-status', 'Banco de dados conectado.')
    } catch (error) {
        win.webContents.send('db-status', `Erro de conexão ${error.message}`)
    }
}

