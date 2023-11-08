import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { AuthModule } from './auth/auth.module';
import { TransactionModule } from './transaction/transaction.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [UserModule, CategoryModule, AuthModule, TransactionModule, ConfigModule.forRoot({isGlobal: true}),
  TypeOrmModule.forRoot({
    type:'postgres',
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities:[__dirname+'/**/*.entity{.js, .ts}'],
    synchronize:true
  })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
