import {
  post,
  requestBody,
  HttpErrors,
} from '@loopback/rest';
import {repository} from '@loopback/repository';
import jwt from 'jsonwebtoken';
import {AclRepository, AuthRepository} from '../repositories';
import {Auth} from '../models';

export class AuthController {
  constructor(
    @repository(AclRepository)
    public aclRepository: AclRepository,
    @repository(AuthRepository)
    public authRepository: AuthRepository,
  ) {}

  @post('/authorize', {
    responses: {
      '200': {
        description: 'User permissions inserted into authtable',
      },
    },
  })
  async authorize(
    @requestBody({
      description: 'JWT token for authorization',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              token: {type: 'string'},
            },
            required: ['token'],
          },
        },
      },
    })
    body: {token: string},
  ) {
    let payload: any;
    try {
      payload = jwt.verify(body.token, 'mysecretkey'); // use same secret as login microservice
    } catch (err) {
      throw new HttpErrors.Unauthorized('Invalid or expired token');
    }

    const userName = payload.name;
    const userRole = payload.role;

    if (!userName || !userRole) {
      throw new HttpErrors.BadRequest('Token missing required fields: name/role');
    }

    const aclRecords = await this.aclRepository.find({
      where: {role: userRole},
    });

    if (!aclRecords || aclRecords.length === 0) {
      throw new HttpErrors.Forbidden(`No ACL entries found for role: ${userRole}`);
    }

    await this.authRepository.deleteAll({name: userName});

    const insertData: Auth[] = aclRecords.map(rec => ({
      name: userName,
      role: rec.role,
      permission: rec.permission,
      property: rec.property,
    })) as Auth[];

    await this.authRepository.createAll(insertData);

    return {
      message: `Authorization successful for user: ${userName}`,
      role: userRole,
      permissionsInserted: insertData.length,
      data: insertData,
    };
  }
}
