import { GetCurrentUserId } from '../decorators/getCurrentUserId.decorator';
import { SingleUserPayload, UsersPayload } from './interfaces/user.interface';
import { Controller, Get, Body, Param, Delete, HttpCode, HttpStatus, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/updateUser.dto';
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { ChangePasswordDto } from './dto/changePassword.dto';

@Controller('users')
@ApiTags('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    async getAllUsers(): Promise<UsersPayload> {
        const users = await this.usersService.getAllUsers();
        return { users };
    }

    @Get('my-profile')
    @HttpCode(HttpStatus.OK)
    async getMyProfile(@GetCurrentUserId() id: string): Promise<SingleUserPayload> {
        const user = await this.usersService.getUser(id);
        return { user };
    }

    @Put('profile')
    @HttpCode(HttpStatus.CREATED)
    async updateUser(@GetCurrentUserId() id: string, @Body() updateUserDto: UpdateUserDto): Promise<SingleUserPayload> {
        const user = await this.usersService.updateUser(id, updateUserDto);
        return { user };
    }

    @Put('security')
    @HttpCode(HttpStatus.CREATED)
    async changePassword(
        @GetCurrentUserId() id: string,
        @Body() changePasswordDto: ChangePasswordDto,
    ): Promise<SingleUserPayload> {
        const user = await this.usersService.changePassword(id, changePasswordDto);
        return { user };
    }

    @Delete(':id')
    @Roles('Admin')
    @UseGuards(RolesGuard)
    @HttpCode(HttpStatus.OK)
    async removeUser(@Param('id') id: string) {
        return await this.usersService.removeUser(id);
    }
}
