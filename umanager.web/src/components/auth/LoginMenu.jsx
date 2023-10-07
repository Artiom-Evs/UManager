import { Component, Fragment } from "react";
import { NavItem, NavLink, NavbarText } from "reactstrap";
import { Link } from 'react-router-dom';
import { AppPaths } from './AuthConstants';
import authService from './AuthorizationService';
export class LoginMenu extends Component {
    static displayName = LoginMenu.name;

    constructor(props) {
        super(props);

        this.state = { authorized: false };
    }

    componentDidMount() {
        this.populateAuthorizationState();
    }

    renderAuthorized(userName) {
        return (<Fragment>
            <NavbarText>
                { `Hello, ${userName}!` }
            </NavbarText>
            <NavItem>
              <NavLink tag={Link} className="text-dark" to={AppPaths.Logout}>Logout</NavLink>
            </NavItem>
          </Fragment>);
    }

    renderUnauthorized() {
        return (<Fragment>
            <NavItem>
              <NavLink tag={Link} className="text-dark" to={AppPaths.Register}>Register</NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} className="text-dark" to={AppPaths.Login}>Login</NavLink>
            </NavItem>
          </Fragment>);
    }

    render() {
        const content = this.state.authorized
            ? this.renderAuthorized("Some Name")
            : this.renderUnauthorized();

        return content;
    }

    async populateAuthorizationState() {
        const state = await authService.isAuthorized();
        this.setState({ authorized: state });
    }
}
