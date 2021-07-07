import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterUserDto } from '../auth/dto/registerUser.dto';
import { deleteFields } from '../utils/deleteFields';
import { BooksService } from "../books/books.service";
import { UpdateUserDto } from "./dto/updateUser.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  // Injecting UserRepository in order to work with users table in db
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @Inject(forwardRef(() => BooksService)) private booksService: BooksService
  ) {}

  async findAll(): Promise<UserEntity[]> {
    const users = await this.usersRepository.find()
    users.forEach(user => deleteFields(user, 'password'));
    return users;
  }
  async findOne(id: number): Promise<UserEntity> {
    const user = await this.usersRepository.findOne(id, { relations: ["books"]});
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    deleteFields(user, 'password');
    return user;
  }

  async create(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    return await this.usersRepository.save(registerUserDto);
  }

  async update(updateUserDto: UpdateUserDto, id: number): Promise<UserEntity> {
    const user = await this.usersRepository.findOne(id);
    let newPassword = user.password;
    if (updateUserDto.password) {
      newPassword = await bcrypt.hash(updateUserDto.password, 10);
    }
    user.password = newPassword;
    const userToSend = await this.usersRepository.save(user);
    deleteFields(userToSend, "password");
    return userToSend;
  }

  // Checking func for auth part of application
  async checkIfUserExists(email: string): Promise<UserEntity | undefined> {
    return this.usersRepository.findOne({email});
  }

  async remove(id: number): Promise<void> {
    const user = await this.usersRepository.findOne(id, {relations: ["books"]});
    // Changing status of every book that user borrowed to NOT busy.
    try {
      await this.usersRepository.delete(id);
      await Promise.all(user.books.map(book => {
        book.isBusy = false;
        book.user = null;
        this.booksService.create(book);
      }))
    } catch (e) {
     throw new HttpException("Error while deleting user", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Indicates if user has subscription or not
  async getSubscriptionInfo(id: number) {
    const user = await this.usersRepository.findOne(id);
    return {
      subscription: user.hasSubscription
    }
  }
}