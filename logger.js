class Logger {
    static logRequest(req, res, next) {
      const timestamp = new Date().toLocaleString();
      const { method, url, headers, body } = req;
      const userAgent = headers['user-agent'] || 'N/A';
      
      console.log(
        `[${timestamp}] | ${method} | ${url} | user-agent: ${JSON.stringify(userAgent)} | Body: ${JSON.stringify(body)}`
      );
      
      next();
    }

    static logMessage(message) {
        const timestamp = new Date().toLocaleString();
        console.log(`[${timestamp}] | ${message}`);
      }
  }
  
  module.exports = Logger;