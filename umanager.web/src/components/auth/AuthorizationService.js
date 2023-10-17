import { ApiPaths } from "./AuthConstants";

export class AuthorizationService {
    _authStateChanged = new Event("authorization-state-changed");
    _isAuthorized = null;

    user = {
        id: null,
        name: null,
        email: null
    };

    async isAuthorized(requireUpdate) {
        if (this._isAuthorized  === null || requireUpdate) {
            await this.updateState();
        }
        return this._isAuthorized;
    }

    // TODO: переделать нафиг всё!
    async updateState() {
        const result = await fetch(ApiPaths.Info)
            .then(async response => {
                if (response.ok) {
                    return response.json();
                }
                else if (response.status == 401) {
                    throw new Error("Unauthorized.");
                }
                throw new Error('Failed to receive authentication data.');
            })
            .then(json => {
                return {
                    id: json.id,
                    name: json.name,
                    email: json.email
                };
            })
            .catch(error => {
                console.log(`>> AuthService: ${error}`);
                return {
                    id: null,
                    name: null,
                    email: null
                };
            });

        this.setState(result);
    }

    setState(state){
        if (this.user.id != state.id || this.user.name != state.name || this.user.email != state.email) {
            this.user = state;
            this._isAuthorized = !!state.id;
            console.log(`>> AuthService: Authorization state changed. Now is ${this._isAuthorized ? 'authorized' : 'unauthorized'}.`)
            window.dispatchEvent(this._authStateChanged);
        }
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
                    return this.createResult(true, 200);
                }
                else if (response.status == 400) {
                    const data = await response.json();
                    return this.createResult(false, 400, data);
                }
                throw new Error("Error occured while sending data");
            })
            .catch((error) => {
                return this.createResult(false, 500, `${error}`);
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
                    return this.createResult(true, 200);
                }
                else if (response.status == 400) {
                    const data = await response.json();
                    return this.createResult(false, 400, data);
                }
                else if (response.status == 401) {
                    return this.createResult(false, 401, "Invalid login or password.");
                }
                throw new Error("Failed to receive data from the server.");
            })
            .catch((error) => {
                return this.createResult(false, 500, `${error}`);
            });

        await this .updateState();
        console.log(`>> AuthService: ${JSON.stringify(result)}`);
        return result;
    }

    async logOut() {
        const result = await fetch(ApiPaths.Logout)
            .then(response => {
                if (response.ok) {
                    return this.createResult(true, 200);
                }
                else if (response.status == 401) {
                    return this.createResult(false, 401);
                }
                throw new Error("Failed to receive data from the server.");
            })
            .catch(error => {
                return this.createResult(false, 500, `${error}`);
            });

        if (result.code == 401) {
            await this.setState({ id: null, name: null, email: null });
        }

        console.log(`>> AuthService: ${JSON.stringify(result)}`);
        return result;
    }

    createResult(status, code, error) {
        const result = { status: !!status, code };
        
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
