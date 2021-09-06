import { getCustomRepository } from 'typeorm';
import UserToken from '../typeorm/entities/UserToken';
import UserTokenRepository from '../typeorm/repositories/UserTokenRepository';

export default class UserTokenService {
  public async save(user_id: string): Promise<UserToken> {
    const userTokenRepositoy = getCustomRepository(UserTokenRepository);
    const userToken = await userTokenRepositoy.create({
      user_id,
    });
    await userTokenRepositoy.save(userToken);
    return userToken;
  }
}
