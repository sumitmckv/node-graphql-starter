import {Entity, Column} from "typeorm";
import { Field, InputType, ObjectType } from 'type-graphql';
import BaseEntity from '../../base/model';

@ObjectType()
@Entity()
export default class User extends BaseEntity {
  @Field()
  @Column("varchar", { length: 50 })
  private firstName!: string;

  @Field()
  @Column("varchar", { length: 50 })
  private lastName!: string;

  @Field()
  @Column("date")
  private dob!: Date;

  @Column("jsonb", {nullable: true})
  private info?: any;
}

@InputType()
export class CreateUser {
  @Field()
  private firstName!: string;

  @Field()
  private lastName!: string;

  @Field()
  private dob!: Date;
}

@InputType()
export class UpdateUser {
  @Field({nullable: true})
  private firstName!: string;

  @Field({nullable: true})
  private lastName!: string;

  @Field({nullable: true})
  private dob!: Date;
}
