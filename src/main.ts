import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('SERVER_PORT')

  app.useGlobalPipes(
    new ValidationPipe({
      // 요청 데이터를 DTO(Data Transfer Object) 클래스로 자동 변환
      transform: true,
      // DTO 클래스에 정의된 속성만 요청 데이터에 남기고, 나머지 속성은 제거
      whitelist: true,
      // DTO 클래스에 정의되지 않은 속성이 요청 데이터에 포함된 경우, 유효성 검사에서 에러를 발생
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(port);
}
bootstrap();
