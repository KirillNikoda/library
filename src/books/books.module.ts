import { forwardRef, Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookEntity } from './entities/book.entity';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [BooksController],
  providers: [BooksService],
  imports: [
    TypeOrmModule.forFeature([BookEntity]),
    forwardRef(() => UsersModule),
  ],
  exports: [BooksService],
})
export class BooksModule {}
