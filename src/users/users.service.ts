import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterUserDto } from '../auth/dto/registerUser.dto';
import * as bcrypt from 'bcrypt';
import { deleteFields } from '../utils/deleteFields';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    const users = await this.usersRepository.find()
    users.forEach(user => deleteFields(user, 'password'));
    return users;
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    deleteFields(user, 'password');
    return user;
  }

  async create(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    registerUserDto.password = await bcrypt.hash(registerUserDto.password, 10);
    return await this.usersRepository.save(registerUserDto);
  }

  async checkIfUserExists(name?: string, email?: string): Promise<UserEntity | undefined> {
    return this.usersRepository.findOne({name, email});
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}