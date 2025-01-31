import { Module } from '@nestjs/common';
import { GithubCli } from './github.command';
import { AppService } from './app.service';


@Module({
  providers: [GithubCli,AppService],
})
export class CliModule {}