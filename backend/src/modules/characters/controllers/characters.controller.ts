import {
  Controller,
  Get,
  Param,
  Put,
  UseGuards,
  Request,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

// Services
import { CharactersService } from '../services/characters.service';

// Guards
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Characters')
@Controller('characters')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get current user avatar' })
  @ApiResponse({ status: 200, description: 'Avatar found' })
  @ApiResponse({ status: 404, description: 'Avatar not found' })
  async getMyAvatar(@Request() req: any) {
    return this.charactersService.getAvatarByUserId(req.user.id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get avatar by ID' })
  @ApiResponse({ status: 200, description: 'Avatar found' })
  @ApiResponse({ status: 404, description: 'Avatar not found' })
  async getAvatarById(@Param('id') id: string) {
    return this.charactersService.getAvatarById(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update avatar' })
  @ApiResponse({ status: 200, description: 'Avatar updated successfully' })
  @ApiResponse({ status: 404, description: 'Avatar not found' })
  async updateAvatar(@Param('id') id: string, @Body() data: any) {
    return this.charactersService.updateAvatar(id, data);
  }

  @Put(':id/level-up')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Level up avatar' })
  @ApiResponse({ status: 200, description: 'Avatar leveled up' })
  @ApiResponse({ status: 400, description: 'Not enough experience' })
  @ApiResponse({ status: 404, description: 'Avatar not found' })
  async levelUp(@Param('id') id: string) {
    return this.charactersService.levelUp(id);
  }

  @Put(':id/experience')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Gain experience' })
  @ApiResponse({ status: 200, description: 'Experience gained' })
  @ApiResponse({ status: 404, description: 'Avatar not found' })
  async gainExperience(
    @Param('id') id: string,
    @Body() body: { amount: number },
  ) {
    return this.charactersService.gainExperience(id, body.amount);
  }

  @Put(':id/attributes')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update avatar attributes' })
  @ApiResponse({ status: 200, description: 'Attributes updated' })
  @ApiResponse({ status: 400, description: 'Not enough attribute points' })
  @ApiResponse({ status: 404, description: 'Attributes not found' })
  async updateAttributes(
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.charactersService.updateAttributes(id, data);
  }

  @Get('races')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all races' })
  @ApiResponse({ status: 200, description: 'List of races' })
  async getAllRaces() {
    return this.charactersService.getAllRaces();
  }

  @Get('classes')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all character classes' })
  @ApiResponse({ status: 200, description: 'List of character classes' })
  async getAllClasses() {
    return this.charactersService.getAllClasses();
  }
}
