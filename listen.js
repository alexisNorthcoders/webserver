const { server } = require('./ws');
const PORT = process.env.PORT || 7000;

server.listen(PORT, () => {
  console.log(`Clipboard Server is running on port ${PORT}`);
});