import { Router } from "express";
import jwt from 'jsonwebtoken';
import path from 'path';
import __dirname from "../utils.js";

const router = Router();

router.get('/',(req,res)=>{
    res.render('Home');
})

router.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

router.get('/login', (req, res) => {
    const cookie = req.cookies['tokencito'];
    if (cookie) {
        try {
            jwt.verify(cookie, 'CoderSecret:)');
            return res.redirect('/profile'); // Redirige al perfil si hay una cookie válida
        } catch (error) {
            console.log(error);
        }
    }
    res.render('Login');
});

router.get('/register', (req, res) => {
    const cookie = req.cookies['tokencito'];
    if (cookie) {
        try {
            jwt.verify(cookie, 'CoderSecret:)');
            return res.redirect('/profile'); // Redirige al perfil si hay una cookie válida
        } catch (error) {
            console.log(error);
        }
    }
    res.render('Register');
});

router.get('/profile', (req, res) => {
    const cookie = req.cookies['tokencito'];
    if (!cookie) {
        return res.redirect('/login'); // Redirige a la página de login si no hay cookie
    }
    try {
        const user = jwt.verify(cookie, 'CoderSecret:)');
        res.render('Profile', user);
    } catch (error) {
        console.log(error);
        return res.redirect('/login'); // Redirige a la página de login si el token no es válido
    }
});

router.get('/chat', (req, res) => {
    res.render('Chat');
});


export default router;