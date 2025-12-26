import { NestFactory } from '@nestjs/core';
import { InstaBatchModule } from './insta-batch.module';

async function bootstrap() {
  const app = await NestFactory.create(InstaBatchModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
