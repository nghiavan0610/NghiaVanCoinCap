import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './decorators/public.decorator';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Public()
    @Get('/')
    @Render('index')
    getHome() {
        return {};
    }

    @Public()
    @Get('/login')
    @Render('login/login')
    getLogin() {
        return {};
    }
}
