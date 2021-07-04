import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginUserDto {
  @IsEmail()
  email?: string;

  @IsNotEmpty()
  name?: string;

  @IsNotEmpty()
  password; string;
}