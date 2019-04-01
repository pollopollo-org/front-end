import React from "react";
import { RouterProps, withRouter } from "react-router";
import editProfileJson from "src/assets/data/editProfile.json";
import { getSVG } from "src/assets/svg";
import { colors, fonts, routes } from "src/ts/config";
import { apis } from "src/ts/config/apis";
import { injectStore } from "src/ts/store/injectStore";
import { Store } from "src/ts/store/Store";
import { asyncTimeout } from "src/ts/utils";
import { isProducerUser } from "src/ts/utils/verifyUserModel";
import { isNullOrUndefined } from "util";
import { Throbber } from "src/ts/components/utils";
import { SelectCountry } from "src/ts/components/utils/SelectCountry";
import { alertApiError } from "src/ts/utils/alertApiError";
import { fetchSelf } from "src/ts/utils/fetchUser";

type EditProfileProps = {
    /**
     * Contains a reference to the root store
     */
    store: Store;
} & RouterProps;

type EditProfileState = {
    /**
     * user ID
     */
    userId: number;

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
    /**
     * old password to make sure it is the actual user who is changing the information
     */
    oldPassword:string;
    /**
     * a brief description of the user
     */
    description?:string;
    /**
     * profile image
     */
    profilePicture?: File;
    /**
     * wallet address
     */
    wallet?:string;

    /**
     * Specifies whether or not we're currently attempting to create a user
     */
    isPending?: boolean;
}

/**
 *  Page where a logged in producer can edit their profile
 */
class UnwrappedEditProfile extends React.PureComponent<EditProfileProps,EditProfileState>{
    /**
     * State of the component
     */
    public state: EditProfileState = {
        userId: 0,
        firstName: "",
        lastName: "",
        email: "",
        country: "",
        userType: "Producer",
        password: "",
        repeatedPassword: "",
        oldPassword: "",
        description: "",
        profilePicture: undefined,
        wallet: "",
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
                email: store.user.email,
                country: store.user.country,
                userType: isProducerUser(store.user) ? "Producer" : "Receiver",
                password: "",
                repeatedPassword: "",
                oldPassword: "",
                description: store.user.description,
                profilePicture: undefined,
                wallet: isProducerUser(store.user) ? store.user.wallet : "",
            });
        }
    }

    /**
     * Main render method for the entire component
     */
    // tslint:disable-next-line max-func-body-length
    public render(): JSX.Element{
        if (!this.props.store.user) {
            return <h1>No user currently logged in!</h1>;
        }

        const picture = this.getProfilePictureURL();

        return(
            <div className="allSection">
            <h1>{ editProfileJson.title }</h1>
            <form onSubmit={this.sendToBackEnd}>
                <div className="inputPicDescSection">
                    <div className="inputFieldsSection">
                        <input
                            className="input name first"
                            required
                            aria-required={true}
                            value={this.state.firstName}
                            placeholder={ editProfileJson.firstName }
                            onChange={this.onFirstnameChanged}
                        />
                        <input
                            className="input name last"
                            required
                            aria-required={true}
                            value={this.state.lastName}
                            placeholder={ editProfileJson.lastName }
                            onChange={this.onLastnameChanged}
                        />
                        <div className="SelectCountryDiv">
                            <SelectCountry onChange={this.newCountrySelected} currentCountry={this.state.country} />
                        </div>
                        <input
                            type="email"
                            className="input email"
                            required
                            value={this.state.email}
                            aria-required={true}
                            placeholder={ editProfileJson.email }
                            onChange={this.onEmailChanged}
                        />
                        {this.state.userType === "Producer" &&
                            <input
                            className="input wallet"
                            value={this.state.wallet || ""}
                            aria-required={true}
                            placeholder={ editProfileJson.wallet}
                            onChange={this.onWalletChanged}
                            />
                        }
                        <input
                            type="password"
                            className="input password first"
                            value={this.state.password}
                            placeholder={ editProfileJson.password }
                            onChange={this.onPasswordChanged}/>
                        <input
                            type="password"
                            className="input password second"
                            value={this.state.repeatedPassword}
                            placeholder={ editProfileJson.confirmPassword }
                            onChange={this.onValidationPasswordChanged}/>
                    </div>
                    <div className="pictureDescSection">
                        <div className="currentPictureDiv">
                                {(
                                    isNullOrUndefined(picture) 
                                        ? <i className="user">{getSVG("user2", { strokeColor: colors.primary }) }</i>
                                        : <img className="currentPicture" src={ picture } alt="" role="presentation"/>  
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
                            placeholder={ editProfileJson.decription }
                            onChange={this.onDescriptionChanged}/>
                    </div>
                </div>
                <div className="borderLine"/>
                <div className="oldPassSubmitSection">
                    <div className="oldPasswordSection">
                        <input
                            type="password"
                            className="input password old"
                            required
                            aria-required={true}
                            value={this.state.oldPassword}
                            placeholder={ editProfileJson.oldPassword }
                            onChange={this.onOldPasswordChanged}/>
                    </div>
                    <div className="submitDiv">
                        <button type="submit" className={this.state.isPending ? "isPending" : ""}>
                            <span className="text">{editProfileJson.saveButton}</span>
                            <span className="throbber">
                                <Throbber size={30} relative={true} inverted={true} />
                            </span>
                        </button>
                    </div>
                </div>
            </form>

            <style jsx>{`
                h1{
                    margin: 0 0 8px;
                    line-height: 30px;
                    text-align: center;
                }

                input{
                    box-shadow: none;
                    height: 39px;
                    width: 252px;
                    text-indent: 9px;
                    border: 1px solid ${ colors.pale };
                    color: ${ colors.black };
                    border-radius: 3px;
                    font-family: ${ fonts.text };
                    font-size: 16px;
                    font-weight: 300;

                    /**Note that this is overwritten later for wallet and email */
                    margin: 14px auto;

                    /** Remove box-shadow on iOS */
                    background-clip: padding-box;

                    &::placeholder {
                        color: ${ colors.gray };
                        opacity: 1;
                    }
                }

                /* Set border styling when clicked on */
                input:focus {
                    border: 1px solid ${ colors.secondary};
                }

                img {
                    height: 258px;
                    width: 258px;
                    object-fit: cover;
                    border-radius: 50%;
                }

                button {
                    float: center;
                    margin: 10px 0;
                    background-color: ${ colors.secondary };
                    color: ${colors.white};
                    border: none;
                    border-radius: 2px;
                    transition: background-color 0.1s linear;
                    font-size: 16px;
                    font-family: ${ fonts.heading };
                    font-weight: 300;
                    width: 260px;
                    cursor: pointer;
                    height: 43px;
                    position: relative;

                    & .throbber {
                        /**
                            * Position a throbber in the middle to be displayed
                            * while requests are ongoing
                            */
                        position: absolute;
                        left: calc(50% - 15px);
                        top: calc(50% - 15px);
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
                    background-color: ${ colors.primary };
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
                    font-family: ${ fonts.heading };
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
                    height: 139px;
                    padding: 10px 9px;
                    border: 1px solid ${ colors.pale };
                    color: ${ colors.black };
                    border-radius: 3px;
                    font-family: ${ fonts.text };
                    font-size: 16px;
                    font-weight: 300;
                    margin: 10px 0px;

                    resize: none;

                    /** Remove box-shadow on iOS */
                    background-clip: padding-box;

                    &::placeholder {
                        color: ${ colors.gray };
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
                        .inputFieldsSection,
                        .pictureDescSection,
                        .oldPassSubmitSection,
                        .SelectCountryDiv,
                        .currentPictureDiv,
                        .borderLine  {
                            margin: 0 auto;
                            max-width: 100%;
                        }

                        .inputPicDescSection,
                        .pictureDescSection,
                        .description,
                        .input {
                            width: 100%;
                        }

                    /* Change order of columns */
                        .pictureDescSection {
                            order: 1;
                        }

                        .inputFieldsSection {
                            order: 2;
                        }

                    .description {
                        padding: 0;

                    }

                    .borderLine {
                        margin: 10px 0;
                    }

                    .oldPassSubmitSection {
                        display: block;
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
    private onEmailChanged = (evt: React.FormEvent<HTMLInputElement>) => {
        this.setState({ email: evt.currentTarget.value });
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
    private newCountrySelected = (newCountry:string) => {
        this.setState({country: newCountry,});
    }

    /**
     * Checks if the value is null and then if it is a picture,
     * and updates the state accordingly
     */
    private chooseImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files !== null){
            if(
                !( e.target.value.toLowerCase().endsWith(".png")
                || e.target.value.toLowerCase().endsWith(".jpeg")
                || e.target.value.toLowerCase().endsWith(".jpg")
                )
                )
                {
                    alert(editProfileJson.imageTypeAlert);
                    return;
                }

            this.setState({ profilePicture: e.target.files[0]});
        }
    }

    /**
     * Checks if a picture is currently selected, if yes it is shown
     * otherwise not
     */
    private getProfilePictureURL = () => {
        if(isNullOrUndefined(this.state.profilePicture)){
            return this.props.store.user ? this.props.store.user.getThumbnail() : "";
        } else{
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

        if(this.state.password && this.state.password !== this.state.repeatedPassword){
            alert("Your passwords must match");
            return;
        }

        const endPoint = apis.user.put.path;

        try {
            this.setState({ isPending: true });
            const startedAt = performance.now();
            const token = localStorage.getItem("userJWT");

            const result = await fetch(endPoint, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    userId: this.state.userId,
                    firstName: this.state.firstName,
                    surName: this.state.lastName,
                    email: this.state.email,
                    country: this.state.country,
                    userRole: this.state.userType,
                    newPassword: this.state.repeatedPassword,
                    password: this.state.oldPassword,
                    wallet: this.state.wallet,
                    description: this.state.description,
                })
            });

            let imageResult: Response | undefined = undefined;

            if (this.state.profilePicture) {
                imageResult = await fetch(apis.user.image.path, {
                    method: "PUT",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    },
                    body: this.imageToData(),
                })
            }

            this.props.store.user = await fetchSelf();

            await asyncTimeout(Math.max(0, 500 - (performance.now() - startedAt)));

            if (result.ok && (!imageResult || imageResult.ok)) {
                this.props.history.push(routes.profile.path);
            } else {
                alertApiError(result.status, apis.user.put.errors);

                if (imageResult) {
                    alertApiError(imageResult.status, apis.user.image.errors);
                }

                this.setState({ isPending: false });
            }
        } catch (err) {
            this.setState({ isPending: false });
            alert("Something went wrong while attempting to update your profile, please try again later.");
        }
    }

    /**
     * Validates the image by checking for malformed/corrupted data
     */
    private imageToData = (): FormData => {
        const formData = new FormData();

        if (this.state.profilePicture) {
            formData.append("userId", String(this.state.userId));
            formData.append("file", this.state.profilePicture);
        }

        return formData;
    }

}

export const EditProfile = withRouter(injectStore((store) => ({ store }), UnwrappedEditProfile));
