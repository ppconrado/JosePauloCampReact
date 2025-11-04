if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
// VARIAVEIS DE INICIALIZACAO
const express = require('express');
const cors = require('cors');

const path = require('path');
const mongoose = require('mongoose');
// const ejsMate = require("ejs-mate"); // REMOVIDO: Não usaremos mais EJS
const session = require('express-session');
const flash = require('connect-flash'); // banner de mensagens
const ExpressError = require('./utils/ExpressError');

const methodOverride = require('method-override');
// USER AUTHENTICATION
const passport = require('passport');
const LocalStrategy = require('passport-local'); // username e password - auth
const User = require('./models/user');
//
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
// EXPRESS ROUTES
const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

// CONEXAO PARA SALVAR UMA EXPRESS SESSION NO MongoDB (MERN)
const MongoDBStore = require('connect-mongo')(session);

// BANCO DE DADOS (dev e prod)
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

// Remova as opções obsoletas e atualize a string de conexão
mongoose
  .connect(dbUrl)
  .then(() => {
    console.log('Banco de Dados conectado');
  })
  .catch((err) => {
    console.error('Erro na conexão com o banco de dados:', err);
  });

// CONECTANDO MONGOOSE
// mongoose.connect(dbUrl, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// logica de confirmacao da conexao com o DB.
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'erro de conexao:'));
db.once('open', () => {
  console.log('Banco de Dados conectado');
});

// EXPRESS
const app = express();

// CONFIGURAÇÃO DO REACT E CORS
app.use(
  cors({
    origin: 'http://localhost:5173', // Permite o acesso do servidor de desenvolvimento do Vite
    credentials: true, // Permite o envio de cookies (sessão)
  })
);
// MIDDLEWARE // express parse the body da requisicao - POST form application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
// SERVE ARQUIVOS ESTÁTICOS DO BACKEND (public)
app.use(express.static(path.join(__dirname, 'public')));
// MONGO SANITIZE
app.use(
  mongoSanitize({
    replaceWith: '_',
  })
);
// Adicione esta linha após as outras configurações do express
app.use(express.json());
// COOKIE dev e prod
const secret =
  process.env.SECRET || 'Cuidado com a exposicao da senha de acesso!';
// MONGODB EXPRESS SESSION
const store = new MongoDBStore({
  url: dbUrl,
  secret, // cookie
  touchAfter: 24 * 60 * 60, // lazy store
});

// MONGO EXPRESS SESSION - CONFIGURACAO
store.on('error', function (e) {
  console.log('ERRO NO ARMAZENAMENTO DA SESSION no DB', e);
});

const sessionConfig = {
  store,
  name: 'session',
  secret,
  resave: false,
  saveUninitialized: true,
  // cookie
  cookie: {
    httpOnly: true,
    // secure: true, - secure connections https
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
// EXPRESS SESSION
app.use(session(sessionConfig));
// FLASH MESSAGES - AVISOS
app.use(flash());
// HELMET - protege ao acesso de dados das requisicoes
app.use(helmet());

// MAPA MAPBOX URLs - tilesset
const scriptSrcUrls = [
  'https://stackpath.bootstrapcdn.com',
  'https://api.tiles.mapbox.com',
  'https://api.mapbox.com',
  'https://kit.fontawesome.com',
  'https://cdnjs.cloudflare.com',
  'https://cdn.jsdelivr.net',
];
const styleSrcUrls = [
  'https://kit-free.fontawesome.com',
  'https://stackpath.bootstrapcdn.com',
  'https://api.mapbox.com',
  'https://api.tiles.mapbox.com',
  'https://fonts.googleapis.com',
  'https://use.fontawesome.com',
];
const connectSrcUrls = [
  'https://api.mapbox.com',
  'https://*.tiles.mapbox.com',
  'https://events.mapbox.com',
];

// HELMET configuration - protege ao acesso de dados das requisicoes
const fontSrcUrls = [];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", 'blob:'],
      childSrc: ['blob:'],
      objectSrc: [],
      imgSrc: [
        "'self'",
        'blob:',
        'data:',
        'https://res.cloudinary.com/ppconrado/', // CONTA do CLOUDINARY!
        'https://images.unsplash.com',
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

// PASSPORT CONFIGURATION - Autenticacao do usuario
app.use(passport.initialize());
app.use(passport.session()); // express session
passport.use(new LocalStrategy(User.authenticate())); // mongoose local strategy(nome e senha)
passport.serializeUser(User.serializeUser()); // mongoose - storage a session
passport.deserializeUser(User.deserializeUser()); // mongoose - unstorage session

// FLASH Message Service ->  partials/flash.ejs - AVISOS
app.use((req, res, next) => {
  // Variaveis locais
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// ROTAS DE API
app.use('/api', userRoutes);
app.use('/api/campgrounds', campgroundRoutes);
app.use('/api/campgrounds/:id/reviews', reviewRoutes);

// ROTA DE FALLBACK PARA SERVIR O INDEX.HTML DO REACT
// Qualquer rota que não seja uma rota de API será tratada pelo React Router
app.get('*', (req, res) => {
  // Em produção, serviria o index.html do build do React
  // Por enquanto, vamos apenas garantir que o React lide com o roteamento
  res.send(
    'Frontend React em desenvolvimento. Use /api para acessar os endpoints.'
  );
});

// ROTAS ERRADAS (somente para API, o resto é tratado pelo React)
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh No, Alguma coisa deu errado!';
  res.status(statusCode).json({ error: err.message, statusCode });
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh No, Alguma coisa deu errado!';
  res.status(statusCode).json({ error: err.message, statusCode });
});

// SERVER API dev e prod - port config
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serviço disponível na PORTA ${port}`);
});
