import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from "../users/users.module";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./jwt.strategy";

@Module({
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  imports: [UsersModule, PassportModule, JwtModule.register({
    secret: "secret",
    signOptions: {expiresIn: "1h"}
  })],
  exports: [AuthService, JwtModule]
})
export class AuthModule {}
