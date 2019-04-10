import React from "react";

import { RouterProps, withRouter } from "react-router";
import { Link } from "react-router-dom";
import { colors } from "src/ts/config/colors";
import { fonts } from "src/ts/config/fonts";
import { routes } from "src/ts/config/routes";

import loginFormJson from "src/assets/data/loginForm.json";
import { injectStore } from "src/ts/store/injectStore";
import { Store } from "src/ts/store/Store";
import { Button } from "src/ts/components/utils";
import { logIn } from "src/ts/models/UserModel";

type LoginFormProps = {
    /**
     * Contains a reference to the root store
     */
    store: Store;
} & RouterProps;

export type LoginFormState = {
    /**
     * Inputted email
     */
    email: string;
    /**
     * Inputted password
     */
    password: string;

    /**
     * Specifies whether or not we're currently attempting to create a user
     */
    isPending?: boolean;
}

/**
 * A page where the user can login to the platform
 */
export class UnwrappedLoginForm extends React.PureComponent<LoginFormProps, LoginFormState>{
    /**
     * State of the login form, all fields initially set to null
     */
    public readonly state: LoginFormState = {
        email: "",
        password: "",
    };

    /**
     * Render the component
     */
    // tslint:disable-next-line max-func-body-length
    public render(): JSX.Element {
        return (
            <div className="loginCenterWrapper">
                <div className="loginSpacer">
                    <h1>{loginFormJson.title}</h1>
                    <div className="loginFormContainer">
                        <div className="container">
                            <form onSubmit={this.onSubmit}>
                                <div className="loginForm Email">
                                    <input
                                        type="email"
                                        className="loginInput Email"
                                        placeholder={ loginFormJson.EmailInputLabel }
                                        id="user_name"
                                        required
                                        aria-required={true}
                                        onChange={this.onEmailChanged}
                                    />
                                </div>
                                <div className="loginForm Password">
                                    <input
                                        type="password"
                                        className="loginInput Password"
                                        placeholder={ loginFormJson.PasswordInputLabel }
                                        id="user_password"
                                        required
                                        aria-required={true}
                                        onChange={this.onPasswordChanged}
                                    />
                                </div>
                                <div className="button">
                                    <Button 
                                        withThrobber={true} 
                                        text={loginFormJson.buttonText}
                                        width="100%"
                                        height={46}
                                        fontSize={16}
                                        type={"submit"}
                                        isPending={this.state.isPending}
                                        throbberSize={30}/>
                                </div>
                            </form>
                            <Link className="link registerLink" to={routes.register.path}>
                                {loginFormJson.linkQuestion} <b>{loginFormJson.linkSignUpText}</b>
                            </Link>
                        </div>
                    </div>
                </div>
                <style jsx>{`

                    /* Center form on middle of page */
                    .loginCenterWrapper {
                        flex-grow: 1;
                        height: 100%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }

                    /* Top and bottom margin for login form*/
                    .loginSpacer {
                        margin-top: 2rem;
                        margin-bottom: 2rem;
                    }

                    /* Wrapper to set width of form */
                    .loginFormContainer {
                        width: 22rem;
                    }

                    /* Wrapper to flex the form with columns */
                    .container {
                        display: flex;
                        flex-direction: column;
                        max-width: 22rem;
                    }

                    /* Start align items in form */
                    form {
                        display: flex;
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    /*  Wrapper for input fields
                        filling fields in container
                        with bottom margin under input fields
                     */
                    .loginForm {
                        margin-bottom: 25px;
                        width: 100%;
                    }

                    /* Set styling for input fields */
                    .loginInput {
                        padding: 0.8rem 0;
                        text-indent: 9px;
                        width: 100%;

                        /* Set border styling */
                        border: 1px solid ${ colors.pale};
                        border-transition: border-color 0.15s linear;
                        border-radius: 3px;
                        box-shadow: none;
                        box-sizing: border-box;

                        /* Remove box-shadow on iOS */
                        background-clip: padding-box;

                        /* Set font styling */
                        font-family: ${ fonts.text};
                        font-size: 16px;
                        font-weight: 300;
                    }

                    /* Set border styling when clicked on */
                    .loginInput:focus {
                        border: 1px solid ${ colors.secondary };
                    }

                    h1 {
                        display: block;
                        font-size: 2rem;
                        text-align: center;
                        margin-bottom: 30px;
                    }

                    .button {
                        position: relative;
                        width: 100%;

                        & :global(> button) {
                            font-size: 1.25rem;
                            padding: 0.75rem 1.25rem;
                        }
                    }

                    /* Set link styling */
                    :global(.link) {
                        margin-top: 15px;
						color: ${ colors.secondary};
                        text-decoration: none;
                        text-align: center;
                    }

                    :global(.link:hover) {
                        text-decoration:underline;
                        cursor:pointer;
                    }

                    @media only screen and (max-width: 768px) {
                        .loginFormContainer {
                            width: 100%;
                        }
                    }
                `}</style>
            </div>
        );
    }

    /**
     * Method that'll get triggered each time the input is changed, in order to
     * properly update state
     */
    protected onEmailChanged = (evt: React.FormEvent<HTMLInputElement>) => {
        this.setState({ email: evt.currentTarget.value });
    }

    /**
     * Method that'll get triggered each time the input is changed, in order to
     * properly update state
     */
    protected onPasswordChanged = (evt: React.FormEvent<HTMLInputElement>) => {
        this.setState({ password: evt.currentTarget.value });
    }

    /**
     * Internal handler that should be triggered once the form is ready to submit
     */
    protected onSubmit = async (evt: React.FormEvent) => {
        evt.preventDefault();

        if (!this.state.password || !this.state.email || this.state.isPending) {
            return;
        }

        this.setState({ isPending: true });
        await logIn(this.state, this.props.store, this.props.history);
        this.setState({ isPending: false });

    }
}

export const LoginForm = withRouter(injectStore((store) => ({ store }), UnwrappedLoginForm));
