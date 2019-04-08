import React from "react";
import createApplicationJson from "src/assets/data/createApplication.json";
import { Store } from "src/ts/store/Store";
import { Button } from "src/ts/components/utils";
import { withRouter, RouterProps } from "react-router";
import { injectStore } from "src/ts/store/injectStore";
import { ProductModel } from "src/ts/models/ProductModel";
import { Product } from "src/ts/components/elements/Product/Product";
import { getUserType } from "src/ts/utils/getUserType";
import { isNullOrUndefined } from "util";
import { routes, colors, fonts } from "src/ts/config";
import { apis } from "src/ts/config/apis";
import { asyncTimeout } from "src/ts/utils";
import { alertApiError } from "src/ts/utils/alertApiError";


type CreateApplicationProps = {
    /**
     * Contains a reference to the root store
     */
    store: Store;
} & RouterProps;

type CreateApplicationState = {

    /**
     * The product that is being applied for
     */
    product?: ProductModel;

    /**
     * The motivation of the application
     */
    motivation?: string;

    /**
     * Specifies whether or not we're currently attempting to create an application
     */
    isPending?: boolean;
};

/**
 * A page where a receiver can apply for a product
 */
class UnwrappedCreateApplication extends React.PureComponent<CreateApplicationProps, CreateApplicationState> {
    /**
     * State of the create product form form, all fields initially set to null
     */
    public readonly state: CreateApplicationState = {
        product: this.props.store.product
    };

    /**
     * Redirects if no product has been found
     */
    public componentDidMount(): void {
        if (isNullOrUndefined(this.props.store.product)) {
            this.props.history.push(routes.root.path);
        }
    }

    /**
     * Main render method for the entire component
     */
    public render(): JSX.Element {
        return (
            <div className="content" >
                <h1>{createApplicationJson.title}</h1>
                <h2>{createApplicationJson.ApplyForProduct}</h2>
                {this.renderProduct()}
                <form onSubmit={this.sendToBackEnd}>
                    <div className="formInput">
                        {this.renderMotivation()}
                    </div>
                    {this.renderCreateButton()}
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
                        margin-bottom: 10px;
                        text-align: center;
                    }

                    h2 {
                        margin-top: 10px;
                        margin-bottom: 5px;
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
    private renderProduct = () => {
        if (isNullOrUndefined(this.state.product)) {
            return;
        }
        return (
            <div>
                <Product
                    product={this.state.product}
                    userType={getUserType(undefined, undefined)}
                    isOnProducersPage={false}
                    isOwnProduct={false}
                />
            </div>

        );
    }

    /**
     * Internal renderer that renders the motivation part containing
     * input field for the motivation 
     */
    private renderMotivation = () => {
        return (
            <div className="motivation">
                <h2>{createApplicationJson.MotivationTitle}</h2>
                <textarea
                    className="motivationTextArea"
                    placeholder={createApplicationJson.MotivationPlaceholder}
                    onChange={this.onMotivationChanged}
                >
                </textarea>
                <style jsx> {`

                    .motivation {
                        padding: 10px;
                        width: 100%;
                    }
                
                    h2 {
                        margin-top: 10px;
                        margin-bottom: 5px;
                        text-align: center; 
                    }
                    /**
                     * Set styling of textarea to match the
                     * one generally used in the project
                     */
                    textarea {
                        padding: 10px 9px;
                        width: calc(100% - 20px);
                        height: 4em;
                        resize: none;

                        box-shadow: none;

                        border: 1px solid ${ colors.pale};
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
                            color: ${ colors.gray};
                            opacity: 1;
                        }

                        
                    }

                    /* Set border styling when clicked on */
                    textarea:focus {
                        border: 1px solid ${ colors.secondary};
                    }

                    /* For mobile phones */
                    @media (max-width: 666px) {
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
     * Internal renderer that renders the create button
     */
    private renderCreateButton = () => {
        return (
            <div className="button">
                <Button
                    withThrobber={true}
                    text={createApplicationJson.buttonText}
                    width={254}
                    height={43}
                    fontSize={16}
                    type={"submit"}
                    isPending={this.state.isPending}
                    throbberSize={30} />

                <style jsx>{`

                    .button {
                        margin: 10px 0;
                        position: relative;
                        display: block;
                        text-align: center;
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
    private onMotivationChanged = (evt: React.FormEvent<HTMLTextAreaElement>) => {
        this.setState({ motivation: evt.currentTarget.value });
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

            const result = await fetch(apis.application.post.path, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    userId: this.props.store.user.id,
                    productId: this.props.store.product.id,
                    motivation: this.state.motivation,
                }),
            });

            await asyncTimeout(Math.max(0, 500 - (performance.now() - startedAt)));

            if (result.ok) {
                this.props.history.push(routes.productsPage.path);
            } else {
                console.log(JSON.stringify({
                    userId: this.props.store.user.id,
                    productId: this.props.store.product.id,
                    motivation: this.state.motivation,
                }));
                alertApiError(result.status, apis.products.post.errors, this.props.store);

                this.setState({ isPending: false });
            }
        } catch (error) {
            this.setState({ isPending: false });
            this.props.store.currentErrorMessage = "Something went wrong while attempting to create your application, please try again later.";
        }
    }
}

export const CreateApplication = withRouter(injectStore((store) => ({ store }), UnwrappedCreateApplication));
