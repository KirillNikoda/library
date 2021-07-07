import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Put,
  Req,
  UseGuards
} from "@nestjs/common";
import { UsersService } from './users.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserDto } from "./dto/updateUser.dto";

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getUsers() {
    return this.usersService.findAll();
  }

  @Get(":id/subscription")
  getSubscriptionInfo(@Param("id", ParseIntPipe) id: number) {
    return this.usersService.getSubscriptionInfo(id);
  }

  @Get(':id')
  getOneUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number, @Req() req) {
    if (+req.user.id !== id) {
      throw new HttpException(
        'You are not permitted to delete this profile',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return this.usersService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  updateUser(@Req() req, @Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    if (+req.user.id !== id) {
      throw new HttpException(
        'You are not permitted to update this profile',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return this.usersService.update(updateUserDto, id);
  }
}
