const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const adminSchema = new mongoose.Schema({
        name: { 
            type: String,
            required:true 
        },
        role: {
            type:String,
            required: true,
            enum: ['admin','super_admin']
        },
        username: {
            type:String,
            required: true,
            unique: true,
            minlength: 4,
            validate(value){
                if(value.length < 4){
                    throw new Error('Username cannot be less than four letters')
                }
            }
        },
        phone:{
            type:String,
            unique:true,
            required:true
        },
        
        email:{
            type:String,
            unique: true,
            required: true,
            validate(value){
                if(!validator.isEmail(value)){
                    throw new Error('Email is not valid')
                }
            }
        },
        last_login:{
            type: Date
        },
        PIN:{
            type: String,
            required: true,
            minlength: 4,
            validate(value){
                if(value.length < 4){
                    throw new Error('PIN cannot be less than four digits')
                }
            }
        },
        tokens: [{
            token: {
                type: String
            }
        }]
}, {
    timestamps: true
});


// function not return password and token from database when a req is made
adminSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()
    delete userObject.PIN
    delete userObject.tokens
    //delete userObject.role
    return userObject
}

// Generating User Token 
adminSchema.methods.generateAuthToken = async function(){
    const user = this;
    const token = jwt.sign(
        {
        _id: user._id.toString(),
        role:user.role,
        },
        process.env.SECRET, {expiresIn: '2d'} 
        );
    user.tokens = user.tokens.concat({ token });
    user.last_login = new Date()
    await user.save();
    return token;
}

// Finding User email and comparing hashed password Function for Login
adminSchema.statics.findByCredentials = async (username, PIN) =>{
    const user = await Admin.findOne({username})
    if(!user) throw new Error('Incorrect Username');

    const isMatch = await bcrypt.compare(PIN, user.PIN)
    if (!isMatch) throw new Error('Incorrect PIN');

    return user;
}


// Hashing the plain text password
adminSchema.pre('save', async function (next){
    const user = this;
    if (user.isModified('PIN')){
        user.PIN = await bcrypt.hash(user.PIN, 8)
    }
    next();
});

//Handling duplicate field errors
adminSchema.post('save', function (error, doc, next) {
    if(error.code && error.code == 11000){
        let key =  Object.keys(error.keyValue);
        console.log(key[0]);
        throw new Error(`${key[0]} has already been taken`);
    }
    next();
});
const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;