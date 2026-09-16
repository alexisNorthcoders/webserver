const Logger = require('./logger');
const { app } = require('./server');
const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {

  Logger.logMessage(`Webserver is running on port ${PORT}`)
});