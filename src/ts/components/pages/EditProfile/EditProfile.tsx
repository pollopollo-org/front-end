import React from "react";
import { RouterProps, withRouter } from "react-router";
import EditProfileLabels from "src/assets/data/editProfile.json";
import { getSVG } from "src/assets/svg";
import { colors, fonts, routes } from "src/ts/config";
import { injectStore } from "src/ts/store/injectStore";
import { Store } from "src/ts/store/Store";
import { isProducerUser } from "src/ts/utils/verifyUserModel";
import { isNullOrUndefined } from "util";
import { Throbber } from "../../utils";
import { SelectCountry } from "../../utils/SelectCountry";

type EditProfileProps = {
    /**
     * Contains a reference to the root store
     */
    store: Store;
} & RouterProps;

type EditProfileState = {
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
    profilePicture?:File;
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
        firstName: "",
        lastName: "",
        email: "",
        country: "",
        userType: "producer",
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
                firstName: store.user.firstName,
                lastName: store.user.surName,
                email: store.user.email,
                country: store.user.country,
                userType: isProducerUser(store.user) ? "producer" : "receiver",
                password: "",
                repeatedPassword: "",
                oldPassword: "",
                description: store.user.description,
                profilePicture: undefined,
                wallet: isProducerUser(store.user) ? store.user.wallet : ""
            });
        }
    }

    /**
     * Main render method for the entire component
     */
    public render(): JSX.Element{
        if (!this.props.store.user) {
            return <h1>No user currently logged in!</h1>;
        }

        return(
            <div className="allSection">
            <h1>{ EditProfileLabels.title }</h1>
            <form onSubmit={this.sendToBackEnd}>
                <div className="inputPicDescSection">
                    <div className="inputFieldsSection">
                        <input
                            className="input name first"
                            required
                            value={this.state.firstName}
                            placeholder={ false || EditProfileLabels.firstName }
                            onChange={event => this.setState({firstName: event.target.value })}
                        />
                        <input
                            className="input name last"
                            required
                            value={this.state.lastName}
                            placeholder={false || EditProfileLabels.lastName }
                            onChange={event => this.setState({lastName: event.target.value })}
                        />
                        <div className="SelectCountryDiv">
                            <SelectCountry onChange={this.newCountrySelected} currentCountry={this.state.country} />
                        </div>
                        <input
                            type="email"
                            className="input email"
                            required
                            value={this.state.email}
                            placeholder={ false || EditProfileLabels.email }
                            onChange={event => this.setState({email: event.target.value })}
                        />
                        {this.state.userType === "producer" &&
                            <input
                            className="input wallet"
                            value={this.state.wallet}
                            placeholder={false || EditProfileLabels.wallet}
                            onChange={event => this.setState({wallet: event.target.value})}
                            />
                        }
                        <input
                            type="password"
                            className="input password first"
                            value={this.state.password}
                            placeholder={ false || EditProfileLabels.password }
                            onChange={event => this.setState({password: event.target.value })}/>
                        <input
                            type="password"
                            className="input password second"
                            value={this.state.repeatedPassword}
                            placeholder={ false || EditProfileLabels.confirmPassword }
                            onChange={event => this.setState({repeatedPassword: event.target.value })}/>
                    </div>
                    <div className="pictureDescSection">
                        <div className="currentPictureDiv">
                            { (isNullOrUndefined(this.state.profilePicture) && <i className="user">{ getSVG("user2", {strokeColor: colors.primary}) }</i>)|| <img className="currentPicture" src={ this.getProfilePictureURL() }/>}
                        </div>
                        <input
                            type="file"
                            id="fileInput"
                            onChange={event => this.chooseImage(event)}/>
                        <label htmlFor="fileInput">Choose a file</label>
                        <textarea
                            className="description"
                            value={this.state.description}
                            placeholder={ false || EditProfileLabels.decription }
                            onChange={event => this.setState({description: event.target.value })}/>
                    </div>
                </div>
                <div className="borderLine"/>
                <div className="oldPassSubmitSection">
                    <div className="oldPasswordSection">
                        <input
                            type="password"
                            className="input password old"
                            required
                            value={this.state.oldPassword}
                            placeholder={ false || EditProfileLabels.oldPassword }
                            onChange={event => this.setState({oldPassword: event.target.value })}/>
                    </div>
                    <div className="submitDiv">
                        <button type="submit" className={this.state.isPending ? "isPending" : ""}>
                            <span className="text">{EditProfileLabels.saveButton}</span>
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
                    width: 90px;
                    display: block;
                    margin: 10px auto 20px auto;

                }

                [type="file"] + label:hover {
                    background: ${colors.primary};
                }

                .description{
                    box-shadow: none;
                    width: 252px;
                    height: 139px;
                    text-indent: 9px;
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
                    alert(EditProfileLabels.imageTypeAlert);
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
            return "";
        } else{
            return window.URL.createObjectURL(this.state.profilePicture);
        }
    }

    /**
     * Send the information to the backend
     */
    private sendToBackEnd = (evt: React.FormEvent) => {
        evt.preventDefault();

        if (this.state.isPending) {
            return;
        }

        if(this.state.password && this.state.password !== this.state.repeatedPassword){
            alert(EditProfileLabels.passwordAlert);
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

                this.props.history.push(routes.profile.path);
            },
            2000,
        );

        /** TODO Send data to backend */
    }
}

export const EditProfile = withRouter(injectStore((store) => ({ store }), UnwrappedEditProfile));
