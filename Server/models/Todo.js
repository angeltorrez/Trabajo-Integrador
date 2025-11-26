import mongoose from "mongoose"

const TodoSchema = new mongoose.Schema({
    task : String,
    completed:{
        type:Boolean,
        default:false
    }
    ,
    role: {
        type: String,
        default: ''
    }
})

const TodoModel = mongoose.model('todos',TodoSchema)
export default TodoModel;