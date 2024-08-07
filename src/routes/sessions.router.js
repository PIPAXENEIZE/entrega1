import { Router } from "express";
import jwt from 'jsonwebtoken';
import AuthService from "../services/AuthService.js";
import { usersService } from "../managers/index.js";
import usersModel from "../managers/mongo/user.model.js";

const sessionsRouter = Router();

sessionsRouter.post('/register', async (req, res) => {
    const { firstName, lastName, email, password, dateOfBirth } = req.body;

    // Verifica si el usuario ya existe
    const existingUser = await usersService.getUserByEmail(email);
    if (existingUser) {
        return res.status(400).send({ error: 'Email already in use' });
    }
    const authService = new AuthService();
    const hashedPassword = await authService.hashPassword(password);

    // Verifica que dateOfBirth esté definido
    if (!dateOfBirth) {
        return res.status(400).send({ error: 'dateOfBirth is required' });
    }

    // Crea una instancia del modelo de usuario
    const newUser = new usersModel({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        dateOfBirth: new Date(dateOfBirth)
    });

    try {
        // Calcula la edad antes de guardar
        newUser.calculateAge();
    } catch (error) {
        return res.status(400).send({ error: error.message });
    }

    const result = await usersService.createUser(newUser);
    res.sendStatus(201);
});

sessionsRouter.post('/login',async (req,res)=>{
    const {email,password} = req.body;
    const user = await usersService.getUserByEmail(email);
    const authService = new AuthService();
    const isValidPassword = await authService.validatePassword(password,user.password);
    if(!isValidPassword) {
        return res.send("Invalid credentials");
    }
    //Hasta aquí ya nos logueamos, creamos el objeto de session

    const userSession = { 
        id:user._id,
        name: user.firstName,
        lastName: user.lastName,
        email: user.email,
        age: user.age,
        registrationYear: new Date().getFullYear(),
        role: user.role
    }
    //creamos el primer token del usuario :) 
    const userToken = jwt.sign(userSession,'CoderSecret:)',{expiresIn:"1d"})
    console.log(userToken);
    res.cookie('tokencito',userToken).sendStatus(204);
})

sessionsRouter.get('/current',(req,res)=>{
     

});

sessionsRouter.get('/logout', (req, res) => {
    res.clearCookie('tokencito');
    res.redirect('/login');
});


export default sessionsRouter;