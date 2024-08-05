/**
 * Modulo de conexão com o banco de dados
 * Uso do framework mongoose (npm i mongoose)
 * @author Luís Antônio de Paula Lima
 */

//importar a biblioteca
const mongoose = require('mongoose')

//definir o banco de dados (compass)
let url = 'mongodb://admin:123%40senac@10.26.45.211:27017/'

//Variável para armazenar o status da conexão
let isConnected = false

//status da conexão
const dbStatus = async () => {
    if (isConnected === false)
        await conectar()
}

//conectar
const conectar = async () => {
    if (isConnected === false) {
        try {
            await mongoose.connect(url)
            isConnected = true
            console.log("MongoDB Conectado")
        } catch (error) {
            console.log(`Problema detectado: ${error}`)
        }
    }
}

//desconectar
const desconectar = async () => {
    if (isConnected === true) {
        try {
            await mongoose.connect(url)
            isConnected = false
            console.log("MongoDB Desconectado")
        } catch (error) {
            console.log(`Problema detectado: ${error}`)
        }
    }
}

//exportar para o main os métodos conectar e desconectar
module.exports = {dbStatus ,desconectar}