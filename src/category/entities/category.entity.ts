import { Transaction } from "src/transaction/entities/transaction.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, UpdateDateColumn, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";

@Entity('categoryentity')
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title:string;

    @ManyToOne(()=> User, (user)=> user.categories)
    @JoinColumn({name: 'user_id'})
    user:User

    @OneToMany(()=> Transaction, (transaction)=> transaction.category)
    @JoinColumn({name: 'transaction_id'})
    transactions:Transaction[]

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
