
export class AuthorizationService {
    isAuthorized() {
        return false;
    }
}

const authService = new AuthorizationService();

export default authService;
