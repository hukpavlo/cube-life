import { v4 as uuid } from 'uuid';
import { Schema } from 'dynamoose';
import { ModelDefinition } from 'nestjs-dynamoose';

export const UserModel: ModelDefinition = {
  name: 'users',
  schema: new Schema(
    {
      id: {
        type: String,
        hashKey: true,
        default: () => uuid(),
      },
      username: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: false,
      },
      confirmed: {
        type: Boolean,
        required: true,
      },
      confirmationCode: {
        type: String,
        required: false,
      },
      email: {
        type: String,
        required: true,
        index: {
          name: 'email-index',
          global: true,
          throughput: 5,
        },
        set: (email: string) => email.toLowerCase(),
      },
    },
    {
      saveUnknown: false,
      timestamps: true,
    },
  ),
  options: {
    create: false,
  },
};
