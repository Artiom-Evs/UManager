import { Component } from "react";
import { Button } from "reactstrap";
import { Navigate } from "react-router-dom";
import authService from "./AuthorizationService";

export class Logout extends Component {
    static displayName = Logout.name;
    state = {
        loading: true,
        loggedOut: false,
        errors: ""
    };

    componentDidMount() {
        this.populateAuthenticationData();
    }

    retryHandler = () => {
        this.setState({ loading: true });
        this.populateAuthenticationData();
    }
    
    render() {
        if (this.state.loading) {
            return ( <em>Loading...</em> );
        }
        if (!this.state.loggedOut) {
            return (<div>
                <p>Logout failed.</p>
                <p>{this.state.errors[0]}</p>
                <Button onClick={this.retryHandler}>Retry!</Button>
            </div>);
        }
        
        return <Navigate replace to="/" />;
    }

    async populateAuthenticationData() {
        const result = await authService.logOut();
        if (!result.status) {
            this.setState({ loggedOut: false, errors: result.errors, loading: false });
        }

        this.setState({ loggedOut: true, loading: false });
    }
}