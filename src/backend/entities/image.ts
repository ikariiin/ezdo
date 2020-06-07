import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("Image")
export class Image {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public filePath!: string;

  @Column()
  public createdAt!: Date;

  @Column()
  public createdBy!: string;
}