import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistrationDto } from './dto/registration.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CredentialDto } from './dto/credential.dto';
import { LoginPayload } from './interfaces/loginPayload.interface';
import { GetCurrentUserId } from '../decorators/getCurrentUserId.decorator';
import { Public } from '../decorators/public.decorator';
import { RefreshTokenGuard } from '../guards/refreshToken.guard';
import { TokenPayload } from './interfaces/tokenPayload.interface';
import { GetCurrentUser } from '../decorators/getCurrentUser.decorator';

@Controller('auth')
@ApiBearerAuth()
@ApiTags('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @Post('/signup')
    @HttpCode(HttpStatus.CREATED)
    signUp(@Body() registration: RegistrationDto): Promise<LoginPayload> {
        return this.authService.signUp(registration);
    }

    @Public()
    @Post('/signin')
    @HttpCode(HttpStatus.OK)
    async signIn(@Body() credentials: CredentialDto): Promise<LoginPayload> {
        return await this.authService.signIn(credentials);
    }

    // @Public()
    @Post('/signout')
    @HttpCode(HttpStatus.OK)
    signOut(@GetCurrentUserId() userId: string): Promise<boolean> {
        return this.authService.signOut(userId);
    }

    @Public()
    @UseGuards(RefreshTokenGuard)
    @Post('/refresh')
    @HttpCode(HttpStatus.OK)
    refreshToken(
        @GetCurrentUserId() userId: string,
        @GetCurrentUser('refreshToken') refreshToken: string,
    ): Promise<TokenPayload> {
        return this.authService.refreshToken(userId, refreshToken);
    }
}
