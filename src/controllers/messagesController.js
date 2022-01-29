import dayjs from 'dayjs';
import Joi from 'joi';
import { ObjectId } from 'mongodb';
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
    const participantsAreOn = await connection.db
      .collection('participants')
      .find({ $or: [{ name: user }, { name: to }] })
      .toArray();
    if (
      (participantsAreOn.length < 2 && to !== 'Todos' && user !== to) ||
      (!participantsAreOn.length && user !== to)
    )
      return res.sendStatus(422);

    const message = {
      type,
      to,
      text: stripHtml(text).result.trim(),
      from: user,
      time: dayjs().format('HH:mm:ss'),
    };
    await connection.db.collection('messages').insertOne(message);
    await connection.mongoClient.close();
    return res.sendStatus(201);
  } catch (error) {
    console.error(error);
    connection.mongoClient.close();
    return res.sendStatus(500);
  }
}
export async function find(req, res) {
  const { user } = req.headers;
  let { limit } = req.query;
  try {
    await connection.mongoClient.connect();
    const messages = await connection.db
      .collection('messages')
      .find({ $or: [{ from: user }, { to: user }, { to: 'Todos' }] })
      .toArray();
    if (!limit) limit = messages.length;
    const limited = messages.slice(messages.length - limit);
    await connection.mongoClient.close();
    return res.send(limited);
  } catch (error) {
    console.error(error);
    connection.mongoClient.close();
    return res.sendStatus(500);
  }
}
export async function remove(req, res) {
  const { user } = req.headers;
  const { id } = req.params;

  try {
    await connection.mongoClient.connect();
    const message = await connection.db
      .collection('messages')
      .findOne({ _id: ObjectId(id) });
    if (!message) return res.sendStatus(404);
    if (message.from !== user) return res.sendStatus(401);
    await connection.db.collection('messages').deleteOne({ _id: ObjectId(id) });
    await connection.mongoClient.close();
    return res.sendStatus(204);
  } catch (error) {
    console.error(error);
    connection.mongoClient.close();
    return res.sendStatus(500);
  }
}

export async function update(req, res) {
  const { text, type, to } = req.body;
  const { user } = req.headers;
  const { id } = req.params;
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
    const participantsAreOn = await connection.db
      .collection('participants')
      .find({ $or: [{ name: user }, { name: to }] })
      .toArray();
    if (
      (participantsAreOn.length < 2 && to !== 'Todos' && user !== to) ||
      (!participantsAreOn.length && user !== to)
    )
      return res.sendStatus(422);
    const updatingMessage = await connection.db
      .collection('messages')
      .findOne({ _id: ObjectId(id) });
    if (!updatingMessage) return res.sendStatus(404);
    if (updatingMessage.from !== user) return res.sendStatus(401);
    const message = {
      type,
      to,
      text: stripHtml(text).result.trim(),
      from: user,
      time: dayjs().format('HH:mm:ss'),
    };
    await connection.db
      .collection('messages')
      .updateOne({ _id: ObjectId(id) }, { $set: message });
    await connection.mongoClient.close();
    return res.sendStatus(201);
  } catch (error) {
    console.error(error);
    connection.mongoClient.close();
    return res.sendStatus(500);
  }
}
