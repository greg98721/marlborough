import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { doSomething, doSomethingMore } from '@marlborough/model';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    const s = doSomething();
    const b = doSomethingMore();
    return this.appService.getHello();
  }
}
