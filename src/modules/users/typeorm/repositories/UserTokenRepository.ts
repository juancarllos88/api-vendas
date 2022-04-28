import { EntityRepository, Repository } from 'typeorm';
import UserToken from '../entities/UserToken';

@EntityRepository(UserToken)
export default class UserTokenRepository extends Repository<UserToken> {
  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = await this.findOne({
      where: {
        token,
      },
    });
    return userToken;
  }
}
