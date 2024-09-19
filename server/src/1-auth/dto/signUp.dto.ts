import { IsEmail, IsEmpty, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";
//for google
export class signUpDTO {
    @IsString()
    username: string;

    @IsString()
    name: string;
  
    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @IsStrongPassword()
    password:string;
  }
  