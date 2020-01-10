import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import User, { CreateUser, UpdateUser } from './types';
import Boom = require('@hapi/boom');
import BaseResolver from '../../base/resolver';
import BaseEntity, { Result } from '../../base/model';
import BaseRepository from '../../base/repository';
import { getRepository } from 'typeorm';

@Resolver(User)
export class UserResolver {
  private resolver: BaseResolver<User>;
  constructor() {
    this.resolver = new BaseResolver<User>(
      new BaseRepository<User>(getRepository(User))
    );
  }

  @Query(() => User)
  public async user(@Arg("id") id: string): Promise<User | Boom> {
    return this.resolver.getById(id);
  }

  @Query(() => [User])
  public async users(): Promise<User[] | Boom> {
    return this.resolver.getAll();
  }

  @Mutation(() => [BaseEntity])
  public async createUser(@Arg("req") req: CreateUser): Promise<BaseEntity[] | Boom> {
    return this.resolver.save(req as any);
  }

  @Mutation(() => Result)
  public async updateUser(@Arg("id") id: string, @Arg("req") req: UpdateUser): Promise<Result | Boom> {
    return this.resolver.updateById(id, req as any);
  }

  @Mutation(() => Result)
  public async deleteUser(@Arg("id") id: string): Promise<Result | Boom> {
    return this.resolver.deleteById(id);
  }
}
