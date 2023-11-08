import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ){}
  async create(createTransactionDto: CreateTransactionDto, id:number) {
    const newTransaction = {
      title: createTransactionDto.title,
      amount: createTransactionDto.amount,
      type: createTransactionDto.type,
      category: { id: +createTransactionDto.category },
      user: { id },
    }
      
    if(!newTransaction) throw new BadRequestException('Something went wrong')

    return await this.transactionRepository.save(newTransaction)
  }

  async findAll(id:number) {
    const transactions = this.transactionRepository.find({
      where:{
        user: { id }
      },
      relations: {
        category: true
      },
      order:{
        createdAt:'DESC'
      }
    })
    return transactions;
  }

  async findOne(id: number, tid:number){
    const transaction = await this.transactionRepository.findOne({
      where:{
        user:{id},
        id:tid
      },
      relations:{
        user:true,
        category:true
      },
    })

    if(!transaction) throw new NotFoundException('transaction not found')
    return transaction
  }

  async update(tid: number, updateTransactionDto: UpdateTransactionDto, id: number) {
    const transaction = await this.transactionRepository.findOne({
      where: { 
      user:{id},
      id:tid
       }
    })
    if(!transaction) throw new NotFoundException('Transaction not found')
    return await this.transactionRepository.update(tid, updateTransactionDto)
  }

  async remove(tid: number,  id: number) {
    const transaction = await this.transactionRepository.findOne({
      where: { 
      user:{id},
      id:tid
       }
    })
    if(!transaction) throw new NotFoundException('Transaction not found')
    return await this.transactionRepository.delete({id:tid})
  }

  async findAllWithPagenation(id: number, page:number, limit:number){
    const transactions = this.transactionRepository.find({
      where:{
        user: { id }
      },
      relations:{
        category:true,
        user:true
      },
      order:{
        createdAt:'DESC'
      },
      take: limit,
      skip:(page-1) * limit
    })
    return transactions;

  }

  async findAllByType(id: number, type:string){
    const transactions = this.transactionRepository.find({
      where : {
        user: {id},
        type
      },
    })

    const total = (await transactions).reduce((acc, obj)=> acc + obj.amount, 0)

    return total
  }
}
