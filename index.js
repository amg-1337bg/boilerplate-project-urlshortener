require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const parser = require('body-parser');

let Urls = [
  {
    original_url : String,
    short_url : Number
  }
];

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});
// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

var urlencodedParser = parser.urlencoded({ extended: false })
app.post('/api/shorturl',urlencodedParser, (req, res) => {
  var url = req.body.url;
  var proto;
  try {
    proto = new URL(url);
    if (proto.protocol != 'https:' && proto.protocol != 'http:')
    {
      res.json({Error: 'invalid url'});
      return ;
    }
    const result = Urls.find( ({original_url}) => original_url == url);
    if (result)
      res.json(result);
    else {
      Urls.push({original_url: url, short_url: Urls.length});
      res.json(Urls[Urls.length - 1]);
    }
    return;
  } catch (e) {
    console.log("ECHECK ++++ ", e);
    res.json({Error: 'invalid url'});
    return ;
  }
});

app.get('/api/shorturl/:id', (req, res) => {
  const results = Urls.find( ({short_url}) => short_url === parseInt(req.params.id));
  console.log("id = ",parseInt(req.params.id));
  if (!results)
    res.json({error:"No short URL found for the given input"});
  else {
    console.log(Urls[results]);
    res.status(301);
    res.location(results['original_url']);
    console.log("response ==> ", res);
    res.send('');
  }

});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
