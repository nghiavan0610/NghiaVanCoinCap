export interface AccessTokenPayload {
    id: string;
    role: string;
}

export interface RefreshTokenPayload extends AccessTokenPayload {
    refreshToken: string;
}
