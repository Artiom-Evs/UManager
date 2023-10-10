import { Component } from "react";
import { Navigate } from "react-router-dom";
import authService from './AuthorizationService';
import { AppPaths, QueryParameterNames } from "./AuthConstants";
``
export class PrivateRoute extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            authorized: false
        };
    }

    componentDidMount() {
        this.populateAuthenticationState();
    }

    render() {
        if (this.state.loading) {
            return (<em>Loading...</em>);
        }

        if (this.state.authorized) {
            const { element } = this.props;
            return element;
        }

        const redirectUrl = `${AppPaths.Login}?${QueryParameterNames.ReturnUrl}=${this.props.path}`;
        return <Navigate replace to={redirectUrl} />;
    }

    async populateAuthenticationState() {
        const state = await authService.isAuthorized();
        this.setState({ authorized: state, loading: false });
    }
}
