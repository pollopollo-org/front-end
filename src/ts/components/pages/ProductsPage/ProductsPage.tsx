import React from "react";
import ProductsPageJson from "src/assets/data/productsPage.json";
import { SelectCountry } from "src/ts/components/utils/SelectCountry";
import { colors, fonts } from "src/ts/config";
import { injectStore } from "src/ts/store/injectStore";
import { Store } from "src/ts/store/Store";
import { Throbber } from "src/ts/components/utils";
import { ProductModel } from "src/ts/models/ProductModel";
import { Product } from "src/ts/components/elements/Product/Product";
import { getUserType } from "src/ts/utils/getUserType";
import { UserTypes } from "src/ts/models/UserModel";
import { fetchProductBatch } from "src/ts/utils/fetchProducts";

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
     * Specifies the currently rendered page
     */
    currentPage: number;

    /**
     * Specifies the total amount of products available on the page, which will
     * be used for pagination
     */
    totalProducts: number;

    /**
     * Specifies whether or not we are currently attempting to access the backend
     */
    isPending?: boolean;

    /**
     * Specifies whether or not we're fetching a new page of products
     */
    isFetchingNext?: boolean;

    /**
     * Specifies whether or not we're fetching a previous page of products
     */
    isFetchingPrevious?: boolean;
}

/**
 * Specifies the amount of products to load on a single page
 */
const BATCH_SIZE = 20;

/**
 * A page where a user can see a list of all active products
 */
class UnwrappedProductsPage extends React.PureComponent<ProductsPageProps, ProductsPageState> {
    /**
     * Setup initial state
     */
    public state: ProductsPageState = {
        currentPage: 0,
        totalProducts: 0,
        isPending: true,
        products: [],
    }

    /**
     * Fetch initial set of data as soon as the component mounts
     */
    public async componentDidMount(): Promise<void> {
        await this.fetchData(this.state.currentPage);
    }

    /**
     * Main render method for the entire component
     */
    public render(): JSX.Element{
        return (
            <div className="page">
                {this.renderIntroduction()}

                {this.state.products
                    ? <div className="flex">
                        { (this.state.isPending) && 
                            <i className="throbber-wrapper">
                                <Throbber size={64} relative={true} />
                            </i>
                        }
                        <div className="productsListLeft">
                            {this.renderListOfProducts(true)}
                        </div>
                        <div className="productsListRight">
                            {this.renderListOfProducts(false)}
                        </div>
                    </div>
                    : <h2><i>There is no products available.</i></h2>}
                
                { this.renderNavigation() }
                
                <style jsx>{`
                    h2 {
                        margin: 50px 0;
                        text-align: center;
                    }

                    .flex {
                        display: flex;
                        flex-direction: row;

                        /** 
                         * Ensure throbber positions itself properly, even in
                         * the case where no products are available yet 
                         */
                        position: relative;
                        min-height: 200px;
                    }

                    .productsListLeft, 
                    .productsListRight {
                        display: flex;
                        flex-direction: column;
                        flex-wrap: wrap;
                        width: 100%;                     
                    }

                    .productsListLeft {
                        margin-right: 20px;
                    }

                    .throbber-wrapper {
                        position: absolute;
                        left: 50%;
                        top: 50%;
                        transform: translate(-50%, -50%);

                        width: 64px;
                        height: 64px;
                    }

                    .product :global(.product-border) {
                        margin: 0; 
                        margin-bottom: 20px;
                        width: 100%;
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
                    }
                `}</style>
            </div>
        );
    }

    /**
     * Internal renderer that renders a list of either even or uneven indexed
     * products
     */
    private renderListOfProducts(renderEvenProducts: boolean): React.ReactNode {
        if (!this.state.products) {
            return;
        }

        const evenOrUneven = renderEvenProducts ? 0 : 1;

        return (
            this.state.products.map((product, index) => {
                if (index % 2 === evenOrUneven) {
                    const isOwnProduct = this.props.store.user 
                        ? this.props.store.user.id === product.producerId 
                        : false;

                    return (
                        <Product 
                            product={product}
                            userType={getUserType(this.props.store.user, UserTypes.PRODUCER)}
                            isOnProducersPage={false}
                            isOwnProduct={isOwnProduct}
                        />
                    );
                }

                return;
            })
        );
    }

    /**
     * Internal renderer that renders the introduction of the products page
     */
    private renderIntroduction(): React.ReactNode {
        return (
            <React.Fragment>
                <h1>{ProductsPageJson.title}</h1>
                <p className="introduction">{ProductsPageJson.text}</p>

                <style jsx>{`
                    .introduction {
                        line-height: 1.4;
                    }     
                `}</style>
            </React.Fragment>
        );
    }

    /**
     * Internal renderer that'll render a list of filters to be used to filter
     * available products.
     */
    // @ts-ignore
    private renderFilters(): React.ReactNode {
        return (
            <div>
                <span><b>{ProductsPageJson.Filter}</b></span>
                <span className="countryFilter">
                    <SelectCountry onChange={this.newCountrySelected} currentCountry={this.state.filterCountry} />
                </span>
                {this.state.filterCountry !== undefined && (
                    <span 
                        className="removeFilter" 
                        role="button" 
                        aria-label="Remove filter" 
                        onClick={this.removeFilter}
                    >
                        {ProductsPageJson.RemoveFilter}
                    </span>
                )}

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

                    @media (max-width: 666px) {
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
     * Internal renderer that'll render a pagination navigator in the bottom
     * of the products list that can be used to navigate products.
     */
    private renderNavigation(): React.ReactNode {
        // If we only have one page of navigation available to us, then don't
        // bother render pagination navigation.
        if (this.getAmountOfPages() <= 1) {
            return;
        }

        const isFirstPage = this.state.currentPage === 0;
        const isLastPage = this.state.currentPage === this.getAmountOfPages();

        return (
            <div className="pageNavigation">
                { !isFirstPage && this.renderButton(ProductsPageJson.PreviousPage, !!this.state.isFetchingPrevious, this.goToPreviousPage)}
                <span>Page {this.state.currentPage} of {this.getAmountOfPages()}</span>
                { !isLastPage && this.renderButton(ProductsPageJson.NextPage, !!this.state.isFetchingNext, this.goToNextPage)}

                <style jsx>{`
                    /** Show number of pages, current page number and buttons
                     * for navigating to next or previous page
                     */
                    .pageNavigation {
                        display: flex;
                        justify-content: space-between;
                        flex-wrap: wrap;
                        margin-bottom: 20px;
                    }

                    .pageNavigation span {
                        margin: auto;
                    }               
                `}</style>
            </div>
        );
    }

    /**
     * Internal renderer that renders a button
     */
    private renderButton = (text: string, isLoading: boolean, onClick: () => void) => {
        return (
            <button className={isLoading ? "isPending" : ""} onClick={onClick}>
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
     * Internal helper that'll fetch the products needed to render the current
     * page.
     */
    private fetchData = async (pageIndex: number) => {
        const response = await fetchProductBatch(pageIndex * BATCH_SIZE, (pageIndex + 1) * BATCH_SIZE);

        if (!response) {
            this.setState({ products: undefined });
            return;
        }

        this.setState({
            products: response.products,
            totalProducts: response.count,
        });
    }

    /**
     * Internal helper that when called will navigate the user to the next page
     */
    private goToNextPage = async () => {
        const isLastPage = this.state.currentPage === this.getAmountOfPages();

        if (isLastPage) {
            return;
        }

        this.setState({ isFetchingNext: true });

        await this.fetchData(this.state.currentPage + 1);
        this.setState({ currentPage: this.state.currentPage + 1, isFetchingNext: false });
    }

    /**
     * Internal helper that when called will navigate the user to the prev page
     */
    private goToPreviousPage = async () => {
        const isFirstPage = this.state.currentPage === 0;

        if (isFirstPage) {
            return;
        }

        this.setState({ isFetchingPrevious: true });

        await this.fetchData(this.state.currentPage - 1);
        this.setState({ currentPage: this.state.currentPage - 1, isFetchingPrevious: false });
    }

    /**
     * Internal helper that returns the current amount of available pages based
     * on the total count of products
     */
    private getAmountOfPages = () => {
        return Math.ceil(this.state.totalProducts / BATCH_SIZE);
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