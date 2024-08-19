const {ipcMain, dialog} = require('electron')
const { app, BrowserWindow, Menu, shell} = require('electron/main')
const path = require('node:path')

//importar o modulo de conexão
const {dbStatus, desconectar} = require('./database.js')

//importar do Schema (model) das coleções("tabelas")
const clienteModel = require('./src/models/Cliente.js')
const fornecedorModel = require('./src/models/Fornecedor.js')
const { default: mongoose } = require('mongoose')

let dbCon = null

// janela principal (definir o objeto win como variável pública)
let win
const createWindow = () => {
    win = new BrowserWindow({
        width: 1280,
        height: 720,
        resizable: false,
        icon: './src/public/img/armazenamento.png',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js') //importante para ter acesso do preload.js
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
                modal: true,
                webPreferences: {
                    preload: path.join(__dirname, 'preload.js') //importante para ter acesso do preload.js
                }
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
                modal: true,
                webPreferences: {
                    preload: path.join(__dirname, 'preload.js') //importante para ter acesso do preload.js
                }
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
                height: 750, //altura
                resizable: false, //evitar o redimensionamento
                //titleBarStyle: 'hidden', //esconder barra de título e menu
                autoHideMenuBar: true, //esconder o menu
                icon: './src/public/img/fornecedores.png',
                parent: father, //estabelece a relação parent-child
                modal: true,
                webPreferences: {
                    preload: path.join(__dirname, 'preload.js') //importante para ter acesso do preload.js
                }
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
                modal: true,
                webPreferences: {
                    preload: path.join(__dirname, 'preload.js') //importante para ter acesso do preload.js
                }
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
                modal:true,
                webPreferences: {
                    preload: path.join(__dirname, 'preload.js') //importante para ter acesso do preload.js
                }
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
        //console.log(`<<< ${message}`)
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
        await dbStatus()
        win.webContents.send('db-status', 'Banco de dados conectado.')
    } catch (error) {
        win.webContents.send('db-status', `Erro de conexão ${error.message}`)
    }
}

//Clientes
//CRUD Create >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
ipcMain.on('new-cliente', async (event, cliente) => {
    console.log(cliente) //Teste do passo 2 - slide
    // Passo 3 (slide): cadastrar o cliente no MongoDB
    try {
        //extrair os dados do objeto
        const novoCliente = new clienteModel({
            nomeCliente: cliente.nomeCli,
            foneCliente: cliente.foneCli,
            emailCliente: cliente.emailCli
        })
        await novoCliente.save() //save() - moongoose
        dialog.showMessageBox({
            type: 'info',
            title: 'Aviso',
            message: 'Cliente cadastrado com sucesso',
            buttons: ['Ok']
        })
    } catch (error) {
        console.log(error)
    }
})
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<


//CRUD Read >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
ipcMain.on('dialog-infoSearchClienteDialog', (event) => {
    dialog.showMessageBox({
        type: 'warning',
        title: 'Atenção!',
        message: 'Pesquise o cliente no campo de busca',
        buttons: ['Ok']
    })
    event.reply('focus-search')
})
//Recebimento do pedido de busca de um cliente pelo nome (Passo 1)
ipcMain.on('search-client', async (event, nomeCliente) => {
    console.log(nomeCliente)
    //Passo 2: Busca no banco de dados
    try {
        //find() "método de busca newRegex 'i' case insensitive
        const dadosCliente = await clienteModel.find({nomeCliente: new RegExp(nomeCliente, 'i')}) //Passo 2
        console.log(dadosCliente) //Passo 3 (recebimento dos dados do cliente)
        // UX -> se o cliente não esytiver cadastrado, avisar o usuário e habilitar o cadastramento
        if(dadosCliente.length === 0) {
            dialog.showMessageBox({
                type: 'warning',
                title: 'Atenção!',
                message: 'Cliente não cadastrado. \nDeseja cadastrar este cliente?',
                buttons: ['Sim','Não'],
                defaultId: 0
            }).then((result) => {
                if (result.response === 0) {
                    //setar o nome do cliente no form e habilitar o cadastramento
                    event.reply('name-client')
                } else {
                    //limpar a caixa de buscar
                    event.reply('clear-search')
                }
            })
        } else {
            //Passo 4 (enviar os dados do cliente ao renderizador)
            event.reply('data-client', JSON.stringify(dadosCliente))
        }
    } catch (error) {
        console.log(error)
    }
})
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<


//CRUD Update >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
ipcMain.on('update-cliente', async (event, cliente) => {
    console.log(cliente) //Teste do passo 2 - slide
    // Passo 3 (slide): cadastrar o cliente no MongoDB
    try {
        //extrair os dados do objeto
        const clienteEditado = await clienteModel.findByIdAndUpdate(
            cliente.idCli, {
            nomeCliente: cliente.nomeCli,
            foneCliente: cliente.foneCli,
            emailCliente: cliente.emailCli
        },
            {
                new: true
            }
        )
        dialog.showMessageBox({
            type: 'info',
            title: 'Aviso',
            message: 'Dados do cliente alterado com sucesso',
            buttons: ['Ok']
        })
    } catch (error) {
        console.log(error)
    }
})
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<


//CRUD Delete >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
ipcMain.on('delete-cliente', (event, idCli) => {
    console.log(idCli) // teste do passo 2
    //Importante! Confirmar a ação antes de excluir do banco
    dialog.showMessageBox({
        type: 'error',
        title: 'ATENÇÃO!',
        message: 'Tem certeza que deseja excluir este cliente?',
        defaultId: 0,
        buttons: ['Sim', 'Não']
    }).then (async(result) => {
        if (result.response === 0) {
            // Passo 3 (excluir o cliente do banco)
            try {                
                await clienteModel.findByIdAndDelete(idCli)
                event.reply('clear-all-cliente')
                dialog.showMessageBox({
                    type: 'info',
                    title: 'Aviso',
                    message: 'Dados do cliente apagado com sucesso',
                    buttons: ['Ok']
                })
            } catch (error) {
                console.log(error)
            }
        }
    })
})
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<





//Fornecedor
//CRUD Create >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
ipcMain.on('new-fornecedor', async (event, fornecedor) => {
    console.log(fornecedor) //Teste do passo 2 - slide
    // Passo 3 (slide): cadastrar o cliente no MongoDB
    try {
        //extrair os dados do objeto
        const novoFornecedor = new fornecedorModel({
            razaoFornecedor: fornecedor.razaoForne,
            cnpjFornecedor: fornecedor.cnpjForne,
            foneFornecedor: fornecedor.foneForne,
            emailFornecedor: fornecedor.emailForne,
            cepFornecedor: fornecedor.cepForne,
            ruaFornecedor: fornecedor.ruaForne,
            enderecoFornecedor: fornecedor.enderecoForne,
            complementoFornecedor: fornecedor.complementoForne,
            bairroFornecedor: fornecedor.bairroForne,
            cidadeFornecedor: fornecedor.cidadeForne,
            estadoFornecedor: fornecedor.estadoForne
        })
        await novoFornecedor.save() //save() - moongoose
        dialog.showMessageBox({
            type: 'info',
            title: 'Aviso',
            message: 'Fornecedor cadastrado com sucesso',
            buttons: ['Ok']
        })
    } catch (error) {
        console.log(error)
    }
})
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<


//CRUD Read >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
ipcMain.on('dialog-infoSearchFornecedorDialog', (event) => {
    dialog.showMessageBox({
        type: 'warning',
        title: 'Atenção!',
        message: 'Pesquise o fornecedor no campo de busca',
        buttons: ['Ok']
    })
    event.reply('focus-search')
})
//Recebimento do pedido de busca de um cliente pelo nome (Passo 1)
ipcMain.on('search-forne', async (event, razaoFornecedor) => {
    console.log(razaoFornecedor)
    //Passo 2: Busca no banco de dados
    try {
        //find() "método de busca newRegex 'i' case insensitive
        const dadosForne = await fornecedorModel.find({razaoFornecedor: new RegExp(razaoFornecedor, 'i')}) //Passo 2
        console.log(dadosForne) //Passo 3 (recebimento dos dados do cliente)
        // UX -> se o cliente não esytiver cadastrado, avisar o usuário e habilitar o cadastramento
        if(dadosForne.length === 0) {
            dialog.showMessageBox({
                type: 'warning',
                title: 'Atenção!',
                message: 'Fornecedor não cadastrado. \nDeseja cadastrar este fornecedor?',
                buttons: ['Sim','Não'],
                defaultId: 0
            }).then((result) => {
                if (result.response === 0) {
                    //setar o nome do cliente no form e habilitar o cadastramento
                    event.reply('nome-forne')
                } else {
                    //limpar a caixa de buscar
                    event.reply('clear-search')
                }
            })
        } else {
            //Passo 4 (enviar os dados do cliente ao renderizador)
            event.reply('data-forne', JSON.stringify(dadosForne))
        }
    } catch (error) {
        console.log(error)
    }
})
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<


//CRUD Update >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
ipcMain.on('update-fornecedor', async (event, fornecedor) => {
    console.log(fornecedor) //Teste do passo 2 - slide
    // Passo 3 (slide): cadastrar o cliente no MongoDB
    try {
        //extrair os dados do objeto
        const fornecedorEditado = await fornecedorModel.findByIdAndUpdate(
            fornecedor.idForne, {
                razaoFornecedor: fornecedor.razaoForne,
                cnpjFornecedor: fornecedor.cnpjForne,
                foneFornecedor: fornecedor.foneForne,
                emailFornecedor: fornecedor.emailForne,
                cepFornecedor: fornecedor.cepForne,
                ruaFornecedor: fornecedor.ruaForne,
                enderecoFornecedor: fornecedor.enderecoForne,
                complementoFornecedor: fornecedor.complementoForne,
                bairroFornecedor: fornecedor.bairroForne,
                cidadeFornecedor: fornecedor.cidadeForne,
                estadoFornecedor: fornecedor.estadoForne
        },
            {
                new: true
            }
        )
        dialog.showMessageBox({
            type: 'info',
            title: 'Aviso',
            message: 'Dados do cliente alterado com sucesso',
            buttons: ['Ok']
        })
    } catch (error) {
        console.log(error)
    }
})

ipcMain.on('alert-dados', async (event) => {
    dialog.showMessageBox({
        type: 'warning',
        title: 'Aviso',
        message: 'Preencha todos os campos obrigatórios!',
        buttons: ['Ok'],
    })
    event.reply('focus-razao')
})
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<


//CRUD Delete >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
ipcMain.on('delete-fornecedor', (event, idForne) => {
    console.log(idForne) // teste do passo 2
    //Importante! Confirmar a ação antes de excluir do banco
    dialog.showMessageBox({
        type: 'error',
        title: 'ATENÇÃO!',
        message: 'Tem certeza que deseja excluir este fornecedor?',
        defaultId: 0,
        buttons: ['Sim', 'Não']
    }).then (async(result) => {
        if (result.response === 0) {
            // Passo 3 (excluir o cliente do banco)
            try {                
                await fornecedorModel.findByIdAndDelete(idForne)
                event.reply('clear-all-forne')
                dialog.showMessageBox({
                    type: 'info',
                    title: 'Aviso',
                    message: 'Dados do fornecedor apagado com sucesso',
                    buttons: ['Ok']
                })
            } catch (error) {
                console.log(error)
            }
        }
    })
})
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<