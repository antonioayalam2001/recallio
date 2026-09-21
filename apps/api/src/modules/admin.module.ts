import { Module } from '@nestjs/common';
import { AdminController } from '../infrastructure/http/admin/admin.controller';
import { CreateInvitationUseCase } from '../core/application/admin/create-invitation.use-case';
import { AcceptInvitationUseCase } from '../core/application/admin/accept-invitation.use-case';
import { PrismaInvitationRepository } from '../infrastructure/database/repositories/prisma-invitation.repository';
import { IInvitationRepository } from '../core/domain/repositories/invitation.repository.interface';
import { PrismaService } from '../infrastructure/database/prisma.service';
import { AuthModule } from './auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AdminController],
  providers: [
    PrismaService,
    {
      provide: IInvitationRepository,
      useClass: PrismaInvitationRepository,
    },
    CreateInvitationUseCase,
    AcceptInvitationUseCase,
  ],
})
export class AdminModule {}
