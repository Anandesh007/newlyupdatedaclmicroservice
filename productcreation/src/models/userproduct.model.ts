import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Userproduct extends Entity {
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
    type: 'number',
    required: true,
  })
  price: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Userproduct>) {
    super(data);
  }
}

export interface UserproductRelations {
  // describe navigational properties here
}

export type UserproductWithRelations = Userproduct & UserproductRelations;
