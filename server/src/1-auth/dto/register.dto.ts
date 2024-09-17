import { IsEmail, IsEmpty, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class registerDTO {
    @IsString()
    username: string;
  
    @IsEmail()
    @IsNotEmpty()
    email: string;
  
    @IsString()
    @IsNotEmpty()
    profile_picture:string;
  }
  