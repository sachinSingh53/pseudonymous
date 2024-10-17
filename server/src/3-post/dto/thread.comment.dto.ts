import { IsArray, IsEmail, IsEmpty, IsNotEmpty, IsNumber, IsString, IsStrongPassword } from "class-validator";

export class ThreadCommentDTO {
    // @IsNumber()
    // commentId:number

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

    // @IsEmpty()
    // @IsString()
    // created_at: string
}
  