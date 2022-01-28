import dayjs from 'dayjs';
import Joi from 'joi';
// eslint-disable-next-line import/no-unresolved
import { stripHtml } from 'string-strip-html';
import connection from '../database/connection.js';

export async function insert(req, res) {
  const schema = Joi.object({
    name: Joi.string().min(1).required(),
  });
  if (schema.validate(req.body).error !== undefined) return res.sendStatus(422);

  const name = stripHtml(req.body.name).result.trim();

  try {
    await connection.mongoClient.connect();
    const participantWithThisName = await connection.db
      .collection('participants')
      .findOne({ name });
    if (participantWithThisName) return res.sendStatus(409);
    await connection.db
      .collection('participants')
      .insertOne({ name, lastStatus: Date.now() });
    await connection.db.collection('messages').insertOne({
      from: name,
      to: 'Todos',
      text: 'entra na sala...',
      type: 'status',
      time: dayjs().format('HH:mm:ss'),
    });
    connection.mongoClient.close();
    return res.sendStatus(201);
  } catch (error) {
    console.error(error);
    connection.mongoClient.close();
    return res.sendStatus(500);
  }
}
export async function find(req, res) {
  try {
    await connection.mongoClient.connect();
    const participants = await connection.db
      .collection('participants')
      .find({}, { projection: { _id: 0 } })
      .toArray();
    connection.mongoClient.close();
    return res.send(participants);
  } catch (error) {
    console.error(error);
    connection.mongoClient.close();
    return res.sendStatus(500);
  }
}
