import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, Column, ManyToOne } from 'typeorm';
import { Groups } from './groups';

@Entity("Todo")
export class Todo {
  @PrimaryGeneratedColumn({ name: "id" })
  id!: number;

  @Column({ name: "group" })
  group!: number;

  @Column({ name: "dueDate", nullable: false })
  dueDate!: Date;

  @Column({ name: "label" })
  label!: string;

  @Column({ name: "task" })
  task!: string;

  @Column({ name: "author" })
  author!: string;
}