import { IsEmail, IsEmpty, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";
//for google
export class loginDTO {
  
    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @IsStrongPassword()
    password:string;
  }
  