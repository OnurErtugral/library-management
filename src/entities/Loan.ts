import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { Book } from "./Book";
import { User } from "./User";

@Entity("loans")
export class Loan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  bookId: number;

  @CreateDateColumn()
  borrowDate: Date;

  @Column({ nullable: true, type: "timestamptz" })
  returnDate: Date;

  @Column({ nullable: true, type: "int" })
  score: number;

  @ManyToOne(() => User, (user) => user.loans)
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToOne(() => Book, (book) => book.loans)
  @JoinColumn({ name: "bookId" })
  book: Book;
}
