import * as dotenv from 'dotenv';

import { IAWSConfig } from 'src/interfaces/config';

export class ConfigService {
  constructor() {
    dotenv.config({ path: `.${this.NODE_ENV}.env` });

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
      region: this.get('AWS_REGION'),
      accessKeyId: this.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.get('AWS_SECRET_ACCESS_KEY'),
    };
  }
}
