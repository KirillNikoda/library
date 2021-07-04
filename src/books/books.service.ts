import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/createBook.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BookEntity } from './entities/book.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(BookEntity)
    private booksRepository: Repository<BookEntity>,
    private usersService: UsersService,
  ) {}

  async create(createBookDto: CreateBookDto) {
    try {
      console.log('test');
      return this.booksRepository.save(createBookDto);
    } catch (e) {
      throw new HttpException('Book was not created', HttpStatus.BAD_REQUEST);
    }
  }

  async borrow(req, bookId: number) {
    const [user, book] = await Promise.all([
      this.usersService.findOne(+req.user.id),
      this.booksRepository.findOne(bookId),
    ]);
    if (user.borrowedBooksAmount >= 5) {
      throw new HttpException(
        'You borrowed too many books',
        HttpStatus.BAD_REQUEST,
      );
    } else if (!user.hasSubscription) {
      throw new HttpException(
        "You don't have subscription to borrow books",
        HttpStatus.BAD_REQUEST,
      );
    } else if (book.isBusy) {
      throw new HttpException(
        "This book is already taken",
        HttpStatus.BAD_REQUEST,
      );
    }

    book.isBusy = true;
    await this.booksRepository.save(book);
    user.books.push(book);
    user.borrowedBooksAmount += 1;
    await this.usersService.create(user);
  }
}
