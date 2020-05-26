import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./user";

@Entity("Groups")
export class Groups {
  @PrimaryGeneratedColumn({ name: "id" })
  id!: number;

  @Column({ name: "name", nullable: false })
  name!: string;

  @Column({ name: "createdBy", nullable: false })
  createdBy!: string;
}