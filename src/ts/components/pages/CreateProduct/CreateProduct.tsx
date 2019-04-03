import React from "react";
import createProductJson from "src/assets/data/createProduct.json";
import { colors, fonts, routes } from "src/ts/config";
import { getSVG } from "src/assets/svg";
import { isNullOrUndefined } from "util";
import { Throbber } from "src/ts/components/utils";
import { apis } from "src/ts/config/apis";
import { injectStore } from "src/ts/store/injectStore";
import { Store } from "src/ts/store/Store";
import { asyncTimeout } from "src/ts/utils";
import { withRouter, RouterProps } from "react-router";
import { alertApiError } from "src/ts/utils/alertApiError";
import { invalidateCacheKey } from "src/ts/utils/fetchProducts";

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
    productPicture?: File;
    /**
     * Specifies whether or not we're currently attempting to create a user
     */
    isPending?: boolean;
};

/**
 * A page where a producer can create a product
 */
class UnwrappedCreateProduct extends React.PureComponent<CreateProductProps, CreateProductState> {
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
                        isNullOrUndefined(this.state.productPicture) 
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
                        font-family: ${ fonts.heading };
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
                            width: 140px;
                            height: 40px;

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

                    /* For mobile phones */
                    @media (max-width: 666px) {
                        button {
                            margin: 15px auto;
                            margin-bottom: 35px;
                            max-width: 100%;
                        }
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
        this.setState({ price: Number(evt.currentTarget.value) });
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

    /**
     * Send the information to the backend
     */
    private sendToBackEnd = async (evt: React.FormEvent) => {
        evt.preventDefault();

        if (this.state.isPending || !this.props.store.user) {
            return;
        }
        
        try {
            this.setState({ isPending: true });
            const startedAt = performance.now();
            const token = localStorage.getItem("userJWT");

            const result = await fetch(apis.products.post.path, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    userId: this.props.store.user.id,
                    title: this.state.title,
                    price: this.state.price,
                    description: this.state.description,
                    country: this.props.store.user.country,
                }),
            });

            let imageResult: Response | undefined = undefined;

            if (this.state.productPicture) {
                imageResult = await fetch(apis.products.postImage.path, {
                    method: "PUT",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    },
                    body: this.imageToData((await result.json()).productId),
                })
            }

            await asyncTimeout(Math.max(0, 500 - (performance.now() - startedAt)));

            if (result.ok) {
                invalidateCacheKey(`producer-${this.props.store.user.id}`);
                this.props.history.push(routes.profile.path);
            } else {
                alertApiError(result.status, apis.products.post.errors, this.props.store);

                if (imageResult) {
                    alertApiError(imageResult.status, apis.products.postImage.errors, this.props.store);
                }

                this.setState({ isPending: false });
            }
        } catch (err) {
            this.setState({ isPending: false });
            this.props.store.currentErrorMessage = "Something went wrong while attempting to create your product, please try again later.";
        }
    }

    /**
     * Validates the image by checking for malformed/corrupted data
     */
    private imageToData = (productId: number): FormData => {
        const formData = new FormData();

        console.log(productId);
        if (this.state.productPicture) {
            formData.append("userId", String(this.props.store.user!.id));
            formData.append("productId", String(productId));
            formData.append("file", this.state.productPicture);
        }

        return formData;
    }
}

export const CreateProduct = withRouter(injectStore((store) => ({ store }), UnwrappedCreateProduct));
