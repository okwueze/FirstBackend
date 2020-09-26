const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const cors = require('cors');
const app = express();
// require('dotenv').config();
//const db_name = process.env.MONGODBNAMESTAGING
// const db_name = process.env.MONGODBNAME;
// const db_pwd = process.env.DBPWD;

dbUrl = encodeURI(`mongodb+srv://Mechano:Frank1998@cluster0.gsa6d.gcp.mongodb.net/<rubric>?retryWrites=true&w=majority`);
//connecting to mongo database
mongoose.connect(dbUrl, {
  useNewUrlParser:true,
  useFindAndModify:false,
  useCreateIndex:true,
  useUnifiedTopology: true
})
.then(() => console.log('Mongo DB connected'))
.catch(err => console.log (err));

const port = process.env.PORT || 7800;

// cors middleware 
app.use(cors());

// static folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

//body parse middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//importing routes
// const teachers = require('./src/routes/teachers');
// const skillup = require('./src/routes/skillip.route');
const admin = require('./routes/admin.routes');

//public routes
// app.use('/api/v1/teachers', teachers);
app.use('/api/v1/admin', admin);
// app.use('/api/v1/skillup', skillup);

app.get('/', (req, res) => {
    res.status(202).send('');
})

app.listen(port, () => {
    console.log('F**king on the Holy port ' + port);
});

