import { Schema } from 'dynamoose';
import { SchemaDefinition } from 'dynamoose/dist/Schema';

const attributes: SchemaDefinition = {
  id: {
    type: String,
    hashKey: true,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
  },
};

export const UserSchema = new Schema(attributes);
