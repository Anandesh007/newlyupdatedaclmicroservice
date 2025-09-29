import {repository} from '@loopback/repository';
import {del, param, HttpErrors} from '@loopback/rest';
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

  @del('/products/{id}')
  async deleteProduct(
    @param.path.number('id') id: number,
    @param.header.string('Authorization') authHeader: string,
  ) {
    const token = authHeader?.replace('Bearer ', '');
    if (!token) throw new HttpErrors.Unauthorized('Missing token');

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const {name, role} = decoded;

    // check in authtable for delete permission
    const access = await this.authtableRepo.findOne({
      where: {name, role, property: 'delete'},
    });

    if (!access || access.permission !== 'ALLOW') {
      throw new HttpErrors.Forbidden('Access denied for delete');
    }

    // Check if product exists
    const product = await this.userproRepo.findById(id).catch(() => null);
    if (!product) {
      throw new HttpErrors.NotFound(`Product with id ${id} not found`);
    }

    // Delete the product
    const deleted=await this.userproRepo.deleteById(id);

     const logData = {
      name:product.name,
      price:product.price,
      accesstype: 'delete',
      username: name
    };

    const query=this.productRepo.create(logData);

    return {message: `✅ Product with id ${id} deleted successfully`};
  }
}
