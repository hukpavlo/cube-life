import * as dotenv from 'dotenv';

import { IAWSConfig } from './interfaces/config';

export class ConfigService {
  constructor() {
    dotenv.config({ path: `.env.${this.NODE_ENV}` });

    for (const key in process.env) {
      process.env[key] = process.env[key].replace(/\\n/g, '\n');
    }
  }

  get(key: string): string {
    return process.env[key];
  }

  getNumber(key: string): number {
    return Number(this.get(key));
  }

  get NODE_ENV(): string {
    return this.get('NODE_ENV') || 'development';
  }

  get AWS_CONFIG(): IAWSConfig {
    return {
      region: this.get('REGION'),
      accessKeyId: this.get('ACCESS_KEY_ID'),
      secretAccessKey: this.get('SECRET_ACCESS_KEY'),
    };
  }
}
