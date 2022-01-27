import dayjs from 'dayjs';
import Joi from 'joi';
import connection from '../database/connection.js';

export async function insertParticipant(req, res) {
  const schema = Joi.object({
    name: Joi.string().min(1).required(),
  });
  if (schema.validate(req.body).error !== undefined) return res.sendStatus(422);

  const { name } = req.body;

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
    await connection.mongoClient.close();
    return res.sendStatus(201);
  } catch (error) {
    console.error(error);
    await connection.mongoClient.close();
    return res.sendStatus(500);
  }
}
