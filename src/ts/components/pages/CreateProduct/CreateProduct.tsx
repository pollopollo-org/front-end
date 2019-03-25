import React from "react";
import createProductJson from "src/assets/data/createProduct.json";
import { colors, fonts } from "src/ts/config";
import { getSVG } from "src/assets/svg";
import { isNullOrUndefined } from "util";
import { Throbber } from "src/ts/components/utils";

/**
 * State of the component
 */
type CreateProductState = {
    /** 
     * A short title describing the product 
     */
    title?: string;
    
    /**
     * The price of the product
     */
    price?: number; 

    /** 
     * A description of the product 
     */
    description?: string;

    /**
     * Image of the product
     */
    productPicture?:Blob;
    /**
     * Specifies whether or not we're currently attempting to create a user
     */
    isPending?: boolean;
}

/**
 * A page where a producer can create a product
 */
export class CreateProduct extends React.PureComponent<CreateProductState> {
    /**
     * State of the create product form form, all fields initially set to null
     */
    public readonly state: CreateProductState = {};

    /**
     * Main render method for the entire component
     */
    public render(): JSX.Element{
        return (
            <div className="content">
                <h1>{createProductJson.title}</h1>
                <form>
                    <div className="formInput">
                        { this.renderLeftColumn() }
                        { this.renderRightColumn() }
                    </div>
                    { this.renderCreateButton() }
                </form>

                <style jsx>{`
                    .content {
                        display: flex;
                        flex-direction: column;
                        width: 540px;
                        margin: auto;
                        height: 100%;
                        justify-content: center;
                    }

                    h1 {
                        margin-top: 0;
                        text-align: center;
                    }

                    .formInput {
                        display: flex;
                    }
                    
                `}</style>
            </div>
        );
    }

    /**
     * Internal renderer that renders the left column containing
     * input fields for title, price and description
     */
    private renderLeftColumn = () => {
        return (
            <div className="leftColumn">
                <input
                    className="leftInput"
                    placeholder={createProductJson.productTitle}
                    required
                    aria-required={true}
                    onChange={this.onTitleChanged}
                />
                <input
                    className="leftInput"
                    placeholder={createProductJson.productPrice}
                    required
                    aria-required={true}
                    onChange={this.onPriceChanged}
                />
                <textarea
                    className="leftInput"
                    value={this.state.description || ""}
                    placeholder={ createProductJson.productDescription }
                    required
                    aria-required={true}
                    onChange={this.onDescriptionChanged}
                />
                <style jsx>{`
                    /**
                     * Set styling of input fields and textareas to match the
                     * one generally used in the project
                     */
                    input, textarea {
                        box-shadow: none;
                        
                        border: 1px solid ${ colors.pale };
                        color: ${ colors.black};
                        border-radius: 3px;

                        /* General font settings used on project */
                        font-family: ${ fonts.text};
                        font-size: 16px;
                        font-weight: 300;

                        margin: 15px 0;

                        /* Remove box-shadow on iOS */
                        background-clip: padding-box;

                        &::placeholder {
                            color: ${ colors.gray };
                            opacity: 1;
                        }
                    }

                    /* Set border styling when clicked on */
                    input:focus, textarea:focus {
                        border: 1px solid ${ colors.secondary };
                    }

                    /**
                     * Individual styling for input fields
                     */
                    input {
                        height: 39px;
                        width: 250px;
                        text-indent: 9px;
                        border-transition: border-color 0.15s linear;
                    }

                    /**
                     * Individual styling for textareas
                     */
                    textarea {
                        width: 234px;
                        height: 139px;
                        padding: 10px 9px;
                        resize: none;
                    }
                `}</style>
            </div>
        );
    }

    /**
     * Internal renderer that renders the right column containing image upload
     */
    private renderRightColumn = () => {
        return (
            <div className="rightColumn">
                <div className="currentPictureDiv">
                    {(
                        isNullOrUndefined(this.state.productPicture) 
                            ? <i className="user">{getSVG("user2", { strokeColor: colors.primary }) }</i>
                            : <img className="currentPicture" src={ this.getProductPictureURL() } alt="" role="presentation"/>  
                    )}
                </div>
                <input
                    type="file"
                    id="fileInput"
                    onChange={this.chooseImage}
                />
                <label htmlFor="fileInput"> {createProductJson.uploadPicture}</label>

                <style jsx>{`
                    .currentPictureDiv{
                        height: 258px;
                        width: 258px;
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
                        margin: 18px auto 0 auto;
                    }

                    [type="file"] + label:hover {
                        background: ${colors.primary};
                    }
                `}</style>
            </div>
        );
    }

    /**
     * Internal renderer that renders the create button
     */
    private renderCreateButton = () => {
        return (
            <button type="submit" className={this.state.isPending ? "isPending" : ""}>
                <span className="text">{createProductJson.buttonText}</span>
                <span className="throbber">
                    <Throbber size={30} relative={true} inverted={true} />
                </span>

                <style jsx>{`
                    /** Style button to match the rest of the project */
                    button {
                        margin: 10px 0;
                        background-color: ${ colors.secondary };
                        color: ${colors.white};
                        border: none;
                        border-radius: 2px;
                        transition: background-color 0.1s linear;
                        font-size: 16px;
                        font-family: ${ fonts.heading };
                        font-weight: 300;
                        width: 254px;
                        cursor: pointer;
                        height: 43px;
                        position: relative;
                        display: block;

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
                `}</style>
            </button>
        );
    }

    /**
     * Method that'll get triggered each time the input is changed, in order to
     * properly update state
     */
    private onTitleChanged = (evt: React.FormEvent<HTMLInputElement>) => {
        this.setState({ title: evt.currentTarget.value });
    }

    /**
     * Method that'll get triggered each time the input is changed, in order to
     * properly update state
     */
    private onPriceChanged = (evt: React.FormEvent<HTMLInputElement>) => {
        this.setState({ price: evt.currentTarget.value });
    }

    /**
     * Method that'll get triggered each time the input is changed, in order to
     * properly update state
     */
    private onDescriptionChanged = (evt: React.FormEvent<HTMLTextAreaElement>) => {
        this.setState({ description: evt.currentTarget.value });
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
                    alert(createProductJson.imageTypeAlert);
                    return;
                }

            this.setState({ productPicture: e.target.files[0]});
        }
    }

    /**
     * Checks if a picture is currently selected, if yes it is shown
     * otherwise not
     */
    private getProductPictureURL = () => {
        if(isNullOrUndefined(this.state.productPicture)){
            return "";
        } else{
            return window.URL.createObjectURL(this.state.productPicture);
        }
    }
}