const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/natan',{
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useCreateIndex: true,
});



// //add 1 data

// const contact1 = new Contact({
//     nama : 'mencobain2',
//     no : '70796756454',
//     email : 'mncobain@gmail.com'
// })

// //simpan data

// contact1.save().then((contact) => console.log(contact))