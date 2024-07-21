import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Role } from "../types/roles.type";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn({unsigned: true})
    id:number;

    @IsString()
    @Column()
    username:string;

    @IsNotEmpty({message: '이메일을 입력해주세요'})
    @IsEmail({})
    @Column()
    email: string;

    @IsNotEmpty({message: "비밀번호를 입력해주세요"})
    @IsStrongPassword(
        {minLength: 6}
    )
    @Column({select: false})
    password: string;

    @Column({type :'enum', enum:Role, default: Role.UnverifiedUser})
    role: Role;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn({ select: false})
    deletedAt?: Date;
}