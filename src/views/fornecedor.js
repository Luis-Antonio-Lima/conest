/**
 * Processo de renderização
 * Fornecedores
 */

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
        buscarFornecedor()
    }
}

// Adicionar a função de manipulação do evento da tecla Enter
document.getElementById('frmFornecedor').addEventListener('keydown', teclaEnter)

// Função para remover manipulador de eventos da tecla enter
function removerTeclaEnter() {
    document.getElementById('frmFornecedor').removeEventListener('keydown', teclaEnter)
}

function adicionarTeclaEnter() {
    document.getElementById('frmFornecedor').addEventListener('keydown', teclaEnter)
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
document.getElementById('inputIdFornecedor').addEventListener('focus', () => {
    removerTeclaEnter()
    console.log("tecla enter desabilitada")
    btnCreate.disabled = true
    btnUpdate.disabled = true
    btnDelete.disabled = true
})

// quando selecionado essas caixas de texto, automaticamente o enter é removido do botão (Buscar), e habilitado o botão (Adicionar) - (UX)
document.querySelectorAll('#inputRazaoSocial, #inputCNPJ, #inputPhoneFornecedor, #inputAddressFornecedor, #inputEndereco, #inputNumeroEndereco, #inputComplementoEndereco').forEach(input => {
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
let idFornecedor = document.getElementById('inputIdFornecedor')
let formFornecedor = document.getElementById('frmFornecedor')
let razaoFornecedor = document.getElementById('inputRazaoSocial')
let cnpjFornecedor = document.getElementById('inputCNPJ')
let foneFornecedor = document.getElementById('inputPhoneFornecedor')
let emailFornecedor = document.getElementById('inputAddressFornecedor')
let cepFornecedor = document.getElementById('inputEndereco')
let ruaFornecedor = document.getElementById('resLogradouro')
let enderecoFornecedor = document.getElementById('inputNumeroEndereco')
let complementoFornecedor = document.getElementById('inputComplementoEndereco')
let bairroFornecedor = document.getElementById('resBairro')
let cidadeFornecedor = document.getElementById('resLocalidade')
let estadoFornecedor = document.getElementById('resUF')
//evento relacionado ao botão adicionar (ainda passo 1 - slide)
formFornecedor.addEventListener('submit', async(event) => {
    event.preventDefault()
    console.log(razaoFornecedor.value, cnpjFornecedor.value,
        foneFornecedor.value, emailFornecedor.value, cepFornecedor.value, ruaFornecedor.value,
        enderecoFornecedor.value, complementoFornecedor.value, bairroFornecedor.value,
        cidadeFornecedor.value, estadoFornecedor.value)
    //Empacotar os dados em um objeto e enviar ao main.js (passo 2 - slide)
    const fornecedor = {
        razaoForne: razaoFornecedor.value,
        cnpjForne: cnpjFornecedor.value,
        foneForne: foneFornecedor.value,
        emailForne: emailFornecedor.value,
        cepForne: cepFornecedor.value,
        ruaForne: ruaFornecedor.value,
        enderecoForne: enderecoFornecedor.value,
        complementoForne: complementoFornecedor.value,
        bairroForne: bairroFornecedor.value,
        cidadeForne: cidadeFornecedor.value,
        estadoForne: estadoFornecedor.value
        
    }
    api.newFornecedor(fornecedor)
    //limpar os dados "form" após envio
    formFornecedor.reset()
})
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<


//CRUD Read >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
let arrayFornecedor = []
// Função que vai enviar ao main um pedido de busca dos dados do fornecedor pelo nome (Passo 1 - slide)
function buscarFornecedor() {
    let razaoFornecedor = document.getElementById('inputSearch').value.trim().replace(/\s+/g, ' ')
    //validação (UX)
    if (razaoFornecedor === "") {
        //validar campo obrigatório
        api.infoSearchFornecedorDialog()
    } else {
        //enviar o pedido de busca junto com a razao do fornecedor
        api.searchForne(razaoFornecedor)

    }
    //Foco no campo de busca (UX)
    api.focusSearch((args) => {
        document.getElementById('inputSearch').focus()
    })
    // Setar o nome do cliente e habilitar o cadastramento
    api.nameForne((args) => {

        //Restaurar o comportamento padrão da tecla Enter
        removerTeclaEnter()
        let setarRazaoFornecedor = document.getElementById('inputSearch').value.trim().replace(/\s+/g, ' ')
        document.getElementById('inputRazaoSocial').value += setarRazaoFornecedor
        document.getElementById('inputSearch').value = ""
        document.getElementById('inputSearch').blur()
        document.getElementById('inputSearch').disabled = true
        document.getElementById('inputRazaoSocial').focus()
        btnRead.disabled = true
        btnCreate.disabled = false
    })
    //Limpar a caixa de busca e setar o foco
    api.clearSearch((args) => {
        document.getElementById('inputSearch').value
        document.getElementById('inputSearch').focus()
    })
    // receber do main.js os dados do cliente (passo 4)
    api.dataForne((event, dadosForne) => {
        arrayFornecedor = JSON.parse(dadosForne)
        console.log(arrayFornecedor)
    
    //Passo 5 (final) percorre o array, extrair os dados e setar os campos de texto (caixas input) do formulário
        arrayFornecedor.forEach((f) => {
            document.getElementById('inputIdFornecedor').value = f._id,
            document.getElementById('inputRazaoSocial').value = f.razaoFornecedor,
            document.getElementById('inputPhoneFornecedor').value = f.foneFornecedor,
            document.getElementById('inputAddressFornecedor').value = f.emailFornecedor,
            document.getElementById('inputCNPJ').value = f.cnpjFornecedor,
            document.getElementById('inputEndereco').value = f.cepFornecedor,
            document.getElementById('resLogradouro').value = f.ruaFornecedor,
            document.getElementById('inputNumeroEndereco').value = f.enderecoFornecedor,
            document.getElementById('inputComplementoEndereco').value = f.complementoFornecedor,
            document.getElementById('resBairro').value = f.bairroFornecedor,
            document.getElementById('resLocalidade').value = f.cidadeFornecedor,
            document.getElementById('resUF').value = f.estadoFornecedor
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
function editarFornecedor() {
    const fornecedor = {
        idForne: idFornecedor.value,
        razaoForne: razaoFornecedor.value,
        cnpjForne: cnpjFornecedor.value,
        foneForne: foneFornecedor.value,
        emailForne: emailFornecedor.value,
        cepForne: cepFornecedor.value,
        ruaForne: ruaFornecedor.value,
        enderecoForne: enderecoFornecedor.value,
        complementoForne: complementoFornecedor.value,
        bairroForne: bairroFornecedor.value,
        cidadeForne: cidadeFornecedor.value,
        estadoForne: estadoFornecedor.value
    }
    console.log(fornecedor) //teste do passo 1
    //Passo 2: Enviar os dados para o main.js
    if (razaoFornecedor.value == "") {
        api.alert()
        api.focusRazao((foco) => {
            document.getElementById('inputRazaoSocial').focus()
        })
    } else {
        api.updateForne(fornecedor)

        api.clearFornecedor((clearFornecedor) => {
            console.log("campo limpo")
            formFornecedor.reset()
            document.getElementById('inputSearch').focus()
        })
    }  
}
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<


//CRUD Delete >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function deletarFornecedor() {
    let idForne = idFornecedor.value
    console.log(idForne) //teste do passo 1
    //Passo 2: Enviar o id do cliente para o main.js
    api.deleteForne(idForne)
}

api.clearFornecedor((clearFornecedor) => {
    console.log("campo limpo")
    formFornecedor.reset()
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
    document.getElementById('frmFornecedor').addEventListener('keydown', teclaEnter)
}