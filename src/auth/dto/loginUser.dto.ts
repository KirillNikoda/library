import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginUserDto {
  @IsEmail()
  email?: string;

  name?: string;

  @IsNotEmpty()
  password: string;

}