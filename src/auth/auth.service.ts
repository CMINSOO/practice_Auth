import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { SignupDto } from './dtos/sign-up.dto';
import * as bcrypt from 'bcrypt'
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dtos/sign-in.dto';

@Injectable()
export class AuthService {
    constructor (
        @InjectRepository(User)
        private readonly userRepository:Repository<User>,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService
    ){}

    private async hashPassword(password:string){
        try{
            return bcrypt.hash(password,10);
        } catch (error){
            throw new InternalServerErrorException('비밀번호 해싱중 오류가 발생하였습니다')
        }
    }

    private async verifyPassword(inputPassword: string, password:string): Promise<void>{
        const isCurrentPasswordValid =bcrypt.compareSync(inputPassword, password);
        if(!isCurrentPasswordValid){
            throw new UnauthorizedException('비밀번호가 일치하지 않습니다.')
        }
    }

    
    private generateTokens(payload: {id:number, email:string}){
        try {
            const accessToken = this.jwtService.sign(payload)
            const refreshToken = this.jwtService.sign(payload, {
                secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
                expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES'),
            })
            return { accessToken, refreshToken };
        } catch (error) {
            throw new InternalServerErrorException('토큰 발급중 오류가 발생하였습니다.')
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
    
    async validateUser({email, password}: SignInDto){
        try{
            const user = await this.userRepository.findOne({
                where: {email, deletedAt:null},
                select: {id: true, password:true, email:true}
            });
            if(!user){
                return null
            }
            await this.verifyPassword(password, user.password);
            return { id:user.id, email: user.email}
        } catch(error){
            throw new UnauthorizedException('유효성 검사중 오류가 발생하였습니다.')
        }
    }
    
    async signIn(userId:number, email:string){
        const payload = {id:userId, email}
        return this.generateTokens(payload);
    }

}
 