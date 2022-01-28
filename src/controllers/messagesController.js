import dayjs from 'dayjs';
import Joi from 'joi';
// eslint-disable-next-line import/no-unresolved
import { stripHtml } from 'string-strip-html';
import connection from '../database/connection.js';

export async function insert(req, res) {
  const { text, type, to } = req.body;
  const { user } = req.headers;
  const schema = Joi.object({
    user: Joi.string().required(),
    type: Joi.string().required().valid('message', 'private_message'),
    text: Joi.string().required().min(1),
    to: Joi.string().required().min(1),
  });
  if (schema.validate({ ...req.body, user }).error !== undefined) {
    return res.sendStatus(422);
  }

  try {
    await connection.mongoClient.connect();

    const participantIsOn = await connection.db
      .collection('participants')
      .findOne({ name: user });
    if (!participantIsOn) return res.sendStatus(422);
    const message = {
      type,
      to,
      text: stripHtml(text).result.trim(),
      from: user,
      time: dayjs().format('HH:mm:ss'),
    };
    await connection.db.collection('messages').insertOne(message);
    connection.mongoClient.close();
    return res.sendStatus(201);
  } catch (error) {
    console.error(error);
    connection.mongoClient.close();
    return res.sendStatus(500);
  }
}
