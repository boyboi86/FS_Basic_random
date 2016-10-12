const express = require('express');
const fs = require('fs');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');
const sequelize = require('sequelize');
const cors = require('cors');
const http = require('http');

const db = require('./models/index');
const users = require('./routes/user');
const entries = require('./routes/entry');

const port = process.env.PORT || 3000;

const app = express();
const accessLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'})

app.use(logger('combined', { stream: accessLogStream }));
app.use(bodyParser.json({ type: '*/*' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/users', users);
app.use('/api/entries', entries);

/*Route reserved for all static assets must be last route to run */
// app.get('*', function(req, res){
//   res.sendFile(path.resolve(__dirname, './public/index.html'))
// });

/*Make life easier but less detailed.. runs server*/
db.sequelize.sync()
  .then(function() {
	app.listen(port, function() {
		console.log(`Express listening on port ${port}!`);
	});
})
.catch(function(err){
  console.error(err);
})
