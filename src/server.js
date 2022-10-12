const express = require('express');
const http = require('http');
const app = express();

const { Server } = require('socket.io');
const { engine } = require('express-handlebars');
const Contenedor = require('./contenedor')

const server = http.createServer(app);
const io = new Server(server);

const contenedor = new Contenedor();
const chat = new Contenedor()




app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

app.set('views', './views');
app.set('view engine', 'hbs');

app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'index.hbs',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials'
}))

io.on('connection', (socket) => {
    console.log('🟢 Usuario conectado')
    
    const productos = contenedor.getAll();
    socket.emit('bienvenidoLista', productos )
    
    const mensajes =  chat.getAll();
    socket.emit('listaMensajesBienvenida', mensajes)
    
    socket.on('nuevoMensaje', (data) => {
        chat.save(data);
        
        const mensajes =  chat.getAll();
        io.sockets.emit('listaMensajesActualizada', mensajes)
        chat.saveList(mensajes)
    })

    socket.on('productoAgregado', (data) => {
        console.log('Alguien presionó el click')
        contenedor.save(data);
        
        const productos =  contenedor.getAll();
        io.sockets.emit('listaActualizada', productos);
    })
    
    socket.on('disconnect', () => {
        console.log('🔴 Usuario desconectado')
    })
    
})


app.get('/productos', (req, res) => {
    const productos =  contenedor.getAll();
    res.render('pages/list', {productos})
})

app.post('/productos', (req,res) => {
    const {body} = req;
    contenedor.save(body);
    res.redirect('/');
})

app.get('/', (req,res) => {
    res.render('pages/forms', {})
})


const PORT = process.env.PORT || 8080;
const srv = server.listen(PORT, () => { 
    console.log(`Servidor Http con Websockets escuchando en el puerto ${srv.address().port}`);
})
srv.on('error', (err) => console.log(err))