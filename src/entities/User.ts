import {Entity, PrimaryGeneratedColumn, Column, PrimaryColumn} from "typeorm";

@Entity({name: "users"})
export class User {
  @PrimaryColumn()
  id: string;

  @Column({name: "firstname"})
  firstName: string;

  @Column({name: "lastname"})
  lastName: string;

  @Column()
  age: number;
}

