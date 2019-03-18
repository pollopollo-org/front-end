import React from "react";

import { Link } from "react-router-dom";
import { colors } from "src/ts/config/colors";
import { fonts } from "src/ts/config/fonts";
import { routes } from "src/ts/config/routes";

import LoginFormLabels from "src/assets/data/loginForm.json";


type LoginFormState = {
    /**
     * Inputted email
     */
    email?: string;
    /**
     * Inputted password
     */
    password?: string;
}

/**
 * A page where the user can login to the platform
 */
export class LoginForm extends React.PureComponent<{}, LoginFormState>{
    /**
     * State of the login form, all fields initially set to null
     */
    public readonly state: LoginFormState = {};

    /**
     * Render the component
     */
    public render(): JSX.Element {
        return (
            <div className="loginCenterWrapper">
                <div className="loginSpacer">
                    <h1>{LoginFormLabels.title}</h1>
                    <div className="loginFormContainer">
                        <div className="container">
                            <form>
                                <div className="loginForm Email">
                                    <label htmlFor="user_name" className="loginLabel Email">
                                        {LoginFormLabels.EmailInputLabel}
                                    </label>
                                    <input
                                        type="email"
                                        className="loginInput Email"
                                        id="user_name"
                                        required
                                        onChange={event => this.setState({ email: event.target.value, })}
                                    />
                                </div>
                                <div className="loginForm Password">
                                    <label htmlFor="user_password" className="loginLabel Password">
                                        {LoginFormLabels.PasswordInputLabel}
                                    </label>
                                    <input
                                        type="password"
                                        className="loginInput Password"
                                        id="user_password"
                                        required
                                        onChange={event => this.setState({ password: event.target.value, })}
                                    />
                                </div>
                                <button type="submit">{LoginFormLabels.buttonText}</button>
                            </form>
                            <Link className="link registerLink" to={routes.register}>
                                {LoginFormLabels.linkQuestion} <b>{LoginFormLabels.linkSignUpText}</b>
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
                        margin-bottom: 10px;
                        width: 100%;
                    }

                    /* Set font, size and margin for input labels  */
                    .loginLabel {
                        display: block;
                        margin: 10px auto;
                        font-size: 1.2rem;
                        font-family: ${ fonts.text};
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
                        font-weight: normal;
                        font-size: 1rem;
                        font-family: ${ fonts.text};
                        color: ${ colors.black};

                       ;
                    }

                    /* Set border styling when clicked on */
                    .loginInput:focus {
                        border: 1px solid ${ colors.secondary};
                    }   

                    h1 {
                        display: block;
                        font-size: 2rem;
                    }

                    button {
                        margin-top: 25px;
                        padding: 0.75rem 1.25rem;
                        width: 100%;
                        cursor: pointer;

                        /* Set color styling */
                        background-color: ${ colors.secondary};
                        color: white;

                        /* Set border styling */
                        border: none;
                        border-radius: 3px;
                        transition: background-color 0.1s linear;

                        /* Set font styling */
                        font-size: 1.25rem;
                        font-family: ${ fonts.heading};
                    }

                    button:hover {
                        background-color: ${ colors.primary};
                    }

                    /* Set link styling */
                    :global(.link) {
                        margin-top: 10px;
						color: ${ colors.secondary};
                        text-decoration: none;
                    }

                    :global(.link:hover) {
						color: ${ colors.primary};
                        text-decoration:none; 
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
}