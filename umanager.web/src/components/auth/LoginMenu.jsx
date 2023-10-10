import { Component, Fragment } from "react";
import { NavItem, NavLink, NavbarText } from "reactstrap";
import { Link } from 'react-router-dom';
import { AppPaths } from './AuthConstants';
import authService from './AuthorizationService';
export class LoginMenu extends Component {
    static displayName = LoginMenu.name;

    constructor(props) {
        super(props);

        this.state = { 
            username: null,
            authorized: false 
        };

        // subscribe to authorization change event
        // it is required for change LoginMenu state after change state in the AuthenticationService
        this.handleAuthorizationStateChange = this.handleAuthorizationStateChange.bind(this);
        window.addEventListener("authorization-state-changed", this.handleAuthorizationStateChange);
    }

    componentDidMount() {
        this.populateAuthorizationState();
    }

    handleAuthorizationStateChange() {
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
            ? this.renderAuthorized(this.state.username)
            : this.renderUnauthorized();
        
        return content;
    }

    async populateAuthorizationState() {
        const authorized = await authService.isAuthorized();
        const username = authService._state.name;
        this.setState({ authorized, username });
    }
}
