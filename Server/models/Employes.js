import mongoose from "mongoose";

const EmployesSchema = new mongoose.Schema({
    legajo: String,
    password:String,
    nombre: String,
    email: String,
    rol: String
    }
)
const EmployesModel = mongoose.model('employes',EmployesSchema);
export default EmployesModel;