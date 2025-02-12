const { server } = require('./ws');
const Logger = require('./logger')
const PORT = process.env.PORT || 7000;

server.listen(PORT, () => {

  Logger.logMessage(`Webserver is running on port ${PORT}`)
});