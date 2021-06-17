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
import { postApplication } from "src/ts/models/ApplicationModel";


type CreateApplicationProps = {
    /**
     * Contains a reference to the root store
     */
    store: Store;
} & RouterProps;

export type CreateApplicationState = {

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
                        justify-content: center;
                        height: calc(100% - 40px);
                        margin: 20px auto;
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
                            margin-top: 10px;
                        }

                        .content {
                            text-align: center;
                            width: calc(100% - 20px);
                            magin: 10px;
                        }

                        .formInput {
                            margin: 0 auto;
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
                    userType={getUserType(undefined)}
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
                <div className="required">
                    <textarea
                        className="motivationTextArea"
                        placeholder={createApplicationJson.MotivationPlaceholder}
                        required
                        aria-required={true}
                        onChange={this.onMotivationChanged}
                    ></textarea>
                </div>
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

                    .required {
                        margin: auto;
                        position: relative;
                        z-index: 1;
                    }
                    .required:after {
                        content: "*";
                        position: absolute;
                        right: 7px;
                        top: 31px; /* Same placement as other asteriks' */
                        color: red;
                        z-index: 5;
                        font-size: 1em;
                        font-family: 'Cabin', helvetica, arial, sans-serif;
                    }

                    /* For mobile phones */
                    @media (max-width: 666px) {
                        input, textarea {
                            margin: 0 auto;
                            margin: 15px 0;
                        }

                        .motivation {
                            padding: 0px;
                        }
                        input {
                            width: 100%;
                        }

                        .required {
                            width: calc(100% - 36px);
                            
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

        // Notify state that we've begun updating our product
        this.setState({ isPending: true });

        await postApplication(this.state, this.props.store, this.props.history);
        this.setState({ isPending: false });
    }
}

export const CreateApplication = withRouter(injectStore((store) => ({ store }), UnwrappedCreateApplication));
