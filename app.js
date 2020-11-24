const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require("express-session");
const AdminSchema = require('./models/Admin');
const BlogSchema = require('./models/Blog');
const blogsRouter = require('./routes/blogsRouter');
const Blog = require('./models/Blog');
const app = express();

// DB Config
const db = require('./config/keys').mongoURI;
// Connect to MongoDB
mongoose.connect(
    db,
    { useNewUrlParser: true ,useUnifiedTopology: true, useCreateIndex: true }
)
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));
mongoose.set('useCreateIndex', true);

// EJS
app.set('views', './views');
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: false }));

// middleware & static files(like .css or img) in public dir
app.use(express.static('./public/*'));
app.use(express.static(__dirname + '/public'));

// Sessions config
app.use(session({secret: "lechMistrzPolski", resave: true, saveUninitialized: true}));
session.adminIsLogged = false;

// Routes
app.get('/', (req, res) => {
    session.adminIsLogged = false;
    res.render('index', {
        Title: 'Strona główna'
    });
});
app.get('/blog', async (req, res) => {
    const blogs = await BlogSchema.find().sort({ createdAt: 'desc' });
    session.adminIsLogged = false;
    res.render('blog', {
        Title: 'Blog',
        blogs: blogs
    });
});
app.get('/login', (req, res) => {
    session.adminIsLogged = false;
    res.render('login', {
        Title: 'Zaloguj się',
        badData: ''
    });
});
app.get('/dashboard', (req, res) => {
    if(session.adminIsLogged) {
        res.render('dashboard', {
            Title: 'Admin panel',
            noBlog: '',
            adminReg: ''
        });
    } else {
        session.adminIsLogged = false;
        res.render('login', {
            Title: 'Zaloguj się',
            badData: 'Zaloguj się jako admin by mieć dostęp do panelu!'
        })
    }
});
app.post('/login', (req, res) => {
    const username = req.body.login;
    const password = req.body.password;
    AdminSchema.findOne({ login: username, password: {$eq: password} }).then(admin => {
        if(admin) {
            session.adminIsLogged = true;
            res.redirect('dashboard');
        } else {
            session.adminIsLogged = false;
            res.render('login', {
                Title: 'Zaloguj się',
                badData: 'Podaj prawidłowe dane!'
            });
        }
    }).catch(err => console.log(err));
    
});
app.post('/addAdmin', (req, res) => {
    const username = req.body.newAdminLogin;
    const password = req.body.newAdminPassword;
    if(username != '' && password != '') {
        AdminSchema.insertMany({
            login: username,
            password: password
        });
        res.render('dashboard', {
            Title: 'Admin panel',
            noBlog: '',
            adminReg: ''
        });
    } else {
        res.render('dashboard', {
            Title: 'Admin panel',
            noBlog: '',
            adminReg: 'Nie udało się dodać konta admina. Wypełnij formularz!'
        });
    }


});
app.use('/blogs', blogsRouter);

// Setpup PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));