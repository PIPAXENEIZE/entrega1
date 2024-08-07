import mongoose from "mongoose";

const collection = 'Users';

const schema = new mongoose.Schema({
    firstName: {type:String, required:true},
    lastName: {type:String, required:true},
    email: {type: String, required:true, unique:true},
    password:{type:String, required:true},
    dateOfBirth: {type:Date, required:true},
    age: Number,
    registrationYear: {type: Number,default: new Date().getFullYear()},
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
})

schema.methods.calculateAge = function() {
    if (!this.dateOfBirth) {
        throw new Error("dateOfBirth is required to calculate age");
    }
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    if (isNaN(age) || age < 0) {
        throw new Error("Invalid dateOfBirth for age calculation");
    }

    this.age = age;
};

const usersModel = mongoose.model(collection, schema);

export default usersModel;
