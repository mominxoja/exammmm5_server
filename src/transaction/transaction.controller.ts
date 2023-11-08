import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UsePipes,
	ValidationPipe,
	UseGuards,
	Req,
	Query,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { AuthorGuard } from 'src/guard/author.guard';

@Controller('transactions')
export class TransactionController {
	constructor(private readonly transactionService: TransactionService) {}

	@Post()
	@UsePipes(new ValidationPipe())
	@UseGuards(JwtAuthGuard)
	create(@Body() createTransactionDto: CreateTransactionDto, @Req() req) {
		return this.transactionService.create(
			createTransactionDto,
			+req.user.id,
		);
	}


  @Get(':type/find')
  @UseGuards(JwtAuthGuard)
  findAllByType(@Req() req, @Param('type') type:string){
    return this.transactionService.findAllByType(+req.user.id, type)
  }




  @Get('pagenation')
	@UseGuards(JwtAuthGuard)
	findAllWithPagenation(
		@Req() req,
		@Query('page') page: number,
		@Query('limit') limit: number,
	) {
		return this.transactionService.findAllWithPagenation(
			+req.user.id,
			page,
			+limit,
		);
	}



	@Get()
	@UseGuards(JwtAuthGuard)
	findAll(@Req() req) {
		return this.transactionService.findAll(req.user.id);
	}

	@Get(':type/:tid')
	@UseGuards(JwtAuthGuard, AuthorGuard)
	findOne(@Param('tid') tid: string, @Req() req) {
		return this.transactionService.findOne(+req.user.id, +tid);
	}

	@Patch(':type/:tid')
	@UseGuards(JwtAuthGuard, AuthorGuard)
	update(
		@Param('tid') tid: string,
		@Body() updateTransactionDto: UpdateTransactionDto,
		@Req() req,
	) {
		return this.transactionService.update(
			+tid,
			updateTransactionDto,
			+req.user.id,
		);
	}

	@Delete(':type/:tid')
	@UseGuards(JwtAuthGuard, AuthorGuard)
	remove(
		@Param('tid') tid: string,
		@Body() updateTransactionDto: UpdateTransactionDto,
		@Req() req,
	) {
		return this.transactionService.remove(+tid, +req.user.id);
	}


}
