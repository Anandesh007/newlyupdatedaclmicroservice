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
    // 🔐 Verify JWT token
    const token = authHeader?.replace('Bearer ', '');
    if (!token) throw new HttpErrors.Unauthorized('Missing token');

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const {name, role} = decoded;

    // 🔸 Check authtable for 'findById' permission
    const access = await this.authtableRepo.findOne({
      where: {name, role, property: 'findById'},
    });

    if (!access || access.permission !== 'ALLOW') {
      throw new HttpErrors.Forbidden('Access denied for findById');
    }

    // 📝 Fetch product by ID
    const product = await this.userproRepo.findById(id).catch(() => null);
    if (!product) {
      throw new HttpErrors.NotFound(`Product with id ${id} not found`);
    }

    // access control list
    const finalData={
        name: product.name,
        price: product.price,
        accesstype: 'findById',
        username: name};
    await this.productRepo.create(finalData);

    // ✅ Return full product details
    return {
      message: `✅ Product found successfully`,
      data: {
        name: product.name,
        price: product.price,
      },
    };
  }
}
