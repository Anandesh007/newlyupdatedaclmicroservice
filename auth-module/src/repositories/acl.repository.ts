import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Acl, AclRelations} from '../models';

export class AclRepository extends DefaultCrudRepository<
  Acl,
  typeof Acl.prototype.id,
  AclRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Acl, dataSource);
  }
}
