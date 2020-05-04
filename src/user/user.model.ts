import { Schema } from 'dynamoose';
import { ModelDefinition } from 'nestjs-dynamoose';

export const UserModel: ModelDefinition = {
  name: 'User',
  schema: new Schema(
    {
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
    },
    {
      timestamps: true,
    },
  ),
};
