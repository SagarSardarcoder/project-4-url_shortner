const express = require('express');
const bodyParser = require('body-parser');
const route = require('./route/route.js');
const { default: mongoose } = require('mongoose');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect("mongodb+srv://uranium:uranium@cluster0.pgmlm.mongodb.net/project4urlshortner")
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )


app.use('/', route);
app.use((req, res, next) => {
    res.status(404).send({
        status: 404,
        error: `Not found ${req.url}`
        
    })
    next()
})

app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});
