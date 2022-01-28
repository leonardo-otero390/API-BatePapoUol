import dayjs from 'dayjs';
import Joi from 'joi';
import connection from '../database/connection.js';

export async function insert(req, res) {
  const { user } = req.headers;
  const schema = Joi.object({
    user: Joi.string().required(),
  });
  if (schema.validate({ user }).error !== undefined) {
    return res.sendStatus(404);
  }
  try {
    await connection.mongoClient.connect();
    const update = await connection.db
      .collection('participants')
      .findOneAndUpdate(
        { name: user },
        { $set: { lastStatus: Date.now() } },
        { returnNewDocument: true }
      );
    if (!update.value) return res.sendStatus(404);
    connection.mongoClient.close();
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    connection.mongoClient.close();
    return res.sendStatus(500);
  }
}
function creatLeaveRoomMessage(from) {
  return {
    from,
    to: 'Todos',
    text: 'sai da sala...',
    type: 'status',
    time: dayjs().format('HH:mm:ss'),
  };
}

export async function autoRemove() {
  const SECONDS = 1000;
  const lastValidStatus = Date.now() - 10 * SECONDS;
  try {
    await connection.mongoClient.connect();
    const afkParticipants = await connection.db
      .collection('participants')
      .find(
        { lastStatus: { $lt: lastValidStatus } },
        { projection: { _id: 1, name: 1 } }
      )
      .toArray();
    if (!afkParticipants.length) return;
    const akfParticipantsIds = afkParticipants.map(({ _id }) => _id);
    await connection.db
      .collection('participants')
      .deleteMany({ _id: { $in: akfParticipantsIds } });
    const messages = afkParticipants.map(({ name }) =>
      creatLeaveRoomMessage(name)
    );
    await connection.db.collection('messages').insertMany(messages);
    connection.mongoClient.close();
  } catch (error) {
    console.log(error);
    connection.mongoClient.close();
  }
}
