import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Userproduct, UserproductRelations} from '../models';

export class UserproductRepository extends DefaultCrudRepository<
  Userproduct,
  typeof Userproduct.prototype.id,
  UserproductRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Userproduct, dataSource);
  }
}
