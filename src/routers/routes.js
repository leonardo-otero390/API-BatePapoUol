import { Router } from 'express';
import * as participantsController from '../controllers/participantsController.js';

const routes = new Router();

routes.post('/participants', participantsController.insertParticipant);

export default routes;
