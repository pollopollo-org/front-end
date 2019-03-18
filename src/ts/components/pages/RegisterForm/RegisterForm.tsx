import React from "react";

import { colors } from "src/ts/config";
import { fonts } from "src/ts/config/fonts";

import RegisterFormLabels from "src/assets/data/registerForm.json";
import { SelectCountry } from "../../utils/SelectCountry";

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
    /**
     * State of the component
     */
    public state: RegisterFormState = {
        firstName: "",
        lastName: "",
        email: "",
        country: "",
        userType: "producer",
        password: "",
        repeatedPassword: "",
    };
    

    /**
     * Render the component
     */
    public render(): JSX.Element {
        return(
            <div className="allSection">

                <h1>{ RegisterFormLabels.title }</h1>
                <form onSubmit={this.validate}>
                    <div className="section">
                        <input 
                            className="leftInput" 
                            placeholder={ RegisterFormLabels.firstName } 
                            required 
                            onChange={event => this.setState({firstName: event.target.value })}
                        />
                        <input 
                            placeholder={ RegisterFormLabels.lastName } 
                            required 
                            onChange={event => this.setState({lastName: event.target.value })}
                        />
                    </div>
                    <div className="section">
                        <input 
                            type="email" 
                            className="leftInput" 
                            placeholder={ RegisterFormLabels.email } 
                            required 
                            onChange={event => this.setState({password: event.target.value,})}
                        />
                        <SelectCountry onChange={this.newCountrySelected}/>
                    </div>
                    <div className="section">
                        <input 
                            type="password" 
                            className="leftInput" 
                            placeholder={RegisterFormLabels.password } 
                            required 
                            onChange={event => this.setState({password: event.target.value,})}
                        />
                        <input 
                            type="password" 
                            placeholder={ RegisterFormLabels.confirmPassword } 
                            required 
                            onChange={event => this.setState({repeatedPassword: event.target.value,})}
                        />
                    </div>
                    <div className="grid">
                        <div>
                            <h4>{ RegisterFormLabels.userType__title }</h4>
                            <div className="radioSection">
                                <div className="userType P">
                                    <input
                                        type="radio"
                                        className="userTypeButton"
                                        name="userType"
                                        id="producer"
                                        value="producer"
                                        checked={this.state.userType === "producer"}
                                        onChange={this.onUserTypeClick}
                                    />
                                        <label htmlFor="producer">{ RegisterFormLabels.userType__producer }</label>
                                    </div>
                                <div className="userType R">
                                    <input
                                        type="radio"
                                        className="userTypeButton"
                                        name="userType"
                                        id="receiver"
                                        value="receiver"
                                        checked={this.state.userType === "receiver"}
                                        onChange={this.onUserTypeClick}
                                    />
                                    <label htmlFor="receiver">{ RegisterFormLabels.userType__reciever }</label>
                                </div>
                            </div>
                        </div>
                        <div>
                            <button type="submit">{ RegisterFormLabels.submit }</button>
                        </div>
                    </div>
                </form>


                <style jsx>{`
                    h1 {
                        margin: 0 0 8px;
                        line-height: 30px;
                        text-align: center;
                    }

                    h4 {
                        margin-top: 5px;
                    }

                    .allSection {
                        width: 540px;
                        height: calc(100% - 60px);
                        display: flex;
                        flex-direction: column;
                        margin: 30px auto;
                        justify-content: center;
                    }

                    /** 
                     * Sections surrounding the input fields
                     */
                    .section{
                        margin: 20px auto;
                    }

                    /**
                     * Text fields' standard styling for the project
                     */
                    input{
                        box-shadow: none;
                        height: 39px;
                        width: 250px;
                        text-indent: 9px;
                        border: 1px solid ${ colors.gray };
                        color: ${ colors.black };
                        border-radius: 3px;
                        font-family: ${ fonts.text };
                        font-size: 16px;
                        font-weight: 300;

                        /** Remove box-shadow on iOS */
                        background-clip: padding-box;

                        &::placeholder {
                            color: ${ colors.gray };
                            opacity: 1;
                        }
                    }

                    /** 
                    * Three of the input fields have this classname, 
                    * it allows us to keep a bit of distance between the inputs 
                    *to the left and those to the right
                    */
                    .leftInput {
                        margin-right: 30px;
                    }

                    /**
                     * Radio buttons for usertype
                     */
                    input.userTypeButton {
                        height: 17px;
                        width: 17px;
                        margin: 0px 10 0 0px;
                    }

                    /**
                     * Layout for radio buttons
                     */
                    .grid {
                        display: flex;
                        width: 100%;
                    }

                    /**
                     * Radio buttons
                     */
                    .userType {
                        display: inline-flex;
                        align-items: center;
                    }

                    label{
                        font-size: 16px;
                        margin-right: 30px;
                    }

                    /**
                     * Submit button
                     */
                    button {
                        float: right;

                        margin: 30px auto auto 49px;
                        background-color: ${ colors.secondary };
                        color: white;
                        border: none;
                        border-radius: 2px;
                        padding: 10px 104px;
                        transition: background-color 0.1s linear;
                        font-size: 16px;
                        font-family: ${ fonts.heading };
                        font-weight: 300;
                        width: 254px;
                        cursor: pointer;
                    }

                    button:hover {
                        background-color: ${ colors.primary };
                    }

                    /**
                     * Restyling to fit smaller screens and mobile
                     */
                    @media only screen and (max-width: 768px) {
                        .allSection {
                            margin: auto;
                            text-align: center;
                            width: 100%;
                            height: 100%;
                            box-sizing: border-box;
                            padding: 0 15px;
                        }

                        h1 {
                            font-size: 28px;
                            margin-top: 20px;
                            margin-bottom: 20px;
                        }

                        h4 {
                            margin: 10px 0;
                        }

                        .section {
                            margin: 0;
                        }

                        input {
                            margin: 15px 0;
                            width: 100%;
                            box-sizing: border-box;
                            max-width: 400px;
                        }

                        input.userTypeButton {
                            margin: 10px 0;
                        }

                        /**
                         * All input fields are now made to be in a single column rather than two
                         */
                        .leftInput {
                            margin: 0;
                        }

                        .grid {
                            display: block;
                        }

                        .radioSection {
                            text-align: center;
                            font-family: ${ fonts.text };
                            font-weight: 300;
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
     * Internal helper that should be triggered once a userType 
     * radio button is clicked
     */
    private onUserTypeClick = (evt: React.FormEvent<HTMLInputElement>) => {
        this.setState({ userType: evt.currentTarget.value });
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

    /**
     * Is passed down to SelectCountry and allows us to extract its value
     */
    private newCountrySelected = (newCountry:string) => {
        this.setState({country: newCountry,});
    }
}
