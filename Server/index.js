const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TodoModel = require('./models/Todo');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://root:root@clustertest1.93hj08z.mongodb.net/TodoApp')

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