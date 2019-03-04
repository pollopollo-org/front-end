import React from "react";
import registerForm from "src/assets/data/registerForm.json"
import { colors } from "src/ts/config/colors";

/**
 * A page where the user can register for the project
 */
export class RegisterForm extends React.PureComponent{
    constructor(props: Readonly<{}>){
        super(props);
        this.state={
            userType: "",
        };
    }

    /**
     * Literally rendering the component
     */
    public render(): JSX.Element {
        return(
            <div className="allSection">

                <h1 className="headerText">{registerForm.title}</h1>
                <div>
                    <div className="section">
                        <input className="nameInput" placeholder={registerForm.name}/>
                        <input className="countryInput" placeholder={registerForm.country}/>
                    </div>
                    <div className="section">
                        <input className="emailInput" placeholder={registerForm.email}/>
                    </div>
                    <div className="section">
                        <input type="password" className="firstPasswordInput" placeholder={registerForm.password}/>
                        <input type="password" className="secondPasswordInput" placeholder={registerForm.confirmPassword}/>
                    </div>
                    <div>
                        <div className="section">
                            <input type="radio" className="userType" name="userType" value="producer" onClick={this.setState}/><label>{registerForm.producer}</label>
                            <input type="radio" className="userType" name="userType" value="receiver"/><label>{registerForm.reciever}</label>
                        </div>
                    </div>
                    <div className="conditionalSection">
                        {}
                    </div>
                    <div className="behindFooter"/>
                </div>


                <style jsx>{`
                    .headerText{
                        color: ${colors.secondaryColor};
                        margin: 30px auto;
                    }

                    input{
                        height: 30px;
                        width: 250px;
                        margin-right: 30px;
                        text-indent: 9px;
                    }

                    input.userType{
                        height: 17px;
                        width: 17px;
                        margin: 0px 10px;
                    }
                    .section{
                        margin: 20px auto;
                    }

                    .registerButton{
                        height: 30px;
                        width: 100px;
                    }

                    label{
                        font-size: 20px;
                        margin-right: 30px;
                        color: ${colors.primaryColor};
                    }

                    .allSection{
                        margin-left: 50px;
                    }

                    .behindFooter{
                        height: 100px;
                    }

                    @media only screen and (max-width: 666px) {
                        .section {
                            margin: 0;
                        }

                        input {
                            margin: 10px 0;
                        }

                        input.userType {
                            margin: 10px 0;
                        }
                    }
                `}</style>

            </div>
        );
    }
}