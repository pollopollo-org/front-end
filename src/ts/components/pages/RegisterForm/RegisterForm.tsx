import React from "react";

type RegisterFormState = {
    /**
     * hvad tror du det er
     */
    firstName: string;
    /**
     * hvad tror du det er
     */
    lastName: string;
    /**
     * hvad tror du det er
     */
    email: string;
    /**
     * hvad tror du det er
     */
    country: string;
    /**
     * hvad tror du det er
     */
    userType: string; 
    /**
     * hvad tror du det er
     */
    password: string;
}

/**
 * A page where the user can register for the project
 */
export class RegisterForm extends React.PureComponent<{}, RegisterFormState>{
    constructor(props:any){
        super(props);
        this.state={
            firstName: "",
            lastName: "",
            email: "",
            country: "",
            userType: "",
            password: "",
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
                        <input className="firstNameInput" placeholder="First name" onChange={event => this.setState({firstName: event.target.value,})}/>
                        <input className="lastNameInput" placeholder="Last name" onChange={event => this.setState({lastName: event.target.value,})}/>
                    </div>
                    <div className="section">
                        <input className="emailInput" placeholder="Email" onChange={event => this.setState({password: event.target.value,})}/>
                        <select className="countryInput" onChange={event => this.setState({country: event.target.value,})}>
                            <option value="Country">Country</option>
                        </select>
                    </div>
                    <div className="section">
                        <input type="password" className="firstPasswordInput" placeholder="Password"/>
                        <input type="password" className="secondPasswordInput" placeholder="Confirm password" onChange={event => this.setState({password: event.target.value,})}/>
                    </div>
                    <div>
                        <div className="section">
                            <input type="radio" className="userType" name="userType" value="producer" onChange={event => this.setState({userType: event.target.value,})}/><label>I am a producer</label>
                            <input type="radio" className="userType" name="userType" value="receiver" onChange={event => this.setState({userType: event.target.value,})}/><label>I am a receiver</label>
                        </div>
                    </div>
                    <div className="conditionalSection">
                        {this.state.userType==="producer" && (
                            <input></input>
                        )}
                        {this.state.userType!=="" && (
                            <button>Submit</button>
                        )
                        }
                    </div>
                    <div className="behindFooter"/>
                </div>


                <style jsx>{`
                    .headerText{
                        color: #8C489F;
                        margin: 30px auto;
                    }

                    select{
                        -webkit-appearance: none;
                        background: transparent;
                        height: 37px;
                        width: 254px;
                        margin-right: 30px;
                        text-indent: 9px;
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