import { Controller, Post, Put, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Post('/login')
  login(@Req() req: Request, @Res() res: Response) {
    return this.accountService.login(req, res);
  }

  @Post('/signUp')
  signUp(@Req() req: Request, @Res() res: Response) {
    return this.accountService.signUp(req, res);
  }

  @Put('/reissue')
  refresh(@Req() req: Request, @Res() res: Response) {
    return this.accountService.refresh(req, res);
  }

  @Put('/code')
  sendEmail(@Req() req: Request, @Res() res: Response) {
    return this.accountService.sendEmail(req, res);
  }
}
