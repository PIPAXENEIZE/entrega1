import { Router } from "express";
import jwt from 'jsonwebtoken';

const router = Router();

router.get('/',(req,res)=>{
    res.render('Home');
})

router.get('/login',(req,res)=>{
    res.render('Login');
})

router.get('/register',(req,res)=>{
    res.render('Register');
})

router.get('/profile', (req, res) => {
    const cookie = req.cookies['tokencito'];
    if (!cookie) {
        return res.redirect('/login'); // Redirige a la página de login si no hay cookie
    }
    try {
        const user = jwt.verify(cookie, 'CoderSecret:)');
        res.render('Profile', { name: user.name, role: user.role });
    } catch (error) {
        console.log(error);
        return res.redirect('/login'); // Redirige a la página de login si el token no es válido
    }
});

router.get('/chat', (req, res) => {
    res.render('Chat');
});


export default router;