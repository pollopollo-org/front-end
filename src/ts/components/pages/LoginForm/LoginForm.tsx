import React from "react";

import { RouterProps, withRouter } from "react-router";
import { Link } from "react-router-dom";
import { colors } from "src/ts/config/colors";
import { fonts } from "src/ts/config/fonts";
import { routes } from "src/ts/config/routes";

import loginFormJson from "src/assets/data/loginForm.json";
import { apis } from "src/ts/config/apis";
import { injectStore } from "src/ts/store/injectStore";
import { Store } from "src/ts/store/Store";
import { asyncTimeout } from "src/ts/utils";
import { Throbber } from "src/ts/components/utils";
import { alertApiError } from "src/ts/utils/alertApiError";
import { createUser } from "src/ts/utils/createUser";

type LoginFormProps = {
    /**
     * Contains a reference to the root store
     */
    store: Store;
} & RouterProps;

type LoginFormState = {
    /**
     * Inputted email
     */
    email?: string;
    /**
     * Inputted password
     */
    password?: string;

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
    public readonly state: LoginFormState = {};

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
                                <button type="submit" className={this.state.isPending ? "isPending" : ""}>
                                    <span className="text">{loginFormJson.buttonText}</span>
                                    <span className="throbber">
                                        <Throbber size={30} relative={true} inverted={true} />
                                    </span>
                                </button>
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

                    button {
                        position: relative;
                        padding: 0.75rem 1.25rem;
                        width: 100%;
                        cursor: pointer;

                        /* Set color styling */
                        background-color: ${ colors.secondary};
                        color: ${colors.white};

                        /* Set border styling */
                        border: none;
                        border-radius: 3px;
                        transition: background-color 0.1s linear;

                        /* Set font styling */
                        font-size: 1.25rem;
                        font-family: ${ fonts.heading};

                        & .throbber {
                            /**
                             * Position a throbber in the middle to be displayed
                             * while requests are ongoing
                             */
                            position: absolute;
                            left: calc(50% - 15px);
                            top: calc(50% - 15px);
                            opacity: 0;
                            overflow: hidden;

                            /* Make sure throbber does not overlap the register link */
                            height: 40px;
                            width: 190px;

                            /**
                             * prepare transitions
                             */
                            transition: opacity 0.2s linear;
                        }

                        & .text {
                            opacity: 1;
                            transform: scale(1);

                            /**
                             * prepare transitions
                             */
                            transition: opacity 0.2s linear;
                        }

                        &.isPending .throbber {
                            opacity: 1;
                            transform: scale(1);
                        }

                        &.isPending .text {
                            opacity: 0;
                            transform: scale(0.5);
                        }
                    }

                    button:hover {
                        background-color: ${ colors.primary};
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

        const endPoint = apis.user.authenticate.path;

        try {
            this.setState({ isPending: true });
            const startedAt = performance.now();

            const body = JSON.stringify({
                password: this.state.password,
                email: this.state.email
            });

            const response = await fetch(endPoint, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("userJWT", data.token);
                this.props.store.user = createUser(data.userDTO);

                await asyncTimeout(Math.max(0, 500 - (performance.now() - startedAt)));
                this.props.history.push(routes.root.path);
            } else {
                alertApiError(response.status, apis.user.authenticate.errors, this.props.store);
                this.setState({ isPending: false });
            }
        } catch (err) {
            this.setState({ isPending: false });

            this.props.store.currentErrorMessage = "Something with your request when wrong, please try again later";
        }
    }
}

export const LoginForm = withRouter(injectStore((store) => ({ store }), UnwrappedLoginForm));
