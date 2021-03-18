import React from "react";
import { RouterProps, withRouter } from "react-router";
import editProfileJson from "src/assets/data/editProfile.json";
import { getSVG } from "src/assets/svg";
import { colors, fonts } from "src/ts/config";
import { injectStore } from "src/ts/store/injectStore";
import { Store } from "src/ts/store/Store";
import { isProducerUser } from "src/ts/utils/verifyUserModel";
import { isNullOrUndefined } from "util";
import { Button } from "src/ts/components/utils";
import { SelectCountry } from "src/ts/components/utils/SelectCountry";
import { editProfile, UserTypes } from "src/ts/models/UserModel";

type EditProfileProps = {
    /**
     * Contains a reference to the root store
     */
    store: Store;
} & RouterProps;

export type EditProfileState = {
    /**
     * user ID
     */
    userId: number;

    /**
     * The first name of the user
     */
    firstName: string;
    /**
     * The last name of the user
     */
    lastName: string;
    /**
     * The name of the street the user lives on
     */
    street: string;
    /**
     * The steet number the user lives in
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
     * The country the user lives in
     */
    country: string;
    /**
     * User type, producer or receiver
     */
    userType: string;
    /**
     * New password
     */
    password: string;
    /**
     * Repeated new password
     */
    repeatedPassword: string;
    /**
     * Old password to make sure it is the actual user who is changing the information
     */
    oldPassword: string;
    /**
     * A brief description of the user
     */
    description?: string;
    /**
     * Profile image
     */
    profilePicture?: Blob;
    /**
     * Wallet address - if producer user type
     */
    wallet?: string;
    /**
     * Wallet address
     */
    pairingLink?: string;

    /**
     * Specifies whether or not we're currently attempting to create a user
     */
    isPending?: boolean;
}

/**
 *  Page where a logged in producer can edit their profile
 */
class UnwrappedEditProfile extends React.PureComponent<EditProfileProps, EditProfileState>{
    /**
     * State of the component
     */
    public state: EditProfileState = {
        userId: 0,
        firstName: "",
        lastName: "",
        street: "",
        streetNumber: "",
        zipcode: "",
        city: "",
        country: "",
        userType: "Producer",
        password: "",
        repeatedPassword: "",
        oldPassword: "",
        description: "",
        profilePicture: undefined,
        wallet: "",
        pairingLink: "",
    };

    /**
     * Insert user data into state as soon as the component mounts
     */
    public componentDidMount(): void {
        const { store } = this.props;

        if (store.user) {
            this.setState({
                userId: store.user.id,
                firstName: store.user.firstName,
                lastName: store.user.surName,
                street: isProducerUser(store.user) ? store.user.street : "",
                streetNumber: isProducerUser(store.user) ? store.user.streetNumber : "",
                zipcode: isProducerUser(store.user) && store.user.zipcode ? store.user.zipcode : "",
                city: isProducerUser(store.user) ? store.user.city : "",
                country: store.user.country,
                userType: isProducerUser(store.user) ? "Producer" : "Receiver",
                password: "",
                repeatedPassword: "",
                oldPassword: "",
                description: store.user.description,
                profilePicture: undefined,
                wallet: isProducerUser(store.user) ? store.user.wallet : "",
                pairingLink: isProducerUser(store.user) ? store.user.pairingLink : "",
            });
        }
    }

    /**
     * Main render method for the entire component
     */
    // tslint:disable-next-line max-func-body-length
    public render(): JSX.Element {
        if (!this.props.store.user) {
            return <h1>No user currently logged in!</h1>;
        }

        const picture = this.getProfilePictureURL();
        console.log(this.state.pairingLink)
        return (
            <div className="allSection">
                <h1>{editProfileJson.title}</h1>
                <form onSubmit={this.sendToBackEnd}>
                    <div className="inputPicDescSection">
                        <div className="inputFieldsSection">
                            <div className="required">
                                <input
                                className="input name first"
                                required
                                aria-required={true}
                                value={this.state.firstName}
                                placeholder={editProfileJson.firstName}
                                onChange={this.onFirstnameChanged}
                                />
                            </div>
                            <div className="required">
                                <input
                                    className="input name last"
                                    required
                                    aria-required={true}
                                    value={this.state.lastName}
                                    placeholder={editProfileJson.lastName}
                                    onChange={this.onLastnameChanged}
                                />
                            </div>
                            {isProducerUser(this.props.store.user) &&
                                <><div className="required">
                                    <input
                                        className="input street name"
                                        required
                                        aria-required={true}
                                        value={this.state.street}
                                        placeholder={editProfileJson.street}
                                        onChange={this.onStreetChanged}
                                    />
                                </div>
                                <div className="required">
                                    <input
                                        className="input street number"
                                        required
                                        aria-required={true}
                                        value={this.state.streetNumber}
                                        placeholder={editProfileJson.streetNumber}
                                        onChange={this.onStreetNumberChanged}
                                    />
                                </div>
                                <input
                                    className="input zipcode"
                                    value={this.state.zipcode}
                                    placeholder={editProfileJson.zipcode}
                                    onChange={this.onZipcodeChanged}
                                />
                                <div className="required">
                                    <input
                                        className="input city"
                                        required
                                        aria-required={true}
                                        value={this.state.city}
                                        placeholder={editProfileJson.city}
                                        onChange={this.onCityChanged}
                                    />
                                </div></>
                            }
                            <div className="SelectCountryDiv">
                                <span className="required-select">
                                    <SelectCountry onChange={this.newCountrySelected} currentCountry={this.state.country} />
                                </span>
                            </div>
                            <input
                                type="email"
                                className="input email"
                                required
                                value={this.props.store.user.email}
                                readOnly
                                aria-required={true}
                                placeholder={editProfileJson.email}
                            />
                            {this.state.userType === UserTypes.PRODUCER && <div className="wallet-wrapper">
                                <input
                                    className="input wallet"
                                    value={this.state.wallet || ""}
                                    readOnly
                                    aria-required={true}
                                    placeholder={editProfileJson.wallet}
                                    onChange={this.onWalletChanged} />
                                    {
                                        !this.state.wallet &&
                                        <a href={this.state.pairingLink} ><i className="plus-icon">{getSVG("plus-square")}</i></a>
                                    }
                                    {
                                        this.state.wallet &&
                                        <a href={this.state.pairingLink} ><i className="edit-icon">{getSVG("edit")}</i></a>
                                    }
                            </div>}
                            <input
                                type="password"
                                className="input password first"
                                value={this.state.password}
                                placeholder={editProfileJson.password}
                                onChange={this.onPasswordChanged} />
                            <input
                                type="password"
                                className="input password second"
                                value={this.state.repeatedPassword}
                                placeholder={editProfileJson.confirmPassword}
                                onChange={this.onValidationPasswordChanged} />
                        </div>
                        <div className="pictureDescSection">
                            <div className="currentPictureDiv">
                                {(
                                    isNullOrUndefined(picture)
                                        ? <i className="user">{getSVG("user2", { strokeColor: colors.primary })}</i>
                                        : <img className="currentPicture" src={picture} alt="" role="presentation" />
                                )}
                            </div>
                            <input
                                type="file"
                                id="fileInput"
                                onChange={this.chooseImage}
                            />
                            <label htmlFor="fileInput">{editProfileJson.uploadPicture}</label>
                            <textarea
                                className="description"
                                value={this.state.description || ""}
                                placeholder={editProfileJson.decription}
                                onChange={this.onDescriptionChanged} />
                        </div>
                    </div>
                    <div className="borderLine" />
                    <div className="oldPassSubmitSection">
                        <div className="required">
                            <input
                                type="password"
                                className="input password old"
                                required
                                aria-required={true}
                                value={this.state.oldPassword}
                                placeholder={editProfileJson.oldPassword}
                                onChange={this.onOldPasswordChanged} />
                        </div>
                        <div className="submitDiv">
                            <div className="button">
                                <Button
                                    withThrobber={true}
                                    text={editProfileJson.saveButton}
                                    width={260}
                                    height={43}
                                    fontSize={16}
                                    type={"submit"}
                                    isPending={this.state.isPending}
                                    throbberSize={30} />
                            </div>
                        </div>
                    </div>
                </form>

                <style jsx>{`
                h1 {
                    margin: 0 0 8px;
                    line-height: 30px;
                    text-align: center;
                }

                input {
                    box-shadow: none;
                    height: 39px;
                    width: 252px;
                    text-indent: 9px;
                    border: 1px solid ${ colors.pale};
                    color: ${ colors.black};
                    border-radius: 3px;
                    font-family: ${ fonts.text};
                    font-size: 16px;
                    font-weight: 300;

                    /**Note that this is overwritten later for wallet and email */
                    margin: 14px auto;

                    /** Remove box-shadow on iOS */
                    background-clip: padding-box;

                    &::placeholder {
                        color: ${ colors.gray};
                        opacity: 1;
                    }

                    /**
                     * Make the placeholder text more readable on wallet,
                     * because the wallet input field is always read-only
                     */
                    &.wallet {
                        &::placeholder {
                            color: ${colors.black};
                        }
                    }

                    &:read-only {
                        opacity: 0.4;
                        cursor: not-allowed;
                    }
                }

                /* Set border styling when clicked on */
                input:not(:read-only):focus {
                    border: 1px solid ${ colors.secondary};
                }

                img {
                    height: 258px;
                    width: 258px;
                    object-fit: cover;
                    border-radius: 50%;
                }

                .button {
                    float: center;
                    margin: 10px 0;
                    position: relative;
                }

                .plus-icon, .edit-icon {
                    width: 24px;
                    height:24px;
                    position: absolute;
                    display: block;
                    background-color: white;
                    top: 24px;
                    right: 10px;
                    padding: 0;
                    color: ${colors.gray};
                    cursor: pointer;
                    &:hover {
                        color: ${colors.secondary};
                    }
                }

                .wallet:hover + a .edit-icon {
                    display: block;
                }

                a .edit-icon {
                    display: none;

                    &:hover {
                        display: block;
                    }
                }

                .wallet-wrapper {
                    position: relative;
                }

                .allSection{
                    width: 545px;
                    height: calc(100% - 60px);

                    margin: 30px auto;
                    justify-content: center;
                }

                .inputPicDescSection{
                    display: flex;
                    height: calc(100% - 115px);
                }

                .inputFieldsSection{
                    max-width: 255px;
                    height: calc(100% - 115px);
                    float: left;
                }

                .pictureDescSection{
                    max-width: 255px;
                    height: calc(100% - 115px);
                    float: left;
                    margin-left: 30px;
                }

                .SelectCountryDiv{
                    max-width: 255px;
                    margin: 0;
                }

                .currentPictureDiv{
                    height: 258px;
                    width: 258px;
                    border-radius: 50%;
                    margin: 10px 0;
                    background-color: ${colors.pale};
                    border: 2px solid ${colors.pale};
                }

                i {
                    margin: auto;
                    display: block;
                    height: 100px;
                    width: 100px;
                    padding-top: 79px;
                }

                [type="file"] {
                    height: 0;
                    overflow: hidden;
                    width: 0;
                    border: none;
                    display: none;
                }

                [type="file"] + label {
                    background: ${colors.secondary};
                    border: none;
                    border-radius: 2px;
                    color: ${colors.white};
                    cursor: pointer;
                    transition: background-color 0.1s linear;
                    font-size: 16px;
                    font-family: ${ fonts.text};
                    font-weight: 300;
                    padding: 0.5rem 20px;
                    width: 105px;
                    display: block;
                    margin: 10px auto 20px auto;
                    text-align: center;
                }

                [type="file"] + label:hover {
                    background: ${colors.primary};
                }

                .description{
                    box-shadow: none;
                    width: 240px;
                    height: 121px;
                    padding: 10px 9px;
                    border: 1px solid ${ colors.pale};
                    color: ${ colors.black};
                    border-radius: 3px;
                    font-family: ${ fonts.text};
                    font-size: 16px;
                    font-weight: 300;
                    margin: 10px 0px;

                    resize: none;

                    /** Remove box-shadow on iOS */
                    background-clip: padding-box;

                    &::placeholder {
                        color: ${ colors.gray};
                        opacity: 1;
                    }
                }

                /* Set border styling when clicked on */
                .description:focus {
                    border: 1px solid ${ colors.secondary};
                }

                .borderLine{
                    height: 2px;
                    width: 545px;
                    background-color: ${colors.primary};
                    margin-top: 10px;
                    margin-bottom: 10px;
                }

                .oldPassSubmitSection {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
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
                    top: 31px; /*center*/
                    color: red;
                    z-index: 5;
                    font-size: 1em;
                    font-family: 'Cabin', helvetica, arial, sans-serif;
                }

                .required-select:after {
                    top: 28px;
                }

                @media only screen and (min-width: 50%) {
                    .SelectCountryDiv{
                        margin: 30px 0;
                    }

                    .description{
                        height: 141px;
                    }
                }

                /* For mobile phones */
                @media (max-width: 666px) {

                    .allSection {
                        text-align: center;
                        width: 100%;
                    }

                    h1 {
                        margin-bottom: 15px;
                    }

                    form {
                        max-width: 400px;
                        margin: 0 auto;
                        padding: 0 15px;
                    }

                    /* Make columns appear beneath eachother */
                        .inputPicDescSection {
                            flex-direction: column;
                        }

                    /* Set all content to centered with a width of 100% */

                        .inputPicDescSection,
                        .currentPictureDiv,
                        .pictureDescSection {
                            margin: 0 auto;
                            max-width: 100%;
                        }

                        .inputPicDescSection,
                        .pictureDescSection {
                            width: 100%;
                        }

                        .inputFieldsSection,
                        .oldPassSubmitSection,
                        .SelectCountryDiv,
                        .borderLine  {
                            
                            max-width: 100%;
                        }

                        
                        .input {
                            width: calc(100% - 4px)
                        }

                    /* Change order of columns */
                        .pictureDescSection {
                            order: 1;
                        }

                        .inputFieldsSection {
                            order: 2;
                        }

                    .description {
                        width: calc(100% - 20px);
                    }

                    .borderLine {
                        margin: 10px 0;
                    }

                    .oldPassSubmitSection {
                        display: block;
                    }

                    .button :global(button) {
                        width: 100%;
                    }

                    .required, .required-select {
                        display: initial;
                        margin: auto;
                        width: calc(100% - 4px);
                    }

                    .required:after, .required-select:after {
                        top: 5px;
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
    private onStreetChanged = (evt: React.FormEvent<HTMLInputElement>) => {
        this.setState({ street: evt.currentTarget.value });
    }

    /**
     * Method that'll get triggered each time the input is changed, in order to
     * properly update state
     */
    private onStreetNumberChanged = (evt: React.FormEvent<HTMLInputElement>) => {
        this.setState({ streetNumber: evt.currentTarget.value });
    }

    /**
     * Method that'll get triggered each time the input is changed, in order to
     * properly update state
     */
    private onZipcodeChanged = (evt: React.FormEvent<HTMLInputElement>) => {
        this.setState({ zipcode: evt.currentTarget.value });
    }

    /**
     * Method that'll get triggered each time the input is changed, in order to
     * properly update state
     */
    private onCityChanged = (evt: React.FormEvent<HTMLInputElement>) => {
        this.setState({ city: evt.currentTarget.value });
    }

    /**
     * Method that'll get triggered each time the input is changed, in order to
     * properly update state
     */
    private onWalletChanged = (evt: React.FormEvent<HTMLInputElement>) => {
        this.setState({ wallet: evt.currentTarget.value });
    }

    /**
     * Method that'll get triggered each time the input is changed, in order to
     * properly update state
     */
    private onPasswordChanged = (evt: React.FormEvent<HTMLInputElement>) => {
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
     * Method that'll get triggered each time the input is changed, in order to
     * properly update state
     */
    private onDescriptionChanged = (evt: React.FormEvent<HTMLTextAreaElement>) => {
        this.setState({ description: evt.currentTarget.value });
    }

    /**
     * Method that'll get triggered each time the input is changed, in order to
     * properly update state
     */
    private onOldPasswordChanged = (evt: React.FormEvent<HTMLInputElement>) => {
        this.setState({ oldPassword: evt.currentTarget.value });
    }

    /**
     * Is passed down to SelectCountry and allows us to extract its value
     */
    private newCountrySelected = (newCountry: string) => {
        this.setState({ country: newCountry, });
    }

    /**
     * Checks if the value is null and then if it is a picture,
     * and updates the state accordingly
     */
    private chooseImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files !== null) {
            if (
                !(e.target.value.toLowerCase().endsWith(".png")
                    || e.target.value.toLowerCase().endsWith(".jpeg")
                    || e.target.value.toLowerCase().endsWith(".jpg")
                )
            ) {
                this.props.store.currentErrorMessage = editProfileJson.imageTypeAlert;
                return;
            }

            if (this.validateImageSize(e.target.files[0])) {
                return;
            }

            this.setState({ profilePicture: e.target.files[0] });
        }
    }

    /**
     * Check if the image is too big
     * 16777216 is equal to 16 MB which is the limit
     */
    private validateImageSize = (image?: Blob) => {
        if (image != null && image.size > 16777216) {
            this.props.store.currentErrorMessage = "The size of the uploaded image is too big. It must be less than 16 MB.";
            return true;
        } else {
            return false;
        }
    }

    /**
     * Checks if a picture is currently selected, if yes it is shown
     * otherwise not
     */
    private getProfilePictureURL = () => {
        if (isNullOrUndefined(this.state.profilePicture)) {
            return this.props.store.user ? this.props.store.user.getThumbnail() : "";
        } else {
            return window.URL.createObjectURL(this.state.profilePicture);
        }
    }

    /**
     * Send the information to the backend
     */
    private sendToBackEnd = async (evt: React.FormEvent) => {
        evt.preventDefault();

        if (this.state.isPending) {
            return;
        }

        if (this.state.password && this.state.password !== this.state.repeatedPassword) {
            this.props.store.currentErrorMessage = "Your passwords must match";
            return;
        }

        this.setState({ isPending: true });
        await editProfile(this.state, this.props.store, this.props.history);
        this.setState({ isPending: false });
    }
}

export const EditProfile = withRouter(injectStore((store) => ({ store }), UnwrappedEditProfile));
