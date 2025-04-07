import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Loan } from "./Loan";

@Entity("books")
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: "float", nullable: true })
  score: number;

  @OneToMany(() => Loan, (loan) => loan.book)
  loans: Loan[];
}
