import { PickType } from "@nestjs/swagger";
import { IsNotEmpty, IsStrongPassword } from "class-validator";
import { User } from "src/user/entities/user.entity";

export class SignupDto extends PickType(User, ['email', 'password','username']){

    @IsNotEmpty({message: '비밀번호를 입력해주세요'})
    @IsStrongPassword(
        {minLength: 6},
        {
            message: '6자이상 영 대소문자, 숫자, 특수문자를 포함하여야합니다'
        } 
    )
    confirmPassword:string;
}