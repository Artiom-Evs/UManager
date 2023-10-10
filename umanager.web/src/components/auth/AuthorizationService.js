import { ApiPaths } from "./AuthConstants";

export class AuthorizationService {
    _authStateChanged = new Event("authorization-state-changed");
    _state = {
        name: null,
        email: null,
        isAuthenticated: false
    };

    async updateState() {
        const state = await fetch(ApiPaths.Info)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to receive authentication data.');
                }
                return response.json();
            })
            .then(json => {
                if (json.isAuthenticated === undefined) {
                    throw new Error('Server response has uncorrect format.');
                }
                return json;
            })
            .catch(error => {
                console.log(`>> ${error}`);
            });

        if (!state) {
            return;
        }

        if (this._state.name != state.name || this._state.email != state.email || this._state.isAuthenticated != state.isAuthenticated) {
            this._state = { ...state };
            window.dispatchEvent(this._authStateChanged);
        }
    }

    async isAuthorized() {
        await this.updateState();
        return this._state.isAuthenticated;
    }

    async register(registrationData) {
        const result = await fetch(ApiPaths.Register, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(registrationData),
        })
            .then(async (response) => {
                if (response.ok) {
                    return this.createResult(true);
                }
                else if (response.status == 400) {
                    const data = await response.json();
                    return this.createResult(false, data);
                }
                throw new Error("Error occured while sending data");
            })
            .catch((error) => {
                return this.createResult(false, `${error}`);
            });

        console.log(`>> AuthService: ${JSON.stringify(result)}`);
        return result;
    }

    async logIn(loginData) {
        const result = await fetch(ApiPaths.Login, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(loginData),
        })
            .then(async (response) => {
                if (response.ok) {
                    return this.createResult(true);
                }
                else if (response.status == 400) {
                    const data = await response.json();
                    return this.createResult(false, data);
                }
                else if (response.status == 401) {
                    return this.createResult(false, "Invalid login or password.");
                }
                throw new Error("Failed to receive data from the server.");
            })
            .catch((error) => {
                return this.createResult(false, `${error}`);
            });

        await this .updateState();
        console.log(`>> AuthService: ${JSON.stringify(result)}`);
        return result;
    }

    async logOut() {
        const result = await fetch(ApiPaths.Logout)
            .then(response => {
                if (response.ok) {
                    return this.createResult(true);
                }
                throw new Error("Failed to receive data from the server.");
            })
            .catch(error => {
                return this.createResult(false, `${error}`);
            });

        await this .updateState();
        console.log(`>> AuthService: ${JSON.stringify(result)}`);
        return result;
    }

    createResult(status, error) {
        const result = { status: !!status };
        
        if (!error) {
            return result;
        }
        else if (typeof(error) === typeof("")) {
            result.errors = [ error ];
            return result;
        }
        else if (typeof(error) === typeof({})) {
            result.errors = [];
            for (let [key, value] of Object.entries(error.errors)) {
                value.map(e => result.errors.push(e));
            }
        }

        return result;
    }
}

const authService = new AuthorizationService();

export default authService;
