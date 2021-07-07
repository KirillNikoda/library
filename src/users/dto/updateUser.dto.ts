import { IsBoolean, IsEmail, IsNumber, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  password?: string;

  @IsString()
  name: string;

  @IsBoolean()
  hasSubscription: boolean;

  @IsNumber()
  borrowedBooksAmount: number;
}