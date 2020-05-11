import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class WcaAuthGuard extends AuthGuard('wca') {}
