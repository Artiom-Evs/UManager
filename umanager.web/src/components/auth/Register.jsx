import { Component } from "react";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import { Navigate } from "react-router-dom";
import authService from './AuthorizationService';
import { AppPaths, QueryParameterNames } from "./AuthConstants";

export class Register extends Component {
    static displayName = Register.name;
    
    state = {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        rememberMe: false,
        registered: false,
        errors: []
    };

    handleSubmit = async (e) => {
        e.preventDefault();

        const errors = this.getValidationErrors();
        if (errors.length > 0) {
            this.setState({ errors });
            return;
        }

        const registrationData = {
            name: this.state.username,
            email: this.state.email,
            password: this.state.password
        };

        const result = await authService.register(registrationData);
        if (!result.status) {
            this.setState({ errors: result.errors });
            return;
        }
        this.setState({ registered: true });
    };

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };

    getValidationErrors() {
        const errors = [];
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
        if (this.state.username === "") {
            errors.push("Username  is required.");
        }
        if (this.state.email === "") {
            errors.push("Email  is required.");
        }
        if (this.state.email !== "" && !regex.test(this.state.email)) {
            errors.push("Email  has uncorrect format.");
        }
        if (this.state.password === "") {
            errors.push("Password is required.");
        }
        if (this.state.password !== this.state.confirmPassword) {
            errors.push("Passwords must match.");
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
            username,
            email,
            password,
            confirmPassword,
            registered
        } = this.state;

        if (registered) {
            const returnUrl = this.getReturnUrl();
            const route = `${AppPaths.Login}` + (returnUrl !== "/" ? `?${QueryParameterNames.ReturnUrl}=${returnUrl}` : "");
            return <Navigate replace to={route} />;
        }

        const validationErrors = this.renderValidationErrors();

        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="card">
                    <div className="card-header">
                        <h1 className="form-header-1">Registration</h1>
                    </div>
                    <div className="card-body">
                        <Form onSubmit={this.handleSubmit}>
                            { validationErrors }
                            <FormGroup floating>
                                <Input id="username" name="username" placeholder="Name" type="text"
                                    value={username} onChange={this.handleInputChange}
                                />
                                <Label for="name">Username</Label>
                            </FormGroup>
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
                            <FormGroup floating>
                                <Input id="confirmPassword" name="confirmPassword" placeholder="Confirm password" type="password"
                                    value={confirmPassword} onChange={this.handleInputChange}
                                />
                                <Label for="Confirm password">Confirm password </Label>
                            </FormGroup>
                            <Button className="w-100" type="submit">Submit</Button>
                        </Form>
                    </div>
                </div>
            </div>

        );
    }
}
