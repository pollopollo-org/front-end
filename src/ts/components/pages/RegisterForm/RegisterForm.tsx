import React from "react";
import { colors, routes } from "src/ts/config";
import { fonts } from "src/ts/config/fonts";

import { RouterProps, withRouter } from "react-router";
import registerFormJson from "src/assets/data/registerForm.json";

import { SelectCountry } from "src/ts/components/utils/SelectCountry";

import { apis } from "src/ts/config/apis";
import { injectStore } from "src/ts/store/injectStore";
import { Store } from "src/ts/store/Store";
import { asyncTimeout } from "src/ts/utils";
import { Button } from "src/ts/components/utils";
import { alertApiError } from "src/ts/utils/alertApiError";
import { createUser } from "src/ts/utils/createUser";

type RegisterFormProps = {
    /**
     * Contains a reference to the main store of the application
     */
    store: Store;
} & RouterProps;

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
class UnwrappedRegisterForm extends React.PureComponent<RegisterFormProps, RegisterFormState>{
    /**
     * State of the register form, all fields initially set to null
     */
    public readonly state: RegisterFormState = {};

    /**
     * Render the component
     */
    // tslint:disable-next-line max-func-body-length
    public render(): JSX.Element {
        return (
            <div className="allSection">
                <h1>{ registerFormJson.title }</h1>
                <form onSubmit={this.onSubmit}>
                    {this.renderInputFields()}
                    <div className="grid">
                        {this.renderRadioButtons()}
                        {this.renderSubmitButton()}
                    </div>
                </form>

                <style jsx>{`
                    h1 {
                        margin: 0 0 8px;
                        line-height: 30px;
                        text-align: center;

                    }

                    h2 {
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

                    /**
                     * Layout for radio buttons
                     */
                    .grid {
                        display: flex;
                        width: 100%;
                    }

                    /**
                     * Restyling to fit smaller screens and mobile
                     */
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

                        h2 {
                            margin: 10px 0;
                        }

                        .grid {
                            display: block;
                        }
                    }
                `}</style>

            </div>
        );
    }

    /**
     * Internal renderer that renders the input fields
     */
    private renderInputFields(): React.ReactNode {
        return (
            <React.Fragment>
            {/* First and last name */}
            <div className="section">
                <input
                    className="leftInput"
                    placeholder={registerFormJson.firstName}
                    maxLength={255}
                    required
                    aria-required={true}
                    onChange={this.onFirstnameChanged}
                />
                <input
                    placeholder={registerFormJson.lastName}
                    maxLength={255}
                    required
                    aria-required={true}
                    onChange={this.onLastnameChanged}
                />
            </div>
            {/* Email and country */}
            <div className="section">
                <input
                    type="email"
                    className="leftInput"
                    placeholder={ registerFormJson.email }
                    maxLength={255}
                    required
                    aria-required={true}
                    onChange={this.onEmailChanged}
                />
                <SelectCountry onChange={this.newCountrySelected} currentCountry={this.state.country}/>
            </div>
            {/* Password */}
            <div className="section">
                <input
                    type="password"
                    className="leftInput"
                    placeholder={registerFormJson.password}
                    required
                    aria-required={true}
                    onChange={this.onPasswordChanged}
                />
                <input
                    type="password"
                    placeholder={registerFormJson.confirmPassword}
                    required
                    aria-required={true}
                    onChange={this.onValidationPasswordChanged}
                />
            </div>
            <style jsx>{`
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
                        border: 1px solid ${ colors.pale };
                        border-transition: border-color 0.15s linear;
                        color: ${ colors.black};
                        border-radius: 3px;
                        font-family: ${ fonts.text};
                        font-size: 16px;
                        font-weight: 300;

                        /* Remove box-shadow on iOS */
                        background-clip: padding-box;

                        &::placeholder {
                            color: ${ colors.gray };
                            opacity: 1;
                        }
                    }

                    /* Set border styling when clicked on */
                    input:focus {
                        border: 1px solid ${ colors.secondary };
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
                     * Restyling to fit smaller screens and mobile
                     */
                    @media only screen and (max-width: 768px) {
                        .section {
                            margin: 0;
                        }

                        input {
                            margin: 15px 0;
                            width: 100%;
                            box-sizing: border-box;
                            max-width: 400px;
                        }

                        /**
                         * All input fields are now made to be in a single column rather than two
                         */
                        .leftInput {
                            margin: 0;
                        }
                    }
                `}</style>
            </React.Fragment>
        );
    }

    /**
     * Internal renderer that renders the radio buttons for choosing user type
     */
    private renderRadioButtons(): React.ReactNode {
        return (
            <div>
                <h2>{registerFormJson.userType__title}</h2>
                <div className="radioSection">
                    <div className="userType P">
                        <input
                            type="radio"
                            className="userTypeButton"
                            name="userType"
                            id="Producer"
                            value="Producer"
                            aria-checked={this.state.userType === "Producer"}
                            checked={this.state.userType === "Producer"}
                            onChange={this.onUserTypeClick}
                        />
                        <label htmlFor="Producer">{registerFormJson.userType__producer}</label>
                    </div>
                    <div className="userType R">
                        <input
                            type="radio"
                            className="userTypeButton"
                            name="userType"
                            id="Receiver"
                            value="Receiver"
                            aria-checked={this.state.userType === "Receiver"}
                            checked={this.state.userType === "Receiver"}
                            onChange={this.onUserTypeClick}
                        />
                        <label htmlFor="Receiver">{registerFormJson.userType__reciever}</label>
                    </div>
                </div>

                <style jsx>{`
                    /**
                     * Radio buttons for usertype
                     */
                    input.userTypeButton {
                        height: 17px;
                        width: 17px;
                        margin: 0px 10 0 0px;
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
                     * Restyling to fit smaller screens and mobile
                     */
                    @media only screen and (max-width: 768px) {
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
                    }
                `}</style>
            </div>
        );
    }

    /**
     * Internal renderer that renders the submit button
     */
    private renderSubmitButton(): React.ReactNode {
        return (
            <div className="button">
                <Button 
                    withThrobber={true} 
                    text={registerFormJson.submit}
                    width={254}
                    heigth={43}
                    fontSize={16}
                    type={"submit"}
                    isPending={this.state.isPending}
                    throbberSize={24}/>
                <style jsx>{`
                    .button {
                        float: right;
                        margin: 30px auto auto 49px;
                        position: relative;
                    }

                    /**
                     * Restyling to fit smaller screens and mobile
                     */
                    @media only screen and (max-width: 768px) {
                        .button {
                            margin: 10px auto 20px auto;
                            float: none;

                            & :global(button) {
                                width: 100%;
                                max-width: 400px;
                            }
                        }
                    }
                `}</style>
            </div>
        );
    }


    /**
     * Method that'll get triggered each time the input is changed, in order to
     * properly update state
     */
    private onFirstnameChanged = (evt: React.FormEvent<HTMLInputElement>) => {
        this.setState({ firstName: evt.currentTarget.value });
    }

    /**
     * Method that'll get triggered each time the input is changed, in order to
     * properly update state
     */
    private onLastnameChanged = (evt: React.FormEvent<HTMLInputElement>) => {
        this.setState({ lastName: evt.currentTarget.value });
    }

    /**
     * Method that'll get triggered each time the input is changed, in order to
     * properly update state
     */
    protected onEmailChanged = (evt: React.FormEvent<HTMLInputElement>) => {
        this.setState({ email: evt.currentTarget.value });
    }

    /**
     * Method that'll get triggered each time the input is changed, in order to
     * properly update state
     */
    protected onPasswordChanged = (evt: React.FormEvent<HTMLInputElement>) => {
        this.setState({ password: evt.currentTarget.value });
    }

    /**
     * Method that'll get triggered each time the input is changed, in order to
     * properly update state
     */
    private onValidationPasswordChanged = (evt: React.FormEvent<HTMLInputElement>) => {
        this.setState({ repeatedPassword: evt.currentTarget.value });
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

        if (!this.validate() || this.state.isPending) {
            return;
        }

        const endPoint = apis.user.create.path;

        try {
            this.setState({ isPending: true });
            const startedAt = performance.now();

            const body = JSON.stringify({
                firstName: this.state.firstName,
                surname: this.state.lastName,
                password: this.state.password,
                email: this.state.email,
                userRole: this.state.userType,
                country: this.state.country
            });

            const response = await fetch(endPoint, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("userJWT", data.token);

                this.props.store.user = createUser(data.userDTO);

                await asyncTimeout(Math.max(0, 500 - (performance.now() - startedAt)));
                this.props.history.push(routes.root.path);
            } else {
                alertApiError(response.status, apis.user.create.errors, this.props.store);
                this.setState({ isPending: false });
            }
        } catch (err) {
            alert("Something went wrong while sending your request, please try again later.");
            this.setState({ isPending: false });
        }
    }

    /**
     * Is passed down to SelectCountry and allows us to extract its value
     */
    private newCountrySelected = (newCountry:string) => {
        this.setState({country: newCountry,});
    }
}

export const RegisterForm = withRouter(injectStore((store) => ({ store }), UnwrappedRegisterForm));
