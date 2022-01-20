const express = require('express')
const contenedor = require("./contenedor.js");
 

const file = new contenedor('./productos.txt')

const { Router } = express

const PORT = 8080 || process.env.PORT;

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const productos = Router() 
 
validateFieldId = (req,res,next) => {    
    if ( !(Number.isInteger(Number(req.params.id))) ) 
         res.status(500).send('{ "error" : "el campo debe ser numerico"}')
    else     
        next()
}

validateFieldEmpty = (req,res,next) => {        
    if ( !(file.getById(req.params.id)) ) 
         res.status(500).send('{ "error" : "producto no encontrado"}')
    else     
        next()
}

validateBodyId = (req,res,next) => {    
    if ( !(Number.isInteger(Number(req.body.id))) ) 
         res.status(500).send('{ "error" : "el campo debe ser numerico"}')
    else     
        next()
}

// http://localhost:8080/api/productos/
productos.get('/', (req, res) => {  
    res.send(file.getAll())
})

// http://localhost:8080/api/productos/1
productos.get('/:id', validateFieldId, validateFieldEmpty, (req, res) => {  
    res.send(file.getById(req.params.id))
})

// http://localhost:8080/api/productos/1
productos.delete('/:id', validateFieldId, validateFieldEmpty ,(req, res) => {  
    if ( file.deleteById(req.params.id) )
        res.status(200).send('{ "sucess" : "sucess"}')
    else
        res.status(500).send('{ "error" : "producto no encontrado"}')
})

// http://localhost:8080/api/productos/1
productos.put('/:id', validateFieldId, validateFieldEmpty, (req, res) => {      
    if ( file.change(req.params.id, req.body.title, req.body.price, req.body.thumb) )
        res.status(200).send('{ "id" : "' + req.params.id + '", sucess" : "sucess"}')
    else
        res.status(500).send('{ "error" : "error de grabacion"}')
})
// POST desde form
productos.post('/', (req, res) => {  
    let item =  file.save(req.body.title,req.body.price,req.body.thumb)
    
    if (!item) 
        res.status(500).send('{ "error" : "error de grabacion"}')
    else
        res.status(200).send('{ "id" : ' + item + ', "sucess" : "sucess"}') 
})

app.use('/api/productos', productos) 

app.use('/static', express.static('public')) //define donde esta los arch estaticos
 

const server = app.listen(PORT, () => {
    console.log(`Index.js http escuchando en el puerto ${server.address().port}`)
})
server.on("error", error => console.log(`Error en servidor ${error}`))