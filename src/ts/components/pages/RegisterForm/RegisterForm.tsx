import React from "react";

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

                <h1 className="headerText">Register as new user</h1>
                <div>
                    <div className="section">
                        <input className="nameInput" placeholder="Name"/>
                        <input className="countryInput" placeholder="Country"/>
                    </div>
                    <div className="section">
                        <input className="emailInput" placeholder="Email"/>
                    </div>
                    <div className="section">
                        <input type="password" className="firstPasswordInput" placeholder="Password"/>
                        <input type="password" className="secondPasswordInput" placeholder="Confirm password"/>
                    </div>
                    <div>
                        <div className="section">
                            <input type="radio" className="userType" name="userType" value="producer" onClick={this.setState}/><label>I am a producer</label>
                            <input type="radio" className="userType" name="userType" value="receiver"/><label>I am a receiver</label>
                        </div>
                    </div>
                    <div className="conditionalSection">
                        {}
                    </div>
                    <div className="behindFooter"/>
                </div>


                <style jsx>{`
                    .headerText{
                        color: #8C489F;
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
                        color: #443266;
                    }

                    .allSection{
                        margin-left: 50px;
                    }

                    .behindFooter{
                        height: 100px;
                    }
                `}</style>

            </div>
        );
    }
}