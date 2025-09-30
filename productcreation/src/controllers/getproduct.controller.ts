import {repository} from '@loopback/repository';
import {post, get, requestBody, param, HttpErrors} from '@loopback/rest';
import {AuthtableRepository,ProductRepository, UserproductRepository} from '../repositories';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'mysecretkey'; // replace with your real secret

export class GetproductController {
  constructor(
    @repository(AuthtableRepository)
    public authtableRepo: AuthtableRepository,
    @repository(ProductRepository)
    public productRepo: ProductRepository,
    @repository(UserproductRepository)
    public userproRepo: UserproductRepository
  ) {}

  @post('/products')
  async createProduct(
    @requestBody() userdata: any,
    @param.header.string('Authorization') authHeader: string,
  ) {
    const token = authHeader?.replace('Bearer ', '');
    if (!token) throw new HttpErrors.Unauthorized('Missing token');

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const {name, role} = decoded;

    // check in authtable for create permission
    const access = await this.authtableRepo.findOne({
      where: {name, role, property: 'create'},
    });

    if (!access || access.permission !== 'ALLOW') {
      throw new HttpErrors.Forbidden('Access denied for create');
    }

    const finalData={
      ...userdata,
      username:name,
      accesstype:'create'
    }
    const query=this.productRepo.create(finalData);
    await this.userproRepo.create(userdata);

    return {message: 'Product created successfully', userdata};
  }
}