import express from 'express';
import { engine } from 'express-handlebars';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import __dirname from './utils.js';
import { Server } from 'socket.io';
import sessionsRouter from './routes/sessions.router.js';
import viewsRouter from './routes/views.router.js'
import CartRouter from './routes/cart.router.js';


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

app.use('/', viewsRouter);
app.use('/api/sessions',sessionsRouter);
app.use('/products', ProductsRouter)
app.use('/api/cart', CartRouter);

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

    socketClient.on('authenticated', data => {
        socketClient.broadcast.emit('newUserConnected', data);
    });
});
