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
    email: string;
    /**
     * Inputted password
     */
    password: string;
}

/**
 * A page where the user can login to the platform
 */
export class LoginForm extends React.PureComponent<{}, LoginFormState>{
    constructor(props: any) {
        super(props);
        this.state = {
            email: "",
            password: "",
        };
    }

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
                                    <input type="email" className="loginInput Email" id="user_name" required onChange={event => this.setState({ email: event.target.value, })} />
                                </div>
                                <div className="loginForm Password">
                                    <label htmlFor="user_password" className="loginLabel Password">
                                        {LoginFormLabels.PasswordInputLabel}
                                    </label>
                                    <input type="password" className="loginInput Password" id="user_password" required onChange={event => this.setState({ password: event.target.value, })} />
                                </div>
                                <button type="submit">{LoginFormLabels.buttonText}</button>
                            </form>
                            <Link className="link registerLink" to={routes.register}>{LoginFormLabels.linkQuestion} <b>{LoginFormLabels.linkSignUpText}</b></Link>
                        </div>
                    </div>
                </div>
                <style jsx>{`

                    .loginCenterWrapper {
                        flex-grow: 1;
                        height: 100%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    .loginSpacer {
                        margin-top: 2rem;
                        margin-bottom: 2rem;
                    }

                    .loginFormContainer {
                        width: 22rem;
                    }

                    .container {
                        display: flex;
                        flex-direction: column;
                        max-width: 22rem;
                    }

                    form {
                        display: flex;
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .loginForm {
                        margin-bottom: 10px;
                        width: 100%;
                    }

                    .loginLabel {
                        display: block;
                        margin: 10px auto;
                        font-size: 1.2rem;
                        font-family: ${ fonts.text};
                    }

                    .loginInput {
                        box-shadow: none;
                        padding: 0.8rem 0;

                        text-indent: 9px;
                        border: 1px solid ${ colors.pale};
                        border-transition: border-color 0.15s linear;
                        border-radius: 3px;
                        font-weight: normal;
                        font-size: 1rem;
                        font-family: ${ fonts.text};
                        box-sizing: border-box;
                        width: 100%;
                    }
                    .loginInput:focus {
                        border: 1px solid ${ colors.secondary};
                    }   

                    h1 {
                        display: block;
                        font-size: 2rem;
                    }

                    button {
                        margin-top: 25px;
                        background-color: ${ colors.secondary};
                        color: white;
                        border: none;
                        border-radius: 3px;
                        padding: 0.75rem 1.25rem;
                        transition: background-color 0.1s linear;
                        font-size: 1.25rem;
                        font-family: ${ fonts.heading};
                        width: 100%;
                        cursor: pointer;
                    }

                    button:hover {
                        background-color: ${ colors.primary};
                    }

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