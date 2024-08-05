/**
 * Processo de renderização
 * Fornecedores
 */

//CRUD Create >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//captura dos inputs do formulário (passo 1 - slide)
let formFornecedor = document.getElementById('frmFornecedor')
let razaoFornecedor = document.getElementById('inputRazaoSocial')
let cnpjFornecedor = document.getElementById('inputCNPJ')
let foneFornecedor = document.getElementById('inputPhone')
let emailFornecedor = document.getElementById('inputAddress')
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

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<


//CRUD Update>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<


//CRUD Delete >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<