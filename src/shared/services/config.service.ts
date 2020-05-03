import * as dotenv from 'dotenv';

export class ConfigService {
  constructor() {
    dotenv.config({ path: `.${this.NODE_ENV}.env` });

    for (const key in process.env) {
      process.env[key] = process.env[key].replace(/\\n/g, '\n');
    }
  }

  get(key: string) {
    return process.env[key];
  }

  getNumber(key: string) {
    return Number(this.get(key));
  }

  get NODE_ENV() {
    return this.get('NODE_ENV') || 'development';
  }

  get AWS_CONFIG() {
    return {
      region: this.get('AWS_REGION'),
      accessKeyId: this.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.get('AWS_SECRET_ACCESS_KEY'),
    };
  }
}
