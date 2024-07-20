import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { SignupDto } from './dtos/sign-up.dto';
import * as bcrypt from 'bcrypt'
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
    constructor (
        @InjectRepository(User)
        private readonly userRepository:Repository<User>
    ){}

    private async hashPassword(password:string){
        try{
            return bcrypt.hash(password,10);
        } catch (error){
            throw new InternalServerErrorException('비밀번호 해싱중 오류가 발생하였습니다')
        }
    }

    async signUp({email, password, confirmPassword, username}: SignupDto){
        if(password !== confirmPassword){
            throw new BadRequestException('비밀번호가 일치하지 않습니다.')
        }
        try{
            const existUser = await this.userRepository.findOneBy({email})
            if(existUser){
                throw new BadRequestException('사용중인 이메일입니다.')
            }
            const hashedPassword = await this.hashPassword(password)
            const user = this.userRepository.create({
                email,
                password: hashedPassword,
                username,
            });
            await this.userRepository.save(user)
            return{ email: user.email}
            } catch (error){
            if(error instanceof BadRequestException){
                throw error
            }
            throw new InternalServerErrorException('회원가입중 오류가 발생하였습니다')
        }
    }
}
 