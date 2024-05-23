export interface TokenJSON {
    aud: string;
    email: string;
    exp: number;
    iat: number;
    is_anonymous: boolean;
    iss: string;
    phone: string;
    role: string;
    session_id: string;
    sub: string;
    user_metadata: UserMetadata;
    user_role: string;
}

interface UserMetadata {
    display_name?: string;
    email: string;
    first_name?: string;
    last_name?: string;
}