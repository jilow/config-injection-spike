const express = require('express');
const inject = require('connect-inject');
const commandLineArgs = require('command-line-args');

const app = express();
const port = process.env.PORT || 8080;
const argOptions = [
  { name: 'config', type: String }
];
const args = commandLineArgs(argOptions);

const config = require(args.config);
const textConfig = JSON.stringify(config);

/* Inject config into requests */
app.use(inject({
  ignore: ['.js', '.css', '.svg', '.ico', '.woff', '.png', '.jpg', '.jpeg'],
  rules: [{
    snippet: `<script>window.env = window.env || {}; window.env.CONFIG=${textConfig}</script>`,
    match: /<\/head>/, // end of head
    fn: function append(w, s) {
      return w + s; // append snippet to matched
    }
  }]
}));

/* Serve static files on root */
app.use(express.static('./'));

/* Start the app */
app.listen(port, ()=>{
  console.log(`App is running on port ${port}`);
});