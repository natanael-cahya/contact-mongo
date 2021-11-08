const mongoose = require('mongoose')

//membuat Schema
const Contact = mongoose.model('Contact', {
    nama : {
        type: String,
        required:true,
    },
    no : {
        type: String,
        required : true,
    },
    email : {
        type: String,
        required: true,
    },

})



module.exports = 
    Contact
;