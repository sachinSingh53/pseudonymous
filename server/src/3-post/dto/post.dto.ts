import { IsArray, IsEmail, IsEmpty, IsNotEmpty, IsNumber, IsString, IsStrongPassword } from "class-validator";
//for google
export class postDTO {
    @IsString()
    altText:string

    @IsString()
    text:string

    @IsString()
    image:string

    @IsArray()
    likes:[]

    @IsNumber()
    senderId:number

    @IsString()
    created_at: string
}
  