import { sign, verify } from 'jsonwebtoken';
import { UserToken } from './interfaces';
import { Cache } from 'cache-manager';
import { ACCESS_SECRET, REFRESH_SECRET } from './config';

class jsonwebtoken {
  static sign(user: UserToken) {
    const payload = {
      uuid: user.uuid,
      username: user.username,
    };

    return sign(payload, ACCESS_SECRET, {
      expiresIn: '1h',
    });
  }

  static verify(token: string) {
    try {
      const decode = verify(token, ACCESS_SECRET) as UserToken;
      return {
        success: true,
        message: '',
        uuid: decode.uuid,
        username: decode.username,
      };
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  }

  static refresh(user: UserToken) {
    return sign({ uuid: user.uuid, username: user.username }, ACCESS_SECRET, {
      algorithm: 'HS256',
      expiresIn: '14d',
    });
  }

  static async refreshVerify(token: string, uuid: string, cache: Cache) {
    try {
      const userCache = await cache.get(uuid);
      if (userCache === token) {
        verify(token, REFRESH_SECRET);
        return true;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  }
}

export default jsonwebtoken;
