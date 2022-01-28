import { Router } from 'express';
import * as participantsController from '../controllers/participantsController.js';
import * as messagesController from '../controllers/messagesController.js';
import * as statusController from '../controllers/statusController.js';

const routes = new Router();

routes.post('/participants', participantsController.insert);
routes.get('/participants', participantsController.find);
routes.post('/messages', messagesController.insert);
routes.get('/messages', messagesController.find);
routes.delete('/messages/:id', messagesController.remove);
routes.post('/status', statusController.insert);

export default routes;
