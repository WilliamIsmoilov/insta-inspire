import { NestFactory } from '@nestjs/core';
import { InstaBatchModule } from './insta-batch.module';

async function bootstrap() {
  const app = await NestFactory.create(InstaBatchModule);
  await app.listen(process.env.PORT_BATCH ?? 3000);
}
bootstrap();
