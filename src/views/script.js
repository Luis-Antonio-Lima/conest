const read = require ('readline-sync')

function teste() {
    alert('teste')
}

function buscarcep() {
    let valor
    valor = String(frmFornecedor.txtCEP.value)
    let urlAPI = `https://viacep.com.br/ws/${valor}/json/`

    fetch(urlAPI)
        .then((Response) => {
            return Response.json()
        })

        .then((dados) => {
            frmFornecedor.resLogradouro.value = `${dados.logradouro}`
            frmFornecedor.resBairro.value = `${dados.bairro}`
            frmFornecedor.resLocalidade.value = `${dados.localidade}`
            frmFornecedor.resUF.value = `${dados.uf}`
            frmFornecedor.resDDD.value = `(${dados.ddd}) `
            /*
            console.log(dados.logradouro)
            console.log(dados.bairro)
            console.log(dados.localidade)
            console.log(dados.uf)
            */
        })

        .catch((error) => {
        console.log(`Erro ao obter o endereço: ${error}`)
        })
}