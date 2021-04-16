import React from "react";
import { colors } from "src/ts/config";
import { fonts } from "src/ts/config/fonts";

import { RouterProps, withRouter} from "react-router";
import registerFormJson from "src/assets/data/registerForm.json";

import { SelectCountry } from "src/ts/components/utils/SelectCountry";

import { injectStore } from "src/ts/store/injectStore";
import { Store } from "src/ts/store/Store";
import { Button } from "src/ts/components/utils";
import { postUser, UserTypes } from "src/ts/models/UserModel";
import { postDonor } from "src/ts/models/DonorModel";

type RegisterFormProps = {
    /**
     * The type of user to be registered, if inferred before reaching the registerform
     */
    inferredUserType: UserTypes | undefined;
    /**
     * The path to go to after registrering
     */
    redirectPath: string;
    /**
     * Contains a reference to the main store of the application
     */
    store: Store;
} & RouterProps;

export type RegisterFormState = {
    /**
     * The first name of the user who wants to register
     */
    firstName: string;
    /**
     * The last name of the user who wants to register
     */
    lastName: string;
    /**
     * The email adress of the user who wants to register
     */
    email: string;
    /**
     * The country the user is living in
     */
    country: string;
    /**
     * The street the user lives on
     */
    street: string;
    /**
     * The street number the user lives in
     */
    streetNumber: string;
    /**
     * The zipcode the user lives in
     */
    zipcode: string;
    /**
     * The city the user lives in
     */
    city: string;
    /**
     * The type of profile the user wants to create, either producer or receiver
     */
    userType: string;
    /**
     * The password the user wants to use for their profile
     */
    password: string;
    /**
     * The password again for validation reasons
     */
    repeatedPassword: string;

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
    public readonly state: RegisterFormState = {
        firstName: "",
        lastName: "",
        email: "",
        country: "",
        street: "",
        streetNumber: "",
        zipcode: "",
        city: "",
        userType: this.props.inferredUserType === undefined ? "" : this.props.inferredUserType,
        password: "",
        repeatedPassword: "",
    };

    /**
     * Render the component
     */
    public render(): JSX.Element {
        return (
            <div className="allSection">
                <h1 className="register-heading">{ registerFormJson.title }</h1>
                <form className="register-form" onSubmit={this.onSubmit}>
                    {this.props.inferredUserType === undefined ? this.renderRadioButtons() : this.renderPreinferredUserType()}
                    {this.renderInputFields()}
                    {this.renderSubmitButton()}
                </form>

                <style jsx>{`

                    .register-heading {
                        margin-top: 3rem;
                        text-align: center;
                    }

                    h2 {
                        margin-top: 5px;
                    }

                    /* center in the middle */
                    .allSection {
                        width: 540px;
                        height: calc(100% - 60px);
                        margin: auto;
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
                            
                        }
                    }
                `}</style>

            </div>
        );
    }

    /**
     * Internal renderer that renders the input fields
     */
    // tslint:disable-next-line max-func-body-length
    private renderInputFields(): React.ReactNode {
        return (
            <React.Fragment>
            {/* First */}
            {this.state.userType !== UserTypes.DONOR &&
            <div className="input-field">
                <input
                    placeholder={registerFormJson.firstName}
                    maxLength={255}
                    required
                    aria-required={true}
                    onChange={this.onFirstnameChanged}
                />
                <span className="required"></span>
            </div>
            }
            {/* Lastname */}
            {this.state.userType !== UserTypes.DONOR &&
            <div className="input-field">
                <input
                    placeholder={registerFormJson.lastName}
                    maxLength={255}
                    required
                    aria-required={true}
                    onChange={this.onLastnameChanged}
                />
                <span className="required"></span>
            </div>
            }

            {/* Email and country */}
            <div className="input-field">
                <input
                    type="email"
                    placeholder={ registerFormJson.email }
                    maxLength={255}
                    required
                    aria-required={true}
                    onChange={this.onEmailChanged}
                />
                <span className="required"></span>
            </div>

            {this.state.userType !== UserTypes.DONOR &&
            <div className="input-field">
                <SelectCountry onChange={this.newCountrySelected} currentCountry={this.state.country}/>
                <span className="required"></span>
            </div>
            }
            
            {/* Address - only if the user is producer */}
            {this.state.userType === UserTypes.PRODUCER &&
                <div className="input-field">
                    <input
                        placeholder={registerFormJson.street}
                        maxLength={255}
                        required
                        aria-required={true}
                        onChange={this.onStreetChanged}
                    />
                    <span className="required"></span>
                </div>
            }
            {this.state.userType === UserTypes.PRODUCER &&
                <div className="input-field">
                    <input
                        placeholder={registerFormJson.streetNumber}
                        maxLength={255}
                        required
                        aria-required={true}
                        onChange={this.onStreetNumberChanged}
                    />
                    <span className="required"></span>
                </div>
            }
            

            {this.state.userType === UserTypes.PRODUCER &&
                <div className="input-field">
                    <input
                        placeholder={registerFormJson.zipcode}
                        maxLength={255}
                        onChange={this.onZipcodeChanged}
                    />
                </div>
            }
            {this.state.userType === UserTypes.PRODUCER &&
                <div className="input-field">
                    <input
                        placeholder={registerFormJson.city}
                        maxLength={255}
                        required
                        aria-required={true}
                        onChange={this.onCityChanged}
                    />
                    <span className="required"></span>
                </div>
            }

            {/* Password */}
            <div className="input-field">
                    <input
                        type="password"
                        placeholder={registerFormJson.password}
                        required
                        aria-required={true}
                        onChange={this.onPasswordChanged}
                    />
                <span className="required"></span>
            </div>

            {/* Confirm Password */}
            <div className="input-field">
                <input
                    type="password"
                    placeholder={registerFormJson.confirmPassword}
                    required
                    aria-required={true}
                    onChange={this.onValidationPasswordChanged}
                />
                <span className="required"></span>
            </div>

            <style jsx>{`
                    /**
                     * Text fields' standard styling for the project
                     */
                    
                    .register-form {
                        display: flex;
                    }

                    .input-field {
                        margin-bottom: 1rem;
                    }

                    .input-wrap {
                        flex-wrap: wrap;
                    }

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

                    .input-label {
                        color: ${ colors.gray };
                    }

                    /* Set border styling when clicked on */
                    input:focus {
                        border: 1px solid ${ colors.secondary };
                    }

                    /**
                    * Three of the input fields have this classname,
                    * it allows us to keep a bit of distance between the inputs
                    * to the left and those to the right
                    */
                    .leftInput {
                        margin-right: 30px;
                    }

                    .required, .required-select {
                        position: relative;
                        display: inline-block;
                        z-index: 1;
                    }

                    .required:after, .required-select:after {
                        content: "*";
                        position: absolute;
                        right: 7px;
                        top: 0px;
                        color: red;
                        z-index: 5;
                        font-size: 1em;
                        font-family: 'Cabin', helvetica, arial, sans-serif;
                    }

                    /**
                     * Restyling to fit smaller screens and mobile
                     */
                    @media only screen and (max-width: 768px) {
                        input {
                            width: 100%;
                            box-sizing: border-box;
                            max-width: 400px;
                        }

                        /**
                         * All input fields are now made to be in a single column rather than two
                         */
                        .leftInput {
                            margin-right: 0;
                        }

                        .required, .required-select {
                            display: initial;
                            max-width: 400px;
                        }

                        .required:after, .required-select:after {
                            top: 5px;
                        }
                    }
                `}</style>
            </React.Fragment>
        );
    }

    /**
     * Internal renderer that render preinfeered usertype
     */
    private renderPreinferredUserType(): React.ReactNode {
        return (
            <div>
                {this.props.inferredUserType === UserTypes.PRODUCER 
                ? <p>{registerFormJson.producerProfileText}</p> 
                : <p>{registerFormJson.receiverProfileText}</p>}
                
                <style jsx>{`
                    p {
                        text-align: center;
                    }
                `}</style>
            </div>
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

                    <div className="userType D">
                        <input
                            type="radio"
                            className="userTypeButton"
                            name="userType"
                            id="Donor"
                            value="Donor"
                            aria-checked={this.state.userType === UserTypes.DONOR}
                            checked={this.state.userType === UserTypes.DONOR}
                            onChange={this.onUserTypeClick}
                        />
                        <label className="register-radio-button" htmlFor="Donor">{registerFormJson.userType__donor}</label>
                    </div>

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
                        <label className="register-radio-button" htmlFor="Producer">{registerFormJson.userType__producer}</label>
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
                        <label className="register-radio-button" htmlFor="Receiver">{registerFormJson.userType__reciever}</label>
                    </div>
                </div>

                <style jsx>{`
                    h2 {
                        text-align: center;
                        margin: 15px 0 7px 0;
                    }

                    .radioSection {
                        text-align: center;
                        margin-top: 3rem;
                        margin-bottom: 1rem;
                    }

                    .userTypeButton{
                        margin: 0px;
                        margin-right: 5px;
                    }

                    .register-radio-button {
                        margin-right: 15px;
                    }
                    
                    /**
                     * Radio buttons
                     */
                    .userType {
                        display: inline-flex;
                        align-items: center;
                    }

                    h2::after {
                        content: "*";
                        position: absolute;
                        color: red;
                        font-size: 0.8em;
                        font-family: 'Cabin', helvetica, arial, sans-serif;
                    }

                    /**
                     * Restyling to fit smaller screens and mobile
                     */
                    @media only screen and (max-width: 768px) {
                        h2 {
                            margin: 5px 0;
                        }
                        .radioSection {
                            margin-left: 0;
                            font-family: ${ fonts.text };
                            font-weight: 300;
                        }

                        .userType.P {
                            margin-right: 15px;
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
                    height={43}
                    fontSize={16}
                    type={"submit"}
                    isPending={this.state.isPending}
                    throbberSize={24}/>
                <style jsx>{`

                    .button {
                        margin-top: 20px;
                        text-align: center;
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
    protected onStreetChanged = (evt: React.FormEvent<HTMLInputElement>) => {
        this.setState({ street: evt.currentTarget.value });
    }

    /**
     * Method that'll get triggered each time the input is changed, in order to
     * properly update state
     */
    protected onStreetNumberChanged = (evt: React.FormEvent<HTMLInputElement>) => {
        this.setState({ streetNumber: evt.currentTarget.value });
    }

    /**
     * Method that'll get triggered each time the input is changed, in order to
     * properly update state
     */
    protected onZipcodeChanged = (evt: React.FormEvent<HTMLInputElement>) => {
        this.setState({ zipcode: evt.currentTarget.value });
    }

    /**
     * Method that'll get triggered each time the input is changed, in order to
     * properly update state
     */
    protected onCityChanged = (evt: React.FormEvent<HTMLInputElement>) => {
        this.setState({ city: evt.currentTarget.value });
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
            this.props.store.currentErrorMessage = "Please choose a country.";
            return false;
        }
        else if (this.state.userType !== UserTypes.DONOR && (!this.state.country || !this.state.country.match(/[^0-9]+/))) {
            this.props.store.currentErrorMessage = "There was an error with the selected country.";

            return false;
        }
        else if (this.state.password !== this.state.repeatedPassword) {
            this.props.store.currentErrorMessage = "Passwords must match.";

            return false;
        } else if (!this.state.password || this.state.password.length < 8) {
            this.props.store.currentErrorMessage = "Passwords must contain more than or 8 characters.";

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

        this.setState({ isPending: true });

        if(this.state.userType === UserTypes.DONOR) await postDonor(this.state, this.props.store, this.props.history, this.props.redirectPath);
        else await postUser(this.state, this.props.store, this.props.history, this.props.redirectPath);
        this.setState({ isPending: false });
    }

    /**
     * Is passed down to SelectCountry and allows us to extract its value
     */
    private newCountrySelected = (newCountry:string) => {
        this.setState({country: newCountry,});
        console.log(this.state.country);
    }
}

// @ts-ignore
export const RegisterForm = withRouter(injectStore((store) => ({ store }), UnwrappedRegisterForm));
