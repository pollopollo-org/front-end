import React from "react";

type RegisterFormState = {
    /**
     * first name
     */
    firstName: string;
    /**
     * last name
     */
    lastName: string;
    /**
     * email
     */
    email: string;
    /**
     * country
     */
    country: string;
    /**
     * user type, producer or receiver
     */
    userType: string; 
    /**
     * password
     */
    password: string;
    /**
     * repeated password
     */
    repeatedPassword: string;
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
            repeatedPassword: "",
        };
    }

    /**
     * Render the component
     */
    public render(): JSX.Element {
        return(
            <div className="allSection">

                <h1>Register as new user</h1>
                <form onSubmit={this.validate}>
                    <div className="section">
                        <input className="leftInput" placeholder="First name" required onChange={event => this.setState({firstName: event.target.value,})}/>
                        <input placeholder="Last name" required onChange={event => this.setState({lastName: event.target.value,})}/>
                    </div>
                    <div className="section">
                        <input type="email" className="leftInput" placeholder="Email" required onChange={event => this.setState({password: event.target.value,})}/>
                        <select 
                            required 
                            onChange={event => this.setState({country: event.target.value})}
                            className={`${this.state.country === "" ? "inactive" : "active"}`}
                        >
                            <option disabled selected value="">Select country</option>
                            <option value="DA">dk</option>
                        </select>
                    </div>
                    <div className="section">
                        <input type="password" className="leftInput" placeholder="Password" required onChange={event => this.setState({password: event.target.value,})}/>
                        <input type="password" placeholder="Confirm password" required onChange={event => this.setState({repeatedPassword: event.target.value,})}/>
                    </div>
                    <div className="grid">
                        <div>
                            <h4>What type of user are you?</h4>
                            <div className="radioSection">
                                <div className="userType P"><input type="radio" className="userTypeButton" name="userType" value="producer" checked onChange={event => this.setState({userType: event.target.value,})}/><label>Producer</label></div>
                                <div className="userType R"><input type="radio" className="userTypeButton" name="userType" value="receiver" onChange={event => this.setState({userType: event.target.value,})}/><label>Receiver</label></div>
                            </div>
                        </div>
                        <div>
                            <button type="submit">Register</button>
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
                </form>


                <style jsx>{`
                    h1 {
                        color: #8C489F;
                        margin: 30px auto;
                        margin-bottom: 8px;
                        line-height: 30px;
                    }

                    h4 {
                        margin-top: 5px;
                    }

                    .allSection {
                        margin-left: 100px;
                        margin-bottom: 100px;
                        width: 540px;
                    }

                    .section{
                        margin: 20px auto;
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

                    input.userTypeButton {
                        height: 17px;
                        width: 17px;
                        margin: 0px 10 0 0px;
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

                    select.inactive {
                        color: gray;
                    }

                    select.active {
                        color: black;
                    }

                    option[value = ""][disabled] {
                        display: none;
                    }

                    .grid {
                        display: flex;
                        width: 100%;
                    }

                    .userType {
                        display: inline-block;
                    }

                    label{
                        font-size: 16px;
                        margin-right: 30px;
                        color: #443266;
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

                    @media only screen and (max-width: 666px) {
                        .allSection {
                            margin: auto;
                            text-align: center;
                            width: 254px;
                        }

                        h1 {
                            margin-bottom: 20px;
                        }

                        h4 {
                            margin: 10px 0;
                        }
                        
                        .section {
                            margin: 0;
                        }

                        input, select {
                            margin: 15px 0;
                        }

                        input.userTypeButton {
                            margin: 10px 0;
                        }

                        .leftInput {
                            margin: 0;
                        }

                        .grid {
                            display: block;
                        }

                        .radioSection {
                            text-align: center;
                        }

                        .userType.P {
                            margin-right: 15px;
                        }

                        label {
                            margin-left: 7px;
                            margin-right: 0;
                        }

                        button {
                            margin: 15px;
                            padding: 12px 15px;
                            float: none;
                        }

                    }
                `}</style>

            </div>
        );
    }

    /**
     * Function for validating country and password
     */
    private validate = (evt: React.FormEvent) => {
        evt.preventDefault();
        if (this.state.country === "") {
            alert("Please choose a country.");
            return false;
        }
        else if (this.state.password !== this.state.repeatedPassword) {
            alert("Passwords must match.");
            return false;
        } else {
            return true;
        }
    }
}