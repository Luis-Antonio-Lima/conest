/**
 * Modulo de conexão com o banco de dados
 * Uso do framework mongoose (npm i mongoose)
 * @author Luís Antônio de Paula Lima
 */

//importar a biblioteca
const mongoose = require('mongoose')

//definir o banco de dados (compass)
let url = 'mongodb://admin:123%40senac@10.26.45.211:27017/'

//conectar
const conectar = async () => {
    try {
        await mongoose.connect(url)
        console.log('mongoDB conectado')
    } catch (error) {
        console.log(`Problema detectado: ${error.message}`)
    }
}

//desconectar
const desconectar = async () => {
    try {
        await mongoose.disconnect(url)
        console.log('mongoDB desconectado')
    } catch (error) {
        console.log(`Problema detectado: ${error.message}`)
    }
}

//exportar para o main os métodos conectar e desconectar
module.exports = {conectar,desconectar}