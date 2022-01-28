/* eslint-disable no-console */

import './setup.js';
import app from './app.js';
import { autoRemove } from './controllers/statusController.js';

setInterval(autoRemove, 15000);

app.listen(5000, () => {
  console.log(`Server is listening on port 5000.
  Server running at ${process.env.NODE_ENV} mode`);
});
