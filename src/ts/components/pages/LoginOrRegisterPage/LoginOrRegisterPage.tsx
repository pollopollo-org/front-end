import React from "react";
import { fonts, colors, routes } from "src/ts/config";
import { Button } from "src/ts/components/utils";
import { Link } from "react-router-dom";
import { UserTypes } from "src/ts/models/UserModel";

type LoginOrRegisterPageProps = {
    /**
     * Which page to redirect to after login
     */
    userType: string;
}

/**
 * A page where the user can choose between login and registering
 */
export default class LoginOrRegisterPage extends React.PureComponent<LoginOrRegisterPageProps> {
    /**
     * Render the page
     */
   render(){
      return (
        <div className="loginCenterWrapper">
            <div className="loginSpacer">
            <h1>Login or register</h1>
                <div className="loginFormContainer">
                <p>Please login using an existing {this.props.userType} profile or register as a new {this.props.userType}.</p>
                    <div className="container">
                        <div className="button">
                            <Link className="link makeDonation" to={routes.loginRedirect.path}>
                                <Button
                                    withThrobber={false}
                                    text={"Login"}
                                    width="100%"
                                    height={50}
                                    fontSize={16}/>
                            </Link>
                        </div>
                        <div className="button">
                            <Link className="link makeDonation" to={this.props.userType === UserTypes.PRODUCER ? routes.registerProducer.path : routes.registerReceiver.path}>
                                <Button
                                    withThrobber={false}
                                    text={"Register"}
                                    width="100%"
                                    height={50}
                                    fontSize={16}/>
                                </Link>
                        </div>
                        <div className="about-link">
                            <Link className="link" to={routes.register.path}>
                                Learn more about <b>PolloPollo</b>
                            </Link>
                    </div>
                    </div>
                </div>
            </div>
            

            <style jsx>{`
                h1{
                    font-family: ${ fonts.heading};
                    font-weight: 500;
                    line-height: 1;
                    text-align: center;
                    margin-bottom: 30px;
                }

                p {
                    text-align: center;
                    margin-bottom: 30px;
                    line-height: 1.5;
                }
                
                .button {
                    margin-bottom: 30px;
                    & :global(> button) {
                        font-size: 1.25rem;
                        padding: 0.75rem 1.25rem;
                    }
                }
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

                .about-link {
                    text-align: center;
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

                    .container {
                        max-width: 100%;
                    }
                }
            `}</style>
         </div>
      );
   }
}