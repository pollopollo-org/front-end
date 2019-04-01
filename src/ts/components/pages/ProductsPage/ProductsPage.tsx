import React from "react";
import { Product } from "src/ts/components/elements/Product/Product";
import ProductsPageJson from "src/assets/data/productsPage.json";
import { SelectCountry } from "src/ts/components/utils/SelectCountry";
import { colors, fonts } from "src/ts/config";
import { injectStore } from "src/ts/store/injectStore";
import { Store } from "src/ts/store/Store";
import { UserTypes } from "src/ts/models/UserModel";
import { Throbber } from "src/ts/components/utils";
import { ProductModel } from "src/ts/models/ProductModel";

export type ProductsPageProps = {
    /**
     * Contains a reference to the root sotre
     */
    store: Store;
}

type ProductsPageState = {
    /**
     * The country the user wants to see products from
     */
    filterCountry?: string;

    /**
     * The list of products to display
     */
    products?: ProductModel[];

    /**
     * The index of the first product to display in the current list
     */
    firstOfList: number;

    /**
     * The index of the last product to display in the current list
     */
    lastOfList: number;

    /**
     * Specifies whether or not we are currently attempting to access the backend
     */
    isPending?: boolean;
}

/**
 * A page where a user can see a list of all active products
 */
class UnwrappedProductsPage extends React.PureComponent<ProductsPageProps, ProductsPageState> {
    /**
     * State of the register form, all fields initially set to null
     
    public readonly state: ProductsPageState = {};
    */

    /**
     * Setup initial state
     */
    public state: ProductsPageState = {
        firstOfList: 0,
        lastOfList: 19,
    }

    /**
     * Main render method for the entire component
     */
    public render(): JSX.Element{
        return (
            <div className="page">
                <h1>{ProductsPageJson.title}</h1>
                <p>{ProductsPageJson.text}</p>
                <div>
                    <span><b>{ProductsPageJson.Filter}</b></span>
                    <span className="countryFilter"> 
                        <SelectCountry onChange={this.newCountrySelected} currentCountry={this.state.filterCountry}/>
                    </span>
                    {this.state.filterCountry !== undefined && <span className="removeFilter" role="button" aria-label="Remove filter" onClick={this.removeFilter}>{ProductsPageJson.RemoveFilter}</span>}
                </div>
                <div className="flex">
                    <div className="productsListLeft">
                        <div className="product"><Product product={this.props.store.products[1]} userType={ UserTypes.RECEIVER } isOwnProduct={ false } /></div>
                        <div className="product"><Product product={this.props.store.products[1]} userType={ UserTypes.RECEIVER } isOwnProduct={ false } /></div>
                        <div className="product"><Product product={this.props.store.products[1]} userType={ UserTypes.RECEIVER } isOwnProduct={ false } /></div>
                        <div className="product"><Product product={this.props.store.products[1]} userType={ UserTypes.RECEIVER } isOwnProduct={ false } /></div>
                    </div>
                    <div className="productsListRight">
                        <div className="product"><Product product={this.props.store.products[1]} userType={ UserTypes.RECEIVER } isOwnProduct={ false } /></div>
                        <div className="product"><Product product={this.props.store.products[1]} userType={ UserTypes.RECEIVER } isOwnProduct={ false } /></div>
                        <div className="product"><Product product={this.props.store.products[1]} userType={ UserTypes.RECEIVER } isOwnProduct={ false } /></div>
                        <div className="product"><Product product={this.props.store.products[1]} userType={ UserTypes.RECEIVER } isOwnProduct={ false } /></div>
                    </div>
                </div>
                
                <div className="pageNavigation">
                    {this.renderButton(ProductsPageJson.PreviousPage)}
                    <p>page 1 of 45</p>
                    {this.renderButton(ProductsPageJson.NextPage)}
                </div>
                
                <style jsx>{`
                    /** Filter function */
                        .countryFilter {
                            margin-left: 10px;
                        }

                        .removeFilter {
                            margin-left: 10px;
                            font-weight: 300;
                            color: ${colors.secondary}; 
                        }

                        .removeFilter:hover {
                            color:${colors.tulip};
                            cursor: pointer;                        
                        }

                    .flex {
                        display: flex;
                        flex-direction: row;
                    }

                    .productsListLeft, .productsListRight {
                        /*
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
                        grid-template-rows: auto;
                        grid-gap: 20px;
                        */
                        display: flex;
                        flex-direction: column;
                        flex-wrap: wrap;
                        width: 100%;                     
                    }

                    .productsListLeft {
                        margin-right: 20px;
                    }

                    .product {
                        /*width: 50%;*/
                        & :global(.product-border) {
                            margin: 0; 
                            margin-bottom: 20px;
                            width: 100%;
                        }

                    }

                    /** Show number of pages, current page number and buttons
                     * for navigating to next or previous page
                     */
                    .pageNavigation {
                        display: flex;
                        justify-content: space-between;
                        flex-wrap: wrap;
                        margin-bottom: 20px;
                    }

                    .pageNavigation p {
                        margin: auto;
                    }

                    @media (max-width: 1200px) {
                        .page {
                            padding: 0 10px;
                            margin: 0 auto;
                        }
                    }

                    /**
                     * When the viewport gets too small, make products
                     * appear in one column
                     */
                    @media (max-width: 950px) {
                        .page {
                            margin: 0 auto;
                        }

                        .flex {
                            flex-direction: column;
                        }

                        .countryFilter {
                            & :global(select) {
                                width: 200px;
                            }
                        }
                    }
                `}</style>
            </div>
        );
    }

    /**
     * Internal renderer that renders a button
     */
    private renderButton = (text:String) => {
        return (
            <button className={this.state.isPending ? "isPending" : ""}>
                <span className="text">{text}</span>
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
                        
                        cursor: pointer;

                        width: 170px;
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
                            font-size: 14px;
                            width: 90px;
                            height: 35px;
                        }
                    }

                `}</style>
            </button>
        );
    }


    /**
     * Is passed down to SelectCountry and allows us to extract its value
     */
    private removeFilter = () => {
        this.setState({filterCountry: undefined});
    }

    /**
     * Is passed down to SelectCountry and allows us to extract its value
     */
    private newCountrySelected = (newCountry:string) => {
        this.setState({filterCountry: newCountry,});
    }
}

export const ProductsPage = injectStore((store) => ({ store }), UnwrappedProductsPage);