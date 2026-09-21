import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { CreateInvitationUseCase } from '../../../core/application/admin/create-invitation.use-case';
import { AcceptInvitationUseCase } from '../../../core/application/admin/accept-invitation.use-case';
import { CreateInvitationDto, AcceptInvitationDto } from './dto/admin.dto';
import { JwtAuthGuard } from '../../security/jwt-auth.guard';
import { RolesGuard } from '../../security/roles.guard';
import { Roles } from '../../security/roles.decorator';
import { CurrentUser } from '../../security/current-user.decorator';
import { Role } from '@prisma/client';
import { IInvitationRepository } from '../../../core/domain/repositories/invitation.repository.interface';
import { Inject } from '@nestjs/common';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly createInvitationUseCase: CreateInvitationUseCase,
    private readonly acceptInvitationUseCase: AcceptInvitationUseCase,
    @Inject(IInvitationRepository) private readonly invitationRepository: IInvitationRepository,
  ) {}

  @Post('invitations')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async createInvitation(
    @Body() dto: CreateInvitationDto,
    @CurrentUser() admin: { userId: string },
  ) {
    return this.createInvitationUseCase.execute(admin.userId, dto.email, dto.targetUserId);
  }

  @Get('invitations')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getInvitations() {
    return this.invitationRepository.findAll();
  }

  @Post('invitations/accept')
  async acceptInvitation(@Body() dto: AcceptInvitationDto) {
    return this.acceptInvitationUseCase.execute(dto.token, dto.name, dto.password);
  }
}
