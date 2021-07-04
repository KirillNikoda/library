import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../../users/entities/user.entity";

@Entity({name: "books"})
export class BookEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  pagesAmount: number;

  @Column({default: false})
  isBusy: boolean;

  @ManyToOne(() => UserEntity, user => user.books)
  user: UserEntity;
}