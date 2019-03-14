import React from "react";
import { colors } from "src/ts/config";
import { fonts } from "src/ts/config/fonts";

import Countries from "src/assets/countries.json";
import PrioritisedCountries from "src/assets/data/prioritisedCountries.json";
import RegisterFormLabels from "src/assets/data/registerForm.json";

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
    constructor(props: any) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            country: "",
            userType: "producer",
            password: "",
            repeatedPassword: "",
        };
    }

    /**
     * Render the component
     */
    public render(): JSX.Element {
        return (
            <div className="allSection">

                <h1>{RegisterFormLabels.title}</h1>
                <form onSubmit={this.validate}>
                    <div className="section">
                        <input
                            className="leftInput"
                            placeholder={RegisterFormLabels.firstName}
                            maxLength={255}
                            required
                            onChange={event => this.setState({ firstName: event.target.value })}
                        />
                        <input
                            placeholder={RegisterFormLabels.lastName}
                            maxLength={255}
                            required
                            onChange={event => this.setState({ lastName: event.target.value })}
                        />
                    </div>
                    <div className="section">
                        <input
                            type="email"
                            className="leftInput"
                            placeholder={RegisterFormLabels.email}
                            maxLength={255}
                            required
                            onChange={event => this.setState({ password: event.target.value, })}
                        />
                        {this.renderSelect()}
                    </div>
                    <div className="section">
                        <input
                            type="password"
                            className="leftInput"
                            placeholder={RegisterFormLabels.password}
                            required
                            onChange={event => this.setState({ password: event.target.value, })}
                        />
                        <input
                            type="password"
                            placeholder={RegisterFormLabels.confirmPassword}
                            required
                            onChange={event => this.setState({ repeatedPassword: event.target.value, })}
                        />
                    </div>
                    <div className="grid">
                        <div>
                            <h4>{RegisterFormLabels.userType__title}</h4>
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
                                    <label htmlFor="producer">{RegisterFormLabels.userType__producer}</label>
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
                                    <label htmlFor="receiver">{RegisterFormLabels.userType__reciever}</label>
                                </div>
                            </div>
                        </div>
                        <div>
                            <button type="submit">{RegisterFormLabels.submit}</button>
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

                    /* center in the middle */
                    .allSection {
                        width: 540px;
                        height: calc(100% - 60px);
                        display: flex;
                        flex-direction: column;
                        margin: 30px auto;
                        justify-content: center;
                    }

                    .section{
                        margin: 20px auto;
                    }

                    input{
                        box-shadow: none;
                        height: 39px;
                        width: 250px;
                        text-indent: 9px;
                        border: 1px solid ${ colors.pale}; 
                        border-transition: border-color 0.15s linear;
                        color: ${ colors.black};
                        border-radius: 3px;
                        font-family: ${ fonts.text};
                        font-size: 16px;
                        font-weight: 300;

                        /** Remove box-shadow on iOS */
                        background-clip: padding-box;

                        &::placeholder {
                            color: ${ colors.gray};
                            opacity: 1;
                        }
                    }

                    /* Set border styling when clicked on */
                    input:focus {
                        border: 1px solid ${ colors.secondary};
                    }   

                    .leftInput {
                        margin-right: 30px;
                    }

                    input.userTypeButton {
                        height: 17px;
                        width: 17px;
                        margin: 0px 10 0 0px;
                    }

                    option[value = ""][disabled] {
                        display: none;
                    }

                    .grid {
                        display: flex;
                        width: 100%;
                    }

                    .userType {
                        display: inline-flex;
                        align-items: center;
                    }

                    label{
                        font-size: 16px;
                        margin-right: 30px;
                    }

                    button {
                        float: right;

                        margin: 30px auto auto 49px;
                        background-color: ${ colors.secondary};
                        color: white;
                        border: none;
                        border-radius: 2px;
                        padding: 10px 104px;
                        transition: background-color 0.1s linear;
                        font-size: 16px;
                        font-family: ${ fonts.heading};
                        font-weight: 300;
                        width: 254px;
                        cursor: pointer;
                    }

                    button:hover {
                        background-color: ${ colors.primary};
                    }

                    @media only screen and (max-width: 768px) {
                        /* Center in the middle */
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

                        .leftInput {
                            margin: 0;
                        }

                        .grid {
                            display: block;
                        }

                        .radioSection {
                            text-align: center;
                            font-family: ${ fonts.text};
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
     * Internal renderer that renders the select of the application
     */
    private renderSelect(): JSX.Element {
        return (
            <select
                required
                onChange={event => this.setState({ country: event.target.value })}
                className={`${this.state.country === "" ? "inactive" : "active"}`}
            >
                <option disabled selected value="">Select country</option>
                <optgroup>
                    {PrioritisedCountries.map((country) => {
                        return (
                            <option value={country.Code}>{country.Name}</option>
                        );
                    })}
                </optgroup>
                <optgroup>
                    {Countries.map((country) => {
                        // Only render non-prioritised countries in this list
                        // (important countries has already been rendered)
                        if (PrioritisedCountries.findIndex((priority) => priority.Code !== country.Code)) {
                            return null;
                        }

                        return (
                            <option value={country.Code}>{country.Name}</option>
                        );
                    })}
                </optgroup>

                <style jsx>{`
                    select{
                        -webkit-appearance: none;
                        background: transparent;
                        height: 43px;
                        width: 254px;
                        text-indent: 9px;
                        border: 1px solid ${ colors.pale}; 
                        border-transition: border-color 0.15s linear;
                        border-radius: 3px;
                        font-size: 16px;
                        font-weight: 300;
                        font-family: ${ fonts.text};
                    }

                    select.inactive {
                        color: ${ colors.gray};
                    }

                    select.active {
                        color: ${ colors.black};
                    }

                    select:focus {
                        border: 1px solid ${ colors.secondary};
                    }

                    @media only screen and (max-width: 768px) {
                        select {
                            margin: 15px 0;
                            width: 100%;
                            box-sizing: border-box;
                            max-width: 400px;
                        }
                    }
                `}</style>
            </select>
        );
    }

    /**
     * Internal helper that should be triggered once a userType radio button
     * should be clicked
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
        else if (this.state.country.match(/[^0-9]+/)) {
            alert("There was an error with the selected country.")
            return false;
        }
        else if (this.state.password !== this.state.repeatedPassword) {
            alert("Passwords must match.");
            return false;
        }

        return true;
    }
}
