import { Inject, Injectable, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}

  signup() {
    return { msg: 'I am signup' };
  }

  signin() {
    return 'I am signin';
  }
}
