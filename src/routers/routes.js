import { Router } from 'express';
import * as participantsController from '../controllers/participantsController.js';
import * as messagesController from '../controllers/messagesController.js';

const routes = new Router();

routes.post('/participants', participantsController.insert);
routes.get('/participants', participantsController.find);
routes.post('/messages', messagesController.insert);

export default routes;
