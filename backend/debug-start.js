try {
  require('./server.js');
} catch (err) {
  require('fs').writeFileSync('error.json', JSON.stringify({message: err.message, stack: err.stack}));
}
