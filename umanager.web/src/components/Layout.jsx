import { Component } from "react"
import 'reactstrap'
import { Container } from "reactstrap"
import { NavMenu } from './NavMenu';

export class Layout extends Component {
    static displayName = Layout.name;

    render() { 
        return (
            <div>
                <NavMenu />
                <main>
                    <Container>
                        { this.props.children }
                    </Container>
                </main>
            </div>
        );
    }
}