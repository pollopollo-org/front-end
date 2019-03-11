import React from "react";
import { colors, fonts } from "src/ts/config";
import { SelectCountry } from "../../utils/SelectCountry";

type EditProducerProfileState = {
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
    description:string;
    /**
     * profile image
     */
    profilePicture:string;
}

/**
 *  Page where a logged in producer can edit their profile
 */
export class EditProducerProfile extends React.PureComponent<{},EditProducerProfileState>{
    constructor(props:any){
        super(props);
        this.state={ 
            // here we wanna get the actual user information tho
            firstName: "",
            lastName: "",
            email: "",
            country: "",
            userType: "producer",
            password: "",
            repeatedPassword: "",
            oldPassword: "",
            description: "",
            profilePicture: "",
        };
    }

    /**
     * Main render method for the entire component
     */
    public render(): JSX.Element{
        return(
            <div className="allSection">
            <h1>Edit profile</h1>
            <form>
                <div className="inputPicDescSection">
                    <div className="inputFieldsSection">
                        <input 
                            className="input name first" 
                            required 
                            placeholder="First name" 
                            onChange={event => this.setState({firstName: event.target.value })}/>
                        <input 
                            className="input name last" 
                            required 
                            placeholder="Surname" 
                            onChange={event => this.setState({lastName: event.target.value })}/>
                        <input 
                            type="email" 
                            className="input email" 
                            required 
                            placeholder="Email" 
                            onChange={event => this.setState({email: event.target.value })}/>
                        
                        <div className="SelectCountryDiv">
                            <SelectCountry onChange={this.newCountrySelected}/>
                        </div>

                        <input 
                            type="password" 
                            className="input password first" 
                            required 
                            placeholder="Password" 
                            onChange={event => this.setState({password: event.target.value })}/>
                        <input 
                            type="password" 
                            className="input password second" 
                            required 
                            placeholder="Confirm password" 
                            onChange={event => this.setState({repeatedPassword: event.target.value })}/>
                    </div>
                    <div className="pictureDescSection">
                        <input 
                            type="file"
                            className="upload"
                            placeholder="Upload a picture"
                            onChange={event => this.setState({profilePicture: event.target.value })}/>
                        <div className="currentPictureDiv">
                            {}
                        </div>
                        <textarea 
                            className="description" 
                            placeholder="Describe yourself" 
                            onChange={event => this.setState({description: event.target.value })}/>
                    </div>
                </div>
                <div className="oldPassSubmitSection">
                <div className="borderLine"/>

                    <div className="oldPasswordSection">
                        <input 
                            type="password" 
                            className="input password old" 
                            required 
                            placeholder="Enter your old password to proceed" 
                            onChange={event => this.setState({oldPassword: event.target.value })}/>
                    </div>
                    <div className="submitDiv">
                        <button type="submit">Save</button>
                    </div>
                </div>
            </form>
            
            <style jsx>{`
                h1{
                    margin: 0 0 8px;
                    line-height: 30px;
                    text-align: center;
                }

                h3{
                    
                }

                input{
                    box-shadow: none;
                    height: 39px;
                    width: 252px;
                    text-indent: 9px;
                    border: 1px solid ${ colors.gray };
                    color: ${ colors.black };
                    border-radius: 3px;
                    font-family: ${ fonts.text };
                    font-size: 16px;
                    font-weight: 300;
                    margin: 10px 0px;

                    /** Remove box-shadow on iOS */
                    background-clip: padding-box;

                    &::placeholder {
                        color: ${ colors.gray };
                        opacity: 1;
                    }
                }

                button {
                    float: center;
                    margin: 10px 0;
                    background-color: ${ colors.secondary };
                    color: white;
                    border: none;
                    border-radius: 2px;
                    transition: background-color 0.1s linear;
                    font-size: 16px;
                    font-family: ${ fonts.heading };
                    font-weight: 300;
                    width: 254px;
                    cursor: pointer;
                    height: 43px;
                }

                button:hover {
                    background-color: ${ colors.primary };
                }

                .allSection{
                    width: 545px;
                    height: calc(100% - 60px);
                    display: flex;
                    flex-direction: column;
                    margin: 30px auto;
                    justify-content: center;
                }

                .inputPicDescSection{
                    height: calc(100% - 115px);
                }

                .inputFieldsSection{
                    max-width: 255px;
                    float: left;
                }

                .pictureDescSection{
                    max-width: 255px;
                    float: left;
                    margin-left: 30px;
                }

                .oldPassSubmitSection{
                    /** Here for posterity*/
                }
                
                .SelectCountryDiv{
                    max-width: 255px;
                    margin: 10px 0;
                }

                .uploadButton{
                    width: 258px;
                }

                .currentPictureDiv{
                    height: 120px;
                    width: 258px;
                    background-color: ${colors.secondary};
                    border-radius: 3px; 
                    margin: 10px 0;
                }

                .description{
                    box-shadow: none;
                    width: 252px;
                    height: 150px;
                    text-indent: 9px;
                    border: 1px solid ${ colors.gray };
                    color: ${ colors.black };
                    border-radius: 3px;
                    font-family: ${ fonts.text };
                    font-size: 16px;
                    font-weight: 300;
                    margin: 10px 0px;

                    /** Remove box-shadow on iOS */
                    background-clip: padding-box;

                    &::placeholder {
                        color: ${ colors.gray };
                        opacity: 1;
                    }
                }

                .borderLine{
                    height: 2px;
                    width: 545px;
                    background-color: ${colors.primary};
                    margin-bottom: 10px;
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
}