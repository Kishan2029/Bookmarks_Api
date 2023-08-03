import {
  ForbiddenException,
  Inject,
  Injectable,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: AuthDto) {
    try {
      // hash password
      const hash = await argon.hash(dto.password);
      // create a user
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });

      delete user.hash;
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
      console.log('error', error.code);
    }
  }

  async signin(dto: AuthDto) {
    try {
      // hash password
      const hash = await argon.hash(dto.password);
      // find a user
      const user = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });

      // user does not exist give an exception
      if (user === null) {
        throw new ForbiddenException('Credentials incorrect');
      }

      const passMatch = await argon.verify(user.hash, dto.password);
      if (!passMatch) throw new ForbiddenException('Credentials incorrect');
      delete user.hash;
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }
}
