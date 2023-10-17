import { Component } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AppPaths } from './auth/AuthConstants';
import authService from './auth/AuthorizationService';

export class Home extends Component {
    static displayName = Home.name;
    state = {
        loading: true,
        authorized: false
    };

    componentDidMount() {
        this.populateAuthorizationData();
    }

    render() {
        const { loading, authorized } = this.state;

        if (loading) {
            return <em>Loading...</em>;
        }

        if (authorized) {
            return <Navigate replace to="/manage" />;
        }

        return(<div>
            <h1>Hello, User!</h1>
            <p>
                Only registered users can use this service. Please <Link to={AppPaths.Login}>login</Link> or <Link to={AppPaths.Register}>register</Link>.
            </p>
        </div>)
    }

    async populateAuthorizationData() {
        const authorized = await authService.isAuthorized();
        this.setState({ loading: false, authorized });
    }
}
