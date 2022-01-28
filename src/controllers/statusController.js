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
