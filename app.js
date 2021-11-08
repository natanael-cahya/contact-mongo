const express = require('express')
const expressLayouts = require('express-ejs-layouts')
require('./utils/db')
const Contact = require('./model/contact')
const Mahasiswa = require('./model/mahasiswa')
const methodOverride = require('method-override')

const { body , validationResult , check} = require('express-validator')


const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')

const app = express()
const port = 3000;


app.set('view engine', 'ejs')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

//configurasi flash
app.use(cookieParser('cookie_secret'))
app.use(session({
    cookie: {maxAge : 6000},
    secret: 'cookie_secret',
    resave: true,
    saveUninitialized: true
}))
app.use(flash())

//halaman Home
app.get('/', async(req, res) => {
    const judul = 'Halaman Home'
    const mahasiswa = await Mahasiswa.find()
  
    res.render('index', { 
        layout : 'layouts/main-layout',
       mahasiswa, judul 
    })
    console.log(mahasiswa)

})

//halaman about
app.get('/about', (req, res) => {
    var judul = 'Halaman About'
    res.render('about', {
        layout : 'layouts/main-layout',
        judul })

})

//halaman contact
app.get('/contact', async(req, res) => {
   const contacts = await Contact.find()
 
    var judul = 'Halaman Contact'
    res.render('contact', { 
        layout : 'layouts/main-layout',
        contacts, 
        judul ,
        msg :req.flash('msg')
     })

})



app.get('/contact/add', (req,res) => {
    res.render('tb-contact', {
        judul: 'Tambah Data Contact',
        layout: 'layouts/main-layout'
    })
})

//proses tambah
app.post('/contact',[ 
    body('nama').custom(async(value) => {
        const duplikat = await Contact.findOne({nama : value})

        if(duplikat){
            throw new Error('Nama Kontak sudah digunakan!')
        }
        return true
    }),
    check('email','Email tidak valid!').isEmail(),
    check('no','No telp tidak Valid!').isMobilePhone('id-ID')
    ],(req,res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
       // return res.status(400).json({errors : errors})
       res.render('tb-contact',{
           judul : 'Form tambah kontak',
           layout : 'layouts/main-layout',
           errors : errors.array()
       })
    }else{
 Contact.insertMany(req.body , (error,result) => {
    //kirim flash
    req.flash('msg','Data Contact Berhasil diTambah')

    res.redirect('/contact')   
 })

    }
})

// app.get('/contact/delete/:nama', async(req,res) => {
//     const contact = await Contact.findOne({nama : req.params.nama})
//     //jika kontak gaada

//     if(!contact) {
//         res.status(404)
//         res.render('err',{
//             judul: '404',
//             layout: 'layouts/main-layout'
//         })
//     }else{
//        await Contact.deleteOne({nama :req.params.nama})
//         req.flash('msg','Data Contact Berhasil di Hapus')
//           res.redirect('/contact')
//     }
// })

app.delete('/contact',(req,res) => {
   Contact.deleteOne({nama :req.body.nama}).then((result) =>{
    req.flash('msg','Data Contact Berhasil di Hapus')
    res.redirect('/contact')
   })
 
})

app.get('/contact/edit/:nama',async(req,res) => {
    const contact = await Contact.findOne({nama : req.params.nama})

    res.render('edit-contact', {
        judul : 'Form Edit Contact',
        layout: 'layouts/main-layout',
        contact
    })
})

app.put('/contact',[ 
    body('nama').custom(async(value,{req}) => {
        const duplikat = await Contact.findOne({nama : value})

        if(value !== req.body.oldNama && duplikat){
            throw new Error('Nama Kontak sudah digunakan!')
        }
        return true
    }),
    check('email','Email tidak valid!').isEmail(),
    check('no','No telp tidak Valid!').isMobilePhone('id-ID')
    ],(req,res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
       res.render('edit-contact',{
           judul : 'Form Ubah Data kontak',
           layout : 'layouts/main-layout',
           errors : errors.array(),
           contact : req.body
       })
    }else{
    Contact.updateOne({ _id : req.body._id}, {
        $set: {
            nama: req.body.nama,
            email: req.body.email,
            no: req.body.no
        }
    }).then((result) => {
        req.flash('msg','Data Contact Berhasil diTambah')

        res.redirect('/contact')   
    })
    }
})


app.get('/contact/:nama', async (req, res) => {
    const contact = await Contact.findOne({nama : req.params.nama})
    var judul = 'Detail Contact'
    res.render('detail', { 
        layout : 'layouts/main-layout',
        contact, judul  })

})


app.listen(port, () => {
    console.log(`Mongo Contact APP | Berjalan Pada : https://localhost:${port}`)
})