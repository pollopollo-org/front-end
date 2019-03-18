import React from "react";
import { colors, routes } from "src/ts/config";
import { fonts } from "src/ts/config/fonts";

import { RouterProps, withRouter } from "react-router";
import Countries from "src/assets/countries.json";
import PrioritisedCountries from "src/assets/data/prioritisedCountries.json";
import RegisterFormLabels from "src/assets/data/registerForm.json";
import { Throbber } from "../../utils";

type RegisterFormState = {
    /**
     * The first name of the user who wants to register
     */
    firstName?: string;
    /**
     * The last name of the user who wants to register
     */
    lastName?: string;
    /**
     * The email adress of the user who wants to register
     */
    email?: string;
    /**
     * The country the user is living in
     */
    country?: string;
    /**
     * The type of profile the user wants to create, either producer or receiver
     */
    userType?: string;
    /**
     * The password the user wants to use for their profile
     */
    password?: string;
    /**
     * The password again for validation reasons
     */
    repeatedPassword?: string;

    /**
     * Specifies whether or not we're currently attempting to create a user
     */
    isPending?: boolean;
}

/**
 * A page where the user can register for the project
 */
class UnwrappedRegisterForm extends React.PureComponent<RouterProps, RegisterFormState>{
    /**
     * State of the register form, all fields initially set to null
     */
    public readonly state: RegisterFormState = {};

    /**
     * Render the component
     */
    public render(): JSX.Element {
        return (
            <div className="allSection">
                <h1>{ RegisterFormLabels.title }</h1>
                <form onSubmit={this.onSubmit}>
                    {/* First and last name */}
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
                    {/* Email and country */}
                    <div className="section">
                        <input
                            type="email"
                            className="leftInput"
                            placeholder={RegisterFormLabels.email}
                            maxLength={255}
                            required
                            onChange={event => this.setState({ password: event.target.value, })} />
                        {this.renderSelect()}
                    </div>
                    {/* Password */}
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
                    {/* Usertype */}
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
                        {/* Submit button */}
                        <div>
                            <button type="submit" className={this.state.isPending ? "isPending" : ""}>
                                <span className="text">{RegisterFormLabels.submit}</span>
                                <span className="throbber">
                                    <Throbber size={24} relative={true} inverted={true} />
                                </span>
                            </button>
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

                    .section {
                        margin: 20px auto;
                    }

                    input {
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

                        /* Remove box-shadow on iOS */
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
                        position: relative;

                        & .throbber {
                            /**
                             * Position a throbber in the middle to be displayed
                             * while requests are ongoing
                             */
                            position: absolute;
                            left: calc(50% - 12px);
                            top: calc(50% - 12px);
                            opacity: 0;
                            overflow: hidden;

                            /**
                             * prepare transitions
                             */
                            transition: opacity 0.2s linear;
                        }

                        & .text {
                            opacity: 1;
                            transform: scale(1);

                            /**
                             * prepare transitions
                             */
                            transition: opacity 0.2s linear;
                        }

                        &.isPending .throbber {
                            opacity: 1;
                            transform: scale(1);
                        }

                        &.isPending .text {
                            opacity: 0;
                            transform: scale(0.5);
                        }
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
                className={`${!this.state.country ? "inactive" : "active"}`}
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
    private validate = () => {
        if (this.state.country === null) {
            alert("Please choose a country.");
            return false;
        }
        else if (!this.state.country || !this.state.country.match(/[^0-9]+/)) {
            alert("There was an error with the selected country.")
            return false;
        }
        else if (this.state.password !== this.state.repeatedPassword) {
            alert("Passwords must match.");
            return false;
        } else if (!this.state.password || this.state.password.length < 8) {
            alert("Passwords must contain more than or 8 characters.");
            return false;
        }

        return true;
    }

    /**
     * Internal handler that should be triggered once the form is ready to submit
     */
    private onSubmit = async (evt: React.FormEvent) => {
        evt.preventDefault();

        if (!this.validate()) {
            return;
        }

        // const endPoint = apis.user.create;

        // try {
        //     this.setState({ isPending: true });
        //     const startedAt = performance.now();

        //     await fetch(endPoint, {
        //         method: "POST",
        //         body: JSON.stringify({
        //             password: this.state.password,
        //             email: this.state.email,
        //         })
        //     });

        //     await asyncTimeout(Math.max(0, 500 - (performance.now() - startedAt)));
        // } catch (err) {
        //     alert("Either your password or email doesn't match, please try again.");
        // } finally {
        //     this.setState({ isPending: false });
        // }

        // Dummy
        this.setState({ isPending: true });
        setTimeout(
            () => {
                this.setState({ isPending: false });

                alert("Your user has been created and you have now been logged in!");
                this.props.history.push(routes.root.path);
            },
            2000,
        );
    }
}

export const RegisterForm = withRouter(props => <UnwrappedRegisterForm {...props} />);
