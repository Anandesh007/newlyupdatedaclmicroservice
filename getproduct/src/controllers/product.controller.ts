import {repository} from '@loopback/repository';
import {get, param, HttpErrors} from '@loopback/rest';
import {AuthtableRepository, ProductRepository, UserproductRepository} from '../repositories';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'mysecretkey';

export class ProductController {
  constructor(
    @repository(AuthtableRepository)
    public authtableRepo: AuthtableRepository,
    @repository(ProductRepository)
    public productRepo: ProductRepository,
    @repository(UserproductRepository)
    public userproRepo: UserproductRepository
  ) {}

  @get('/products/{id}')
  async findProductById(
    @param.path.number('id') id: number,
    @param.header.string('Authorization') authHeader: string,
  ) {
    const token = authHeader?.replace('Bearer ', '');
    if (!token) throw new HttpErrors.Unauthorized('Missing token');

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const {name, role} = decoded;

    const access = await this.authtableRepo.findOne({
      where: {name, role, property: 'findById'},
    });

    if (!access || access.permission !== 'ALLOW') {
      throw new HttpErrors.Forbidden('Access denied for findById');
    }

    const product = await this.userproRepo.findById(id).catch(() => null);
    if (!product) {
      throw new HttpErrors.NotFound(`Product with id ${id} not found`);
    }

    const finalData={
        name: product.name,
        price: product.price,
        accesstype: 'findById',
        username: name};
    await this.productRepo.create(finalData);

    return {
      message: `Product found successfully`,
      data: {
        name: product.name,
        price: product.price,
      },
    };
  }
}
