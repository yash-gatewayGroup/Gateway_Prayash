const mongoose = require("mongoose")
const bcrypt = require('bcryptjs');
const { roles } = require('../constants/constants')
const dotenv = require("dotenv")
dotenv.config();
const Admin= process.env.ADMIN_EMAIL




const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: true
    },

    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },

    cpassword: {
        type: String,
        required: true
    },
    image:{
        type:String,
        // required:true
     default:"https://icons.veryicon.com/png/o/internet--web/55-common-web-icons/person-4.png"
    },
    Role: {
        type: String,
        enum: [roles.admin, roles.coremember, roles.member],
        default: roles.member

    },
    // RoomId: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Rooms"
    // }]

});
//we are hasing the password
userSchema.pre('save', async function (next) {
    //console.log('hello')
    if (this.isNew) {
        this.password = await bcrypt.hash(this.password, 12)
        this.cpassword = await bcrypt.hash(this.cpassword, 12)
        if (this.email === Admin) {
            this.Role = roles.admin
        }


    }

    next();

})
const User = mongoose.model('Users', userSchema);
module.exports = User;


