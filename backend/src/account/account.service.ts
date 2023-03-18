import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import { AuthEntity } from 'src/entitys/auth.entity';
import { DatabasesEntity } from 'src/entitys/databases.entity';
import { decode } from 'jsonwebtoken';
import jwt from '../utils/jsonwebtoken';
import { hash } from 'src/utils/hash';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { UserToken } from 'src/utils/interfaces';
import nodeMailer from 'nodemailer'
import getRandom from 'src/utils/getRandom';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AuthEntity)
    private authRepository: Repository<AuthEntity>,
    @InjectRepository(DatabasesEntity)
    private databasesRepository: Repository<DatabasesEntity>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async login(req: Request, res: Response) {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Invalid login request. Username and password are required.',
      });
    } else {
      try {
        const user = await this.authRepository.findOneByOrFail({
          username,
        });
        if (hash(password + user.salt) === user.password) {
          const accessToken = jwt.sign({
            uuid: user.uuid,
            username: user.username,
          });
          
          const refreshToken = jwt.refresh({ uuid: user.uuid, username: user.username });
          this.cacheManager.set(user.uuid, refreshToken);

          return res.status(201).json({
            status: 201,
            success: true,
            tokens: {
              accessToken,
              refreshToken,
            },
          });
        } else {
          throw {
            status: 400,
            success: false,
            message: 'wrong password',
          };
        }
      } catch (err) {
        return res.status(err.status ? err.status : 500).json({
          status: err.status ? err.status : 500,
          success: err.success ? err.success : false,
          message: err.status ? err.status : 'Server Error',
        });
      }
    }
  }

  async refresh(req: Request, res: Response) {
    if (req.headers.authorization && req.headers.refresh) {
      const authToken = req.headers.authorization.split('Bearer ')[1];
      const refreshToken = req.headers.refresh;
      const authResult = jwt.verify(authToken);
      const decoded = decode(authToken) as UserToken;

      if (!decoded) {
        return res.status(200).json({
          status: 200,
          success: true,
          message: 'invaild token',
        });
      }

      const refreshResult = jwt.refreshVerify(
        String(refreshToken),
        decoded.uuid,
        this.cacheManager,
      );

      if (!authResult.success || authResult.message === 'jwt expired') {
        if (!refreshResult) {
          return res.status(401).json({
            success: false,
            status: 401,
            message: 'invaild token',
          });
        } else {
          const newAccessToken = jwt.sign({
            uuid: decoded.uuid,
            username: decoded.username,
          });
          return res.status(201).json({
            status: 201,
            success: true,
            tokens: {
              accessToken: newAccessToken,
              refreshToken,
            },
          });
        }
      } else {
        return res.status(200).json({
          status: 200,
          success: true,
          message: 'Access token is not expired!',
        });
      }
    } else {
      return res.status(200).json({
        status: 200,
        success: true,
        message: 'Access token and refresh token are need for refresh!',
      });
    }
  }

  async signUp(req: Request, res: Response) {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Invalid signUp request. Username, Password, Email are required.'
      })
    } else {
      try {
        const random = getRandom('all', 32);
        await this.authRepository.insert({ email, username, password: hash(password+random), salt: random })
        return res.status(200).json({
          status: 200,
          success: true,
          message: ''
        })
      } catch (err) {
        return res.status(500).json({
          status: 500,
          success: false,
          message: 'Server Error'
        })
      }
    }
  }

  async sendEmail(req: Request, res: Response) {
    const { email } = req.query

    if (!email) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Please enter your email address.'
      })
    } else {

      try {
        const transporter = nodeMailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: "your_email@gmail.com",
            pass: "your_password"
          },
        })

        const info = await transporter.sendMail({
          from: "your_email@gmail.com",
          to: String(email),
          subject: "", 
          text: "This is an automated email sent from CodeGPTChat", // plain text body
          html: "<b>This is an automated email sent from CodeGPTChat</b>", // html body
        });
      } catch (err) {

      }
    }
  }
}
