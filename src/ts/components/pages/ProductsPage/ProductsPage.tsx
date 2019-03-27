import React from "react";
import { Product } from "src/ts/components/elements/Product/Product";
import ProductsPageJson from "src/assets/data/productsPage.json";
import { SelectCountry } from "src/ts/components/utils/SelectCountry";
import { colors } from "src/ts/config";
import { injectStore } from "src/ts/store/injectStore";
import { Store } from "src/ts/store/Store";
import { UserTypes } from "src/ts/models/UserModel";

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
}

/**
 * A page where a user can see a list of all active products
 */
class UnwrappedProductsPage extends React.PureComponent<ProductsPageProps, ProductsPageState> {
    /**
     * State of the register form, all fields initially set to null
     */
    public readonly state: ProductsPageState = {};

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
                <div className="productsList">
                    <div className="product"><Product product={this.props.store.products[1]} userType={ UserTypes.RECEIVER } isOwnProduct={ false } /></div>
                    <div className="product"><Product product={this.props.store.products[1]} userType={ UserTypes.RECEIVER } isOwnProduct={ false } /></div>
                    <div className="product"><Product product={this.props.store.products[1]} userType={ UserTypes.RECEIVER } isOwnProduct={ false } /></div>
                    <div className="product"><Product product={this.props.store.products[1]} userType={ UserTypes.RECEIVER } isOwnProduct={ false } /></div>
                </div>
                <div className="productsList">
                    <div className="product"><Product product={this.props.store.products[1]} userType={ UserTypes.RECEIVER } isOwnProduct={ false } /></div>
                    <div className="product"><Product product={this.props.store.products[1]} userType={ UserTypes.RECEIVER } isOwnProduct={ false } /></div>
                    <div className="product"><Product product={this.props.store.products[1]} userType={ UserTypes.RECEIVER } isOwnProduct={ false } /></div>
                    <div className="product"><Product product={this.props.store.products[1]} userType={ UserTypes.RECEIVER } isOwnProduct={ false } /></div>
                </div>
                </div>
                <style jsx>{`
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

                    .productsList {
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

                    .product {
                        /*width: 50%;*/

                        & :global(.product-border) {
                            margin: 0;
                            margin-bottom: 20px;
                        }

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