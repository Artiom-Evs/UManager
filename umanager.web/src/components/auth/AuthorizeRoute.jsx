import { Component } from "react";
import authService from './AuthorizationService';
import { Login } from "./Login";
import { Navigate } from "react-router-dom";
import { AppPaths, QueryParameterNames } from "./AuthConstants";

export class AuthorizeRoute extends Component {
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

        var link = document.createElement("a");
        link.href = this.props.path;
        const returnUrl = `${link.protocol}//${link.host}${link.pathname}${link.search}${link.hash}`;
        const redirectUrl = `${AppPaths.Login}?${QueryParameterNames.ReturnUrl}=${encodeURIComponent(returnUrl)}`;
        return <Navigate replace to={redirectUrl} />;
    }

    async populateAuthenticationState() {
        const state = await authService.isAuthorized();
        this.setState({ authorized: state, loading: false });
    }
}
