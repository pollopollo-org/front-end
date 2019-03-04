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

                <h1>Register as new user</h1>
                <div>
                    <div className="section">
                        <input className="leftInput" placeholder="First name" onChange={event => this.setState({firstName: event.target.value,})}/>
                        <input placeholder="Last name" onChange={event => this.setState({lastName: event.target.value,})}/>
                    </div>
                    <div className="section">
                        <input className="leftInput" placeholder="Email" onChange={event => this.setState({password: event.target.value,})}/>
                        <select onChange={event => this.setState({country: event.target.value,})}>
                            <option value="Country">Country</option>
                        </select>
                    </div>
                    <div className="section">
                        <input type="password" className="leftInput" placeholder="Password"/>
                        <input type="password" placeholder="Confirm password" onChange={event => this.setState({password: event.target.value,})}/>
                    </div>
                    <div className="grid">
                        <div>
                            <h4>What type of user are you?</h4>
                            <div className="radioSection">
                                <div className="uType P"><input type="radio" className="userType" name="userType" value="producer" onChange={event => this.setState({userType: event.target.value,})}/><label>Producer</label></div>
                                <div className="uType R"><input type="radio" className="userType" name="userType" value="receiver" onChange={event => this.setState({userType: event.target.value,})}/><label>Receiver</label></div>
                            </div>
                        </div>
                        <div>
                            <button>Register</button>
                        </div>
                    </div>
                    
                    {/* <div className="conditionalSection">
                        {this.state.userType==="producer" && (
                            <input></input>
                        )}
                        {this.state.userType!=="" && (
                            <button>Submit</button>
                        )
                        }
                    </div> */}
                </div>


                <style jsx>{`
                    h1 {
                        color: #8C489F;
                        margin: 30px auto;
                        margin-bottom: 8px;
                        line-height: 30px;
                    }

                    select{
                        -webkit-appearance: none;
                        background: transparent;
                        height: 35px;
                        width: 254px;
                        text-indent: 9px;
                        border: 1px solid lightgray;
                        border-radius: 3px;
                        
                    }

                    input{
                        height: 30px;
                        width: 250px;
                        text-indent: 9px;
                        border: 1px solid lightgray;
                        border-radius: 3px;
                    }

                    .leftInput {
                        margin-right: 30px;
                    }

                    /*input::placeholder { 
                        color: gray; 
                    }*/

                    input.userType{
                        height: 17px;
                        width: 17px;
                        margin: 0px 10 0 0px;
                    }
                    .section{
                        margin: 20px auto;
                    }

                    .registerButton{
                        height: 30px;
                        width: 100px;
                    }

                    .uType {
                        display: inline-block;
                    }

                    label{
                        font-size: 16px;
                        margin-right: 30px;
                        color: #443266;
                    }

                    .allSection {
                        margin-left: 100px;
                        margin-bottom: 100px;
                        width: 540px;
                    }

                    button {
                        float: right;
                        
                        margin: 30px auto auto 49px;
                        background-color: #8C489F;
                        color: white;
                        border: none;
                        border-radius: 3px;
                        padding: 10px 104px;
                        transition: background-color 0.1s linear;
                        font-size: 12px;
                    }

                    button:hover {
                        background-color: #443266;
                    }

                    .grid {
                        display: flex;
                        width: 100%;
                    }

                    h4 {
                        margin-top: 5px;
                    }

                    @media only screen and (max-width: 666px) {
                        .section {
                            margin: 0;
                        }

                        input, select {
                            margin: 15px 0;
                        }

                        input.userType {
                            margin: 10px 0;
                        }


                        .allSection {
                            margin: auto;
                            text-align: center;
                            width: 254px;
                        }

                        .leftInput {
                            margin: 0;
                        }

                        h1 {
                            margin-bottom: 20px;
                        }

                        h4 {
                            margin: 10px 0;
                        }

                        label {
                            margin-left: 7px;
                            margin-right: 0;
                        }

                        .uType.P {
                            margin-right: 15px;
                        }

                        .radioSection {
                            text-align: center;
                        }

                        button {
                            margin: 15px;
                            padding: 12px 15px;
                            float: none;
                        }

                        .grid {
                            display: block;
                        }
                    }
                `}</style>

            </div>
        );
    }


}