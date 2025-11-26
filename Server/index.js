import express, { json } from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import { MONGO_URI } from './config.js';


import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

import TodoModel from './models/Todo.js';
import EmployesModel from './models/Employes.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors(
  {origin:'http://localhost:5173',
  credentials:true
}
));
app.use(json());

connect(MONGO_URI)
app.use(cookieParser());

//logica de auth

const verifyToken = (req,res,next) =>{
  const accessToken = req.cookies.accessToken
  if(!accessToken){
    if(renewToken(req,res)){
      next();
    }
  }
  else{
    jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET,(err,decoded) =>{
      if(err){
        return res.json({valid:false,message:'Token no valido'});
      }
      else{
        req.legajo = decoded.legajo;
        req.rol = decoded.rol;
        next();
      }
    })
  }
}
app.get('/dashboard',verifyToken,(req,res) =>{
  
  return res.json({valid:true, message: 'Acceso al dashboard exitoso', legajo: req.legajo, rol: req.rol});
}) 
const renewToken = (req,res) =>{
  const refreshToken = req.cookies.refreshToken
  let exist =false;
  if(!refreshToken){
    return res.json({valid:false,message:'No hay refresh token'});
  } 
  else{
    jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,(err,decoded) => {
      if(err){
        return res.json({valid:false,message:'Refresh Token no valido'});
      }
      else{
        const accessToken = jwt.sign({ legajo: decoded.legajo, rol: decoded.rol },
        process.env.ACCESS_TOKEN_SECRET,{ expiresIn: '1m' });
        res.cookie('token',accessToken,{maxAge:"60000"})//milisegundos
        exist=true;
      }

    })
  } 
  return exist;     
}
  app.post('/login',(req,res) => { //error en request?
    const {legajo,password} = req.body;

  EmployesModel.findOne({ legajo })
  .then(response =>{
    if(!response){
      return  res.json({message: 'Legajo incorrecto', Login:false});
    }
    if(response.password !== password){
      return res.json({message: 'Password incorrecto', Login:false}); 
    }
    // Generar token JWT
    const accessToken = jwt.sign({ legajo: response.legajo, rol: response.rol },
      process.env.ACCESS_TOKEN_SECRET,{ expiresIn: '1m' });
    const refreshToken = jwt.sign({ legajo: response.legajo, rol: response.rol },
      process.env.REFRESH_TOKEN_SECRET,{ expiresIn: '2m' });

    res.cookie('accessToken',accessToken,{httpOnly:true, maxAge:"60000"})//milisegundos
    res.cookie('refreshToken',refreshToken,
      {httpOnly:true,maxAge:"120000",secure:true,sameSite:'strict'})

    return res.json({Login:true,message: 'Login exitoso', accessToken});
    })
  .catch(err => {
    res.json({Login:false,message: 'Login Error :', err});
  });
})



//logica del TODO
app.get('/get',(req,res) =>{
  TodoModel.find()
  .then(result => res.json(result))
  .catch(err => res.json(err));
})
app.put('/update/:id',(req,res) =>{
  const {id} = req.params;
  TodoModel.findByIdAndUpdate(id,{completed : true})
  .then(result => res.json(result))
  .catch(err => res.json(err));
}
)
app.delete('/delete/:id',(req,res) =>{
  const {id} = req.params;
  TodoModel.findByIdAndDelete(id)
  .then(result => res.json(result))
  .catch(err => res.json(err));
})
app.post('/add',(req,res) =>{
  const task = req.body.task;
  TodoModel.create({
    task : task
  }).then(result => res.json(result))
  .catch(err => res.json(err));
})

app.listen(3001,()=>{
  console.log("server is Running!")
})