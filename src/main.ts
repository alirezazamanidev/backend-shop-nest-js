import './configs/env.config'
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import SwaggerConfig from './configs/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api');

  // validation config
  // swagger config
  SwaggerConfig(app);
  const {PORT}=process.env
  await app.listen(PORT,()=>{
    console.log(`server run => http://localhost:${PORT}/api`);
    console.log(`swagger run => http://localhost:${PORT}/swagger`);


  });
}
bootstrap();
