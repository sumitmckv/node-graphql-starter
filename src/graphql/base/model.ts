import {PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn} from "typeorm";
import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export default class BaseEntity {
  @Field(type => ID)
  @PrimaryGeneratedColumn("uuid")
  private id!: string;

  @Field()
  @CreateDateColumn({type: "timestamp"})
  private createdAt!: Date;

  @Field()
  @UpdateDateColumn({type: "timestamp"})
  private updatedAt!: Date;
}

@ObjectType()
export class Result {
  @Field()
  private result: string;

  constructor(result: string) {
    this.result = result;
  }
}
