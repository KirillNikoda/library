import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/registerUser.dto';
import { UserEntity } from '../users/entities/user.entity';
import { deleteFields } from '../utils/deleteFields';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from './dto/loginUser.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    const notValid = await this.usersService.checkIfUserExists(
      registerUserDto.email
    );

    if (notValid) {
      throw new HttpException(
        'User with this name already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    registerUserDto.password = await bcrypt.hash(registerUserDto.password, 10);
    const user = await this.usersService.create(registerUserDto);
    deleteFields(registerUserDto, 'password');
    return user;
  }

  async login(
    loginUserDto: LoginUserDto,
  ): Promise<UserEntity & { token: string }> {
    const isValid = await this.usersService.checkIfUserExists(
      loginUserDto.email,
    );

    if (!isValid) {
      throw new HttpException(
        'User with this name/email does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    const isCorrectPassword = await bcrypt.compare(
      loginUserDto.password,
      isValid.password,
    );

    if (!isCorrectPassword) {
      throw new HttpException('Incorrect credentials', HttpStatus.FORBIDDEN);
    }

    deleteFields(isValid, 'password');

    const payload = {
      name: isValid.name,
      id: isValid.id,
      email: isValid.email,
    };

    return {
      ...isValid,
      token: this.jwtService.sign(payload),
    };
  }
}
