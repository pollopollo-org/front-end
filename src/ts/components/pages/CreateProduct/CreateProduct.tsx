import React from "react";
import createProductJson from "src/assets/data/createProduct.json";
import { colors, fonts } from "src/ts/config";
import { getSVG } from "src/assets/svg";
import { isNullOrUndefined } from "util";
import { Button } from "src/ts/components/utils";
import { injectStore } from "src/ts/store/injectStore";
import { Store } from "src/ts/store/Store";
import { withRouter, RouterProps } from "react-router";
import { postProduct } from "src/ts/models/ProductModel";

type CreateProductProps = {
    /**
     * Contains a reference to the root store
     */
    store: Store;
} & RouterProps;

/**
 * State of the component
 */
type CreateProductState = {
    /** 
     * A short title describing the product 
     */
    title: string;
    
    /**
     * The price of the product
     */
    price: number; 

    /** 
     * A description of the product 
     */
    description: string;

    /**
     * Image of the product
     */
    image?: Blob;

    /**
     * Specifies whether or not we're currently attempting to create a user
     */
    isPending?: boolean;

    /**
     * The rank of the product, default is 0, which is placed below all other ranks
     */
    rank?: number;
};

/**
 * A page where a producer can create a product
 */
class UnwrappedCreateProduct extends React.PureComponent<CreateProductProps, CreateProductState> {
    /**
     * State of the create product form form, all fields initially set to null
     */
    public readonly state: CreateProductState = {
        title: "",
        price: 1,
        description: "",
    };

    /**
     * Main render method for the entire component
     */
    public render(): JSX.Element{
        return (
            <div className="content">
                <h1>{createProductJson.title}</h1>
                <form onSubmit={this.sendToBackEnd}>
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
                        margin: 30px auto;
                        justify-content: center;
                    }

                    h1 {
                        margin-top: 0;
                        text-align: center;
                    }

                    .formInput {
                        display: flex;
                    }

                    /* For mobile phones */
                    @media (max-width: 666px) {
                        h1 {
                            margin-top: 30px;
                        }

                        .content {
                            text-align: center;
                            width: 100%;
                        }

                        .formInput {
                            max-width: 400px;
                            margin: 0 auto;
                            padding: 0 15px;
                            flex-direction: column;
                        }
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
                    maxLength={255}
                    required
                    aria-required={true}
                    onChange={this.onTitleChanged}
                />
                <input
                    type="number"
                    className="leftInput"
                    placeholder={createProductJson.productPrice}
                    min={1}
                    max={1000000}
                    maxLength={255}
                    required
                    aria-required={true}
                    aria-valuemin={1}
                    aria-valuemax={1000000}
                    aria-valuenow={this.state.price}
                    onChange={this.onPriceChanged}
                />
                <input
                    type="number"
                    className="leftInput"
                    placeholder={createProductJson.productRank}
                    min={0}
                    max={1000000}
                    aria-valuemin={0}
                    aria-valuemax={1000000}
                    aria-valuenow={this.state.rank}
                    onChange={this.onRankChanged}
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

                    /* For mobile phones */
                    @media (max-width: 666px) {
                        .leftColumn {
                            order: 2;
                        }

                        input, textarea {
                            margin: 0 auto;
                            margin: 15px 0;
                        }

                        input {
                            width: 100%;
                        }

                        textarea {
                            width: calc(100% - 16px);
                            
                        }
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
                        isNullOrUndefined(this.state.image) 
                            ? <i className="user">{getSVG("image", { strokeColor: colors.primary }) }</i>
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
                    .currentPictureDiv {
                        height: 258px;
                        width: 258px;
                        margin: 15px 0;
                        background-color: ${colors.pale};
                        border: 2px solid ${colors.pale};
                    }

                    img {
                        height: 258px;
                        width: 258px;
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
                        font-family: ${ fonts.text };
                        font-weight: 300;
                        padding: 0.5rem 20px;
                        width: 105px;
                        display: block;
                        margin: -2px auto 0 auto;
                        text-align: center;
                    }

                    [type="file"] + label:hover {
                        background: ${colors.primary};
                    }

                    /* For mobile phones */
                    @media (max-width: 666px) {
                        .rightColumn {
                            order: 1;
                        }

                        .currentPictureDiv {
                            margin: 0 auto 15px auto;
                            max-width: 100%;
                        }

                        [type="file"] + label {
                            margin-bottom: 15px;
                        }
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
            <div className="button">
                <Button 
                    withThrobber={true} 
                    text={createProductJson.buttonText}
                    width={254}
                    height={43}
                    fontSize={16}
                    type={"submit"}
                    isPending={this.state.isPending}
                    throbberSize={30}/>

                <style jsx>{`

                    .button {
                        margin: 10px 0;
                        position: relative;
                        display: block;
                    }

                    /* For mobile phones */
                    @media (max-width: 666px) {
                        .button {
                            margin: 15px auto;
                            margin-bottom: 35px;
                            & :global(button) {
                                max-width: 100%;
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
    private onTitleChanged = (evt: React.FormEvent<HTMLInputElement>) => {
        this.setState({ title: evt.currentTarget.value });
    }

    /**
     * Method that'll get triggered each time the input is changed, in order to
     * properly update state
     */
    private onPriceChanged = (evt: React.FormEvent<HTMLInputElement>) => {
        this.setState({ price: Number(evt.currentTarget.value) });
    }

    /**
     * Method that'll get triggered each time the input is changed, in order to
     * properly update state
     */
    private onRankChanged = (evt: React.FormEvent<HTMLInputElement>) => {
        this.setState({rank: Number(evt.currentTarget.value)});
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
                    this.props.store.currentErrorMessage = createProductJson.imageTypeAlert;
                    return;
                }

            this.setState({ image: e.target.files[0]});
        }
    }

    /**
     * Checks if a picture is currently selected, if yes it is shown
     * otherwise not
     */
    private getProductPictureURL = () => {
        if(isNullOrUndefined(this.state.image)){
            return "";
        } else{
            return window.URL.createObjectURL(this.state.image);
        }
    }

    /**
     * Send the information to the backend
     */
    private sendToBackEnd = async (evt: React.FormEvent) => {
        evt.preventDefault();

        if (this.state.isPending || !this.props.store.user) {
            return;
        }

        this.setState({ isPending: true });
        await postProduct(this.state, this.props.store, this.props.history);
        this.setState({ isPending: false });
    }
}

export const CreateProduct = withRouter(injectStore((store) => ({ store }), UnwrappedCreateProduct));
