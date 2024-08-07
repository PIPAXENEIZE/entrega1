import express from 'express';
import { engine } from 'express-handlebars';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import __dirname from './utils.js';
import chat from './routes/chat.js';
import { Server } from 'socket.io';
import ProductsRouter from './routes/products.router.js';
import CartRouter from './routes/cart.router.js';
import realtime from './routes/realtimeproducts.js';
import { getProductsData, setProductsData } from './data.js';
import { v4 as uuidv4 } from 'uuid'; // generador de IDS UNICAS
import hproducts from './routes/homeproducts.js';
import productsv2 from './routes/productshome.router.js'
import viewsrouter from './routes/views.router.js'
import userLogin from './routes/userLogin.js'
import sessionsRouter from './routes/sessions.router.js';


const app = express();
const PORT = process.env.PORT || 8080;
const connection = mongoose.connect('mongodb+srv://codertest:coder@coder.rhkkhfv.mongodb.net/college?retryWrites=true&w=majority&appName=Coder')

app.engine('handlebars', engine({
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}));
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.use(express.static(`${__dirname}/public`));
app.use(express.json());

app.use('/', userLogin);
app.use('/api/sessions',sessionsRouter);
app.use('/chat', chat);
app.use('/api/products', ProductsRouter);
app.use('/api/cart', CartRouter);
app.use('/realtimeproducts', realtime); // agrega productos en tiempo real pero al products.json
app.use('/p', hproducts)  // test
app.use('/pv2', productsv2) // agregar productos a MongoDB mediante modelo
app.use('/pv3', viewsrouter) // renderiza la vista de los productos de MongoDB

const server = app.listen(PORT, () => console.log(`listening on ${PORT}`));
const socketServer = new Server(server);

const messages = [];

socketServer.on('connection', (socketClient) => {
    console.log("client connected ID: ", socketClient.id);
    socketServer.emit('log', messages);

    socketClient.on('message', data => {
        messages.push(data);
        socketServer.emit('log', messages);
    });

    socketClient.on('addProduct', (product) => {
        const newProduct = {
            id: uuidv4(),
            title: product.title,
            description: product.description,
            code: product.code,
            price: product.price,
            quantity: product.quantity,
            category: product.category,
            status: product.status
        };
        const productsData = getProductsData();
        productsData.push(newProduct);
        setProductsData(productsData);
        socketServer.emit('updateProducts', productsData);
    });

    socketClient.on('deleteProduct', (productId) => {
        let productsData = getProductsData();
        productsData = productsData.filter(product => product.id !== productId);
        setProductsData(productsData);
        socketServer.emit('updateProducts', productsData);
    });

    socketClient.on('authenticated', data => {
        socketClient.broadcast.emit('newUserConnected', data);
    });
});
