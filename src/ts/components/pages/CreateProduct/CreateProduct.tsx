import React from "react";
import createProduct from "src/assets/data/createProduct.json";
import { colors, fonts } from "src/ts/config";

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
            <div>
                <div className="content">
                    <h1>{createProduct.title}</h1>
                    <form>
                        <div className="formInput">
                            <div className="leftColumn">
                                <input
                                    className="leftInput"
                                    placeholder={createProduct.productTitle}
                                    required
                                    onChange={event => this.setState({ title: event.target.value, })}
                                />
                                <input
                                    className="leftInput"
                                    placeholder={createProduct.productPrice}
                                    required
                                    onChange={event => this.setState({ price: event.target.value, })}
                                />
                                <textarea
                                    className="leftInput"
                                    value={this.state.description || ""}
                                    placeholder={ createProduct.productDescription }
                                    required
                                    onChange={event => this.setState({description: event.target.value})}
                                />
                            </div>
                            <div className="rightColumn">
                                <p>Right</p>
                            </div>
                        </div>
                        <button>Create</button>
                    </form>
                </div>
                <style jsx>{`
                    .content {
                        width: 540px;
                        margin: 0 auto;
                    }

                    h1 {
                        text-align: center;
                    }

                    .formInput {
                        display: flex;
                    }

$                   /**
                     * Set styling of input fields and textareas to match the
                     * one generally used in the project
                     */
                    input, textarea {
                    }

                    /**
                     * 
                     */
                    input {
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
                        margin: 15px 0;

                        /* Remove box-shadow on iOS */
                        background-clip: padding-box;

                        &::placeholder {
                            color: ${ colors.gray };
                            opacity: 1;
                        }
                    }

                    /* Set border styling when clicked on */
                    input:focus {
                        border: 1px solid ${ colors.secondary };
                    }

                    /**
                     * 
                     */
                    textarea {
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
                        margin: 15px 0px;

                        resize: none;

                        /** Remove box-shadow on iOS */
                        background-clip: padding-box;

                        &::placeholder {
                            color: ${ colors.gray };
                            opacity: 1;
                        }
                    }

                    /* Set border styling when clicked on */
                    textarea:focus {
                        border: 1px solid ${ colors.secondary };
                    }
                    
                `}</style>
            </div>
        );
    }
}