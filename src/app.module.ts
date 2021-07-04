import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';

@Module({
  imports: [TypeOrmModule.forRoot(), UsersModule, AuthModule, BooksModule],
})
export class AppModule {}
