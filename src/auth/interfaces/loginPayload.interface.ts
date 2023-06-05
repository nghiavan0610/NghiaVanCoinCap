import { TokenPayload } from './tokenPayload.interface';

interface User {
    id: string;
    username: string;
    fullname: string;
    avatar: string;
}

export interface LoginPayload extends TokenPayload {
    user: User;
}
