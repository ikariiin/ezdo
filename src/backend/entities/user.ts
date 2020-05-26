import { PrimaryGeneratedColumn, Column, Entity } from "typeorm";

@Entity("User")
export class User {
  @PrimaryGeneratedColumn({ name: "id" })
  id!: number;

  @Column({ name: "username", nullable: false })
  username!: string;

  @Column({ name: "password", nullable: false })
  password!: string;
}