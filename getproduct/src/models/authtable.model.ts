import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Authtable extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  role: string;

  @property({
    type: 'string',
    required: true,
  })
  permission: string;

  @property({
    type: 'string',
    required: true,
  })
  property: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Authtable>) {
    super(data);
  }
}

export interface AuthtableRelations {
  // describe navigational properties here
}

export type AuthtableWithRelations = Authtable & AuthtableRelations;
