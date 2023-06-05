import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './decorators/public.decorator';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}
}
