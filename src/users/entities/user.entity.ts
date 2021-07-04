import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BookEntity } from "../../books/entities/book.entity";

@Entity({name: "users"})
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;


  @Column({default: false})
  hasSubscription: boolean;

  @Column({default: 0})
  borrowedBooksAmount: number;

  @OneToMany(() => BookEntity, book => book.user)
  books: BookEntity[];
}
