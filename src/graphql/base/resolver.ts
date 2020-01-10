import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';
import * as Boom from '@hapi/boom';
import BaseRepository from './repository';
import BaseEntity, { Result } from './model';

export default class BaseResolver<T> {
  constructor(
    private repository: BaseRepository<T>
  ) {}

  public save = async (req: T): Promise<BaseEntity[] | Boom> => {
    const data: InsertResult = await this.repository.save(req);
    if (!data?.raw) {
      return Boom.badRequest('Failed to create');
    }
    return data.raw as BaseEntity[];
  };

  public updateById = async (id: string, req: T): Promise<Result | Boom> => {
    const updatedEntity: UpdateResult = await this.repository.updateOneById(id, req);

    if (!updatedEntity?.affected) {
      return Boom.notFound(`Entity with id ${id} not found`);
    }

    return new Result(`${updatedEntity.affected} row updated`);
  };

  public getById = async (id: string): Promise<T | Boom> => {
    const entity: T | undefined = await this.repository.getOneById(id);
    if (!entity) {
      return Boom.notFound(`Entity with id ${id} not found`);
    }
    return entity;
  };

  public getAll = async (): Promise<T[] | Boom> => {
    const entities: T[] = await this.repository.getAll();

    if (!Array.isArray(entities)) {
      return Boom.notFound(`Entity not found`);
    }

    return entities;
  };

  public deleteById = async (id: string): Promise<Result | Boom> => {
    const entity: DeleteResult = await this.repository.deleteOneById(id);
    if (!entity?.affected) {
      return Boom.notFound(`Entity with id ${id} not found`);
    }

    return new Result(`${entity.affected} row deleted`);
  }
}
