import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Authtable, AuthtableRelations} from '../models';

export class AuthtableRepository extends DefaultCrudRepository<
  Authtable,
  typeof Authtable.prototype.id,
  AuthtableRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Authtable, dataSource);
  }
}
