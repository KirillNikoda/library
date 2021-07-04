import { IsEmail, IsNotEmpty, isNotEmpty } from "class-validator";

export class RegisterUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  name: string;
}