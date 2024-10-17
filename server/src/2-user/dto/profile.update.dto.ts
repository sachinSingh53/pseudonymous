import { IsString } from "class-validator"

export class UpdateProfileDto {

    @IsString()
    displayName:string

    @IsString()
    bio:string

    @IsString()
    location:string

    @IsString()
    website:string

    @IsString()
    photoURL:string

    @IsString()
    wallpaper:string
}
  