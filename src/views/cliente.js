/**
 * Processo de renderização
 * Clientes
 */

//Mudar propiedades do documento ao iniciar (UX)
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('inputSearch').focus()
    btnCreate.disabled = true
    btnUpdate.disabled = true
    btnDelete.disabled = true
    //btnReset.disabled = true
})

//Função para manipular o evento enter - (UX)
function teclaEnter(event) {
    if (event.key === 'Enter') {
        event.preventDefault()
        //executar a função associada ao botão buscar
        buscarCliente()
    }
}

// Adicionar a função de manipulação do evento da tecla Enter
document.getElementById('frmCliente').addEventListener('keydown', teclaEnter)

// Função para remover manipulador de eventos da tecla enter
function removerTeclaEnter() {
    document.getElementById('frmCliente').removeEventListener('keydown', teclaEnter)
}

function adicionarTeclaEnter() {
    document.getElementById('frmCliente').addEventListener('keydown', teclaEnter)
}

// quando selecionado essa caixas de texto, automaticamente o enter é adicionado do botão (Buscar), e desabilitado o botão (Adicionar) - (UX)
document.getElementById('inputSearch').addEventListener('focus', () => {
    adicionarTeclaEnter()
    console.log("tecla enter habilitada")
    btnCreate.disabled = true
    btnUpdate.disabled = true
    btnDelete.disabled = true
})

// quando selecionado essas caixas de texto, automaticamente o enter é removido do (Buscar), e desabilitado o botão (Adicionar) - (UX)
document.getElementById('inputIdCliente').addEventListener('focus', () => {
    removerTeclaEnter()
    console.log("tecla enter desabilitada")
    btnCreate.disabled = true
    btnUpdate.disabled = true
    btnDelete.disabled = true
})

// quando selecionado essas caixas de texto, automaticamente o enter é removido do botão (Buscar), e habilitado o botão (Adicionar) - (UX)
document.querySelectorAll('#inputNameCliente, #inputPhoneCliente, #inputAddressCliente').forEach(input => {
    input.addEventListener('focus', () => {
        removerTeclaEnter();
        console.log("tecla enter desabilitada");
        btnCreate.disabled = false
        btnUpdate.disabled = false
        btnDelete.disabled = false
    })
})

//CRUD Create >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//captura dos inputs do formulário (passo 1 - slide)
let idCliente = document.getElementById('inputIdCliente')
let formCliente = document.getElementById('frmCliente')
let nomeCliente = document.getElementById('inputNameCliente')
let foneCliente = document.getElementById('inputPhoneCliente')
let emailCliente = document.getElementById('inputAddressCliente')
//evento relacionado ao botão adicionar (ainda passo 1 - slide)
formCliente.addEventListener('submit', async(event) => {
    event.preventDefault()
    console.log(nomeCliente.value, foneCliente.value, emailCliente.value)
    //Empacotar os dados em um objeto e enviar ao main.js (passo 2 - slide)
    const cliente = {
        nomeCli: nomeCliente.value.trim().replace(/\s+/g, ' '),
        foneCli: foneCliente.value.trim().replace(/\s+/g, ' '),
        emailCli: emailCliente.value.trim().replace(/\s+/g, ' ')
    }
    api.newCliente(cliente)
    //limpar os dados "form" após envio
    formCliente.reset()
})
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<


//CRUD Read >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//array (vetor) usado na renderização dos dados do cliente
let arrayCliente = []
// Função que vai enviar ao main um pedido de busca dos dados do cliente pelo nome (Passo 1 - slide)
function buscarCliente() {
    let nomeCliente = document.getElementById('inputSearch').value.trim().replace(/\s+/g, ' ')
    //validação (UX)
    if (nomeCliente === "") {
        //validar campo obrigatório
        api.infoSearchClienteDialog()
    } else {
        //enviar o pedido de busca junto com o nome do cliente
        api.searchClient(nomeCliente)

    }
    //Foco no campo de busca (UX)
    api.focusSearch((args) => {
        document.getElementById('inputSearch').focus()
    })
    // Setar o nome do cliente e habilitar o cadastramento
    api.nameClient((args) => {

        //Restaurar o comportamento padrão da tecla Enter
        removerTeclaEnter()
        let setarNomeCliente = document.getElementById('inputSearch').value.trim().replace(/\s+/g, ' ')
        document.getElementById('inputNameCliente').value += setarNomeCliente
        document.getElementById('inputSearch').value = ""
        document.getElementById('inputSearch').disabled = true
        document.getElementById('inputSearch').blur()
        document.getElementById('inputNameCliente').focus()
        btnRead.disabled = true
        btnCreate.disabled = false
    })
    //Limpar a caixa de busca e setar o foco
    api.clearSearch((args) => {
        document.getElementById('inputSearch').value
        document.getElementById('inputSearch').focus()
    })
    // receber do main.js os dados do cliente (passo 4)
    api.dataCliente((event, dadosCliente) => {
        arrayCliente = JSON.parse(dadosCliente)
        console.log(arrayCliente)
    
    //Passo 5 (final) percorre o array, extrair os dados e setar os campos de texto (caixas input) do formulário
        arrayCliente.forEach((c) => {
            document.getElementById('inputIdCliente').value = c._id,
            document.getElementById('inputNameCliente').value = c.nomeCliente,
            document.getElementById('inputPhoneCliente').value = c.foneCliente,
            document.getElementById('inputAddressCliente').value = c.emailCliente
            // limpar a caixa de busca (UX)
            document.getElementById('inputSearch').value = ""
            // ativar os botões update e delete
            document.getElementById('btnUpdate').disabled = false
            document.getElementById('btnDelete').disabled = false
        })
    })
}
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<


//CRUD Update>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function editarCliente() {
    const cliente = {
        idCli: idCliente.value,
        nomeCli: nomeCliente.value,
        foneCli: foneCliente.value,
        emailCli: emailCliente.value
    }
    console.log(cliente) //teste do passo 1
    //Passo 2: Enviar os dados para o main.js
    api.updateClient(cliente)
}
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<


//CRUD Delete >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function deletarCliente() {
    let idCli = idCliente.value
    console.log(idCli) //teste do passo 1
    //Passo 2: Enviar o id do cliente para o main.js
    api.deleteClient(idCli)
}

api.clearCliente((clearCliente) => {
    console.log("campo limpo")
    formCliente.reset()
    document.getElementById('inputSearch').focus()
})
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<


//Reset

function resetForm () {
    document.getElementById('inputSearch').disabled = false
    document.getElementById('inputSearch').focus()
    btnCreate.disabled = true
    btnUpdate.disabled = true
    btnDelete.disabled = true
    btnRead.disabled = false
    //btnReset.disabled = true
    document.getElementById('frmCliente').addEventListener('keydown', teclaEnter)
}