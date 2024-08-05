/**
 * Modelo de dados (model) Fornecedores
 */

const {model, Schema} = require ('mongoose')

const fornecedorSchema = new Schema ({
    razaoFornecedor: {
        type: String
    },
    cnpjFornecedor: {
        type: String
    },
    foneFornecedor: {
        type: String
    },
    emailFornecedor: {
        type: String
    },
    cepFornecedor: {
        type: String
    },
    ruaFornecedor: {
        type: String
    },
    enderecoFornecedor: {
        type: String
    },
    complementoFornecedor: {
        type: String
    },
    bairroFornecedor: {
        type: String
    },
    cidadeFornecedor: {
        type: String
    },
    estadoFornecedor: {
        type: String
    }
})

module.exports = model('Fornecedor',fornecedorSchema)