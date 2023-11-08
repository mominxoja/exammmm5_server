import { BadRequestException, CanActivate,ExecutionContext, Injectable, NotFoundException } from "@nestjs/common";
import { CategoryService } from "src/category/category.service";
import { TransactionService } from "src/transaction/transaction.service";

@Injectable()
export class AuthorGuard implements CanActivate{
    constructor(
        private readonly transactionService: TransactionService,    
        private readonly categoryService: CategoryService 
    ){

    }
    async canActivate(context: ExecutionContext): Promise<boolean>{
        const request = context.switchToHttp().getRequest()
        const {id, tid, type} = request.params

        let entity

        switch (type) {
            
            case 'category':
                entity  = await this.categoryService.findOne(id)
                break;
            case 'transaction':
                entity = await this.transactionService.findOne(id, tid)
                
                break;
            
        
            default:
                throw new NotFoundException('Something went wronga')
        }

        const user = request.user

        if(entity && user &&entity.user.id === user.id){
             return true
        }

        throw new BadRequestException('Something went wrongq')

       
    }
}