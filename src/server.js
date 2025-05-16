import app from './app.js';
import logger from './utils/logger.js';
const PORT = process.env.PORT || 3223;

app.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
});
