import { Component } from "react";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import { Navigate } from "react-router-dom";
import authService from './AuthorizationService';
import { QueryParameterNames } from "./AuthConstants";

export class Login extends Component {
    static displayName = Login.name;

    state = {
        email: "",
        password: "",
        rememberMe: false,
        loggedIn: false,
        errors: []
    };

    handleSubmit =      async (e) => {
        e.preventDefault();

        const errors = this.generateValidationErrors();
        if (errors.length > 0) {
            this.setState({ errors });
            return;
        }

        const loginData = {
            email: this.state.email,
            password: this.state.password,
            rememberMe: this.state.rememberMe
        };

        const result = await authService.logIn(loginData);
        if (!result.status) {
            this.setState({ errors: result.errors });
            return;
        }
        this.setState({ loggedIn: true });
    };

    handleInputChange = (e) => {
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        this.setState({ [e.target.name]: value });
    };

    generateValidationErrors() {
        const errors = [];
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
        if (this.state.email === "") {
            errors.push("Email  is required.");
        }
        if (this.state.email !== "" && !regex.test(this.state.email)) {
            errors.push("Email  has uncorrect format.");
        }
        if (this.state.password === "") {
            errors.push("Password is required.");
        }
        
        return errors;
    }

    getReturnUrl() {
        const params = new URLSearchParams(window.location.search);
        const returnUrl = params.get(QueryParameterNames.ReturnUrl);
        
        if (!returnUrl || !returnUrl.startsWith("/")) {
          return "/";
        }
        
        return returnUrl;
    }

    renderValidationErrors() {
        if (this.state.errors.length > 0) {
            return (<FormGroup>
                {this.state.errors.map((err, i) => 
                <div key={i}>
                    <FormText className="text-danger">{err}</FormText>
                </div> )}
            </FormGroup>);
        }
    }

    render() {
        const {
            email,
            password,
            loggedIn
        } = this.state;

        if (loggedIn) {
            const returnUrl = this.getReturnUrl();
            return <Navigate replace={true} to={returnUrl} state={{ from: "back-url" }}  />;
        }

        const validationErrors = this.renderValidationErrors();

        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="card">
                    <div className="card-header">
                        <h1 className="form-header-1">Login</h1>
                    </div>
                    <div className="card-body">
                        <Form onSubmit={this.handleSubmit}>
                            { validationErrors }
                            <FormGroup floating>
                                <Input id="email" name="email" placeholder="Email" type="email"
                                    value={email} onChange={this.handleInputChange}
                                />
                                <Label for="email">Email</Label>
                            </FormGroup>
                            <FormGroup floating>
                                <Input id="password" name="password" placeholder="Password" type="password"
                                    value={password} onChange={this.handleInputChange}
                                />
                                <Label for="password">Password </Label>
                            </FormGroup>
                            <FormGroup check>
                                <Label check>
                                    <Input id="rememberMe" name="rememberMe" type="checkbox" 
                                        onChange={this.handleInputChange}
                                    />
                                    Remember Me
                                </Label>
                            </FormGroup><br />
                            <Button className="w-100" type="submit">Submit</Button>
                        </Form>
                    </div>
                </div>
            </div>

        );
    }
}
