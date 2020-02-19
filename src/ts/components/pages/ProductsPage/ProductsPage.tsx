import React from "react";
import ProductsPageJson from "src/assets/data/productsPage.json";
import { Selecter } from "src/ts/components/utils/Selecter";
import { CountryFilter } from "src/ts/components/utils/CountryFilter";
import { colors, fonts, routes } from "src/ts/config";
import { injectStore } from "src/ts/store/injectStore";
import { Store } from "src/ts/store/Store";
import { Throbber, Button} from "src/ts/components/utils";
import { ProductModel, fetchFilteredProductBatch, fetchProductCountries, fetchProductCities } from "src/ts/models/ProductModel";
import { Product } from "src/ts/components/elements/Product/Product";
import { getUserType } from "src/ts/utils/getUserType";
import { UserTypes } from "src/ts/models/UserModel";
import { Link } from "react-router-dom";
import { getSVG } from "src/assets/svg";

export type ProductsPageProps = {
    /**
     * Contains a reference to the root sotre
     */
    store: Store;
}

type ProductsPageState = {
    /**
     * List of cities in which products are available
     */
    filterCountries?: string[];
    
    /**
     * The country the user wants to see products from
     */
    filterCountry?: string;

    /**
     * List of cities within given country in which products are available
     */
    filterCities?: string[];

    /**
     * The city the user wants to see products from
     */
    filterCity?: string;

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
     * Specifies whether or not the filterbutton should be shown
     */
    //showFilterButton?: boolean;

    /**
     * Specifies whether or not we're fetching a new page of products
     */
    isFetchingNext?: boolean;

    /**
     * Specifies whether or not we're fetching a previous page of products
     */
    isFetchingPrevious?: boolean;

    /**
     * Specifies whether filters should be showing
     */
    showFilters: boolean;
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
        showFilters: false,
        //showFilterButton: false,
    }

    /**
     * Fetch initial set of data as soon as the component mounts
     */
    public async componentDidMount(): Promise<void> {
        await this.fetchProducts(this.state.currentPage);
        await this.fetchCountries();
        this.setState({isPending: false});
    }

    /**
     * Main render method for the entire component
     */
    public render(): JSX.Element {
        return (
            <div className="page">
                {this.renderIntroduction()}
                {this.state.products && this.state.products.length !== 0 && this.renderFilterSection()}
                {(this.state.isPending)
                    ? <div className="flex"><i className="throbber-wrapper">
                            <Throbber size={64} relative={true} />
                    </i></div>
                    : <>
                        {this.state.products && this.state.products.length != 0
                            ? <>
                                <div className={`flex ${this.state.isPending ? "pending" : ""}`}>
                                    <div className="productsListLeft">
                                        {this.renderListOfProducts(true)}
                                    </div>
                                    <div className="productsListRight">
                                        {this.renderListOfProducts(false)}
                                    </div>
                                </div>
                                {this.renderNavigation()}
                            </>
                            :<h2><i>{ProductsPageJson.noProductsAvailable}</i></h2>
                        }
                    </>
                }


                {/*
                {this.renderIntroduction()}
                {this.state.products && this.state.showFilterButton && this.renderFilterSection()}

                {this.state.products && this.state.products.length !== 0
                    ? <div className="flex">
                        {this.setState({showFilterButton: true})}
                        <div className="productsListLeft">
                            {this.renderListOfProducts(true)}
                        </div>
                        <div className="productsListRight">
                            {this.renderListOfProducts(false)}
                        </div>
                    </div>
                    : (this.state.isPending ? <div className="flex"><i className="throbber-wrapper"><Throbber size={64} relative={true} /></i></div> : <h2><i>{ProductsPageJson.noProductsAvailable}</i>{this.setState({showFilterButton: false})}</h2>)}

                {this.renderNavigation()}*/}

                <style jsx>{`
                    .page {
                        display: flex;
                        flex-direction: column;
                        margin-bottom: 20px;
                    }

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
                        min-height: 100px;

                        &.isPending {
                            display: none;
                        }
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
                            margin: 0 auto 20px auto;
                        }
                    }

                    /**
                     * When the viewport gets too small, make products
                     * appear in one column
                     */
                    @media (max-width: 950px) {
                        .flex {
                            flex-direction: column;
                        }
                    }

                    @media (max-width: 550px) {
                        .page {
                            margin-left: 10px;
                            margin-right: 10px;
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
                    return (
                        <Product
                            key={index}
                            product={product}
                            userType={getUserType(this.props.store.user, UserTypes.PRODUCER)}
                            isOnProducersPage={false}
                            isOwnProduct={false}
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
                <div className="allDiv">
                    <div className="header">
                        <h1>{ProductsPageJson.title}</h1>
                        {getUserType(this.props.store.user) === UserTypes.PRODUCER && (
                            <Link className="productsPage__link newProduct" to={routes.createProduct.path} title="Create new product">
                                <i>
                                    {getSVG("plus-square")}
                                </i>
                            </Link>
                        )}
                    </div>
                    <p className="introduction">{ProductsPageJson.text1}</p>
                    <p className="introduction">{ProductsPageJson.text2}</p>
                </div>

                <style jsx>{`
                    .introduction {
                        line-height: 1.4;
                    }

                    .allDiv{
                        width: 1160px;
                        position: relative;
                    }

                    h1 {
                        display: inline-block;
                        margin: 0;
                        margin-top: 30px;
                    }

                    i {
                        display: block;
                        width: 24px;
                        height: 24px;
                    }

                    :global(.productsPage__link) {
                        color: ${colors.primary};
                        display: inline-block;
                        margin-left: 10px;
                    }

                    :global(.link):hover {
                        color: ${colors.secondary};
                    }

                    @media (max-width: 1200px) {
                        .allDiv {
                            width: 100%;
                        }
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
    private renderFilterSection(): React.ReactNode {
        return (
            <div className="filter_section">
                {this.state.filterCountry !== undefined && (
                    <span
                        className="removeFilter"
                        role="button"
                        aria-label="Remove filter"
                        onClick={this.removeFilter}
                    >
                        {ProductsPageJson.RemoveFilter}
                    </span>)}
                <Button
                    className = "filter_button"
                    withThrobber={false}
                    text={"Filter"}
                    width={110}
                    height={43}
                    fontSize={16}
                    isPending={false}
                    onClick={this.toggleFilters} 
                    withChevron={true}
                    showChevronInversed={this.state.showFilters}
                    />
                

                {this.state.showFilters && <div className="filters">
                    <div className="countryFilter">
                        <CountryFilter countries={this.state.filterCountries} onChange={this.newCountrySelected} current={this.state.filterCountry} />
                    </div>
                    <div className="cityFilter">
                        <Selecter elements={this.state.filterCities} defaultText="Select city" allText="All cities" onChange={this.newCitySelected} current={this.state.filterCity} isDisabled={this.state.filterCountry === undefined} />
                    </div>
                </div>}

                <style jsx>{`
                    .filter_section {
                        margin-bottom: 20px;
                        text-align: right;
                    }

                    .removeFilter {
                        margin-right: 10px;
                        font-weight: 300;
                        color: ${colors.secondary}; 
                    }

                    .removeFilter:hover {
                        color:${colors.tulip};
                        cursor: pointer;                        
                    }  

                    .filters {
                        display: flex;
                        justify-content: flex-end;
                    }

                    .cityFilter {
                        margin-left: 15px;
                        margin-top: 20px;
                    }

                    @media (max-width: 800px) {
                        .countryFilter, .cityFilter {
                            & :global(select) {
                                width: 250px;
                            }
                        }
                    }

                    @media (max-width: 540px) {
                        .filters {
                            flex-direction: column;
                        }
                        .countryFilter, .cityFilter {
                            & :global(select) {
                                width: 100%;
                                max-width: 100%;
                            }
                        }

                        .cityFilter {
                            margin: 10px 0 0 0;
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
        const isLastPage = this.state.currentPage === this.getAmountOfPages() - 1;

        return (
            <div className="pageNavigation">
                <span className="left">
                    {!isFirstPage && this.renderButton(ProductsPageJson.PreviousPage, !!this.state.isFetchingPrevious, this.goToPreviousPage)}
                </span>
                <span className="info">{ProductsPageJson.Page} {this.state.currentPage + 1} {ProductsPageJson.Of} {this.getAmountOfPages()}</span>
                <span className="right">
                    {!isLastPage && this.renderButton(ProductsPageJson.NextPage, !!this.state.isFetchingNext, this.goToNextPage)}
                </span>

                <style jsx>{`
                    /** Show number of pages, current page number and buttons
                     * for navigating to next or previous page
                     */
                    .pageNavigation {
                        position: relative;
                        /*margin-bottom: 20px;*/
                        height: 63px;
                    }

                    .pageNavigation .right {
                        position: absolute;
                        right: 0;
                        top: 0;
                    }

                    .pageNavigation .left {
                        position: absolute;
                        left: 0;
                        top: 0;
                    }

                    .pageNavigation .info {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        font-family: ${ fonts.text};
                        font-weight: 300;
                    }               
                `}</style>
            </div>
        );
    }

    /**
     * Internal renderer that renders a button
     */
    private renderButton = (text: string, isLoading: boolean, onClick?: () => void) => {
        return (
            <div className="button">
                <Button
                    withThrobber={true}
                    text={text}
                    width={170}
                    height={43}
                    fontSize={16}
                    isPending={isLoading}
                    throbberSize={30}
                    onClick={onClick} />

                <style jsx>{`
                    /** Style button to match the rest of the project */
                    .button {
                        margin: 10px 0;
                        position: relative;
                        display: block;
                    }

                    /* For mobile phones */
                    @media (max-width: 666px) {
                        .button :global(button) {
                            font-size: 14px;
                            width: 90px;
                            height: 35px;
                        }
                    }

                `}</style>
            </div>
        );
    }

    /**
     * Internal helper that'll fetch the products needed to render the current
     * page.
     */
    private fetchProducts = async (pageIndex: number) => {
        this.setState({isPending: true});
        //this.setState({products: []});
        let response = null;
        if (this.state.filterCountry && this.state.filterCity) {
            response = await fetchFilteredProductBatch(this.props.store, pageIndex * BATCH_SIZE, (pageIndex + 1) * BATCH_SIZE, this.state.filterCountry, this.state.filterCity);
        } else if (this.state.filterCountry) {
            response = await fetchFilteredProductBatch(this.props.store, pageIndex * BATCH_SIZE, (pageIndex + 1) * BATCH_SIZE, this.state.filterCountry);
        } else {
            response = await fetchFilteredProductBatch(this.props.store, pageIndex * BATCH_SIZE, (pageIndex + 1) * BATCH_SIZE);
        }
        
        if (!response) {
            this.setState({ products: undefined });
            return;
        }

        this.setState({
            products: response.products,
            totalProducts: response.count,
        });
        this.setState({isPending: false});
    }

    /**
     * Internal helper that'll fetch the countries in which products are available
     */
    private fetchCountries = async () => {
        const responseCountries = await fetchProductCountries(this.props.store);
        if (!responseCountries) {
            this.setState({ filterCountries: undefined });
            return;
        }
        this.setState({
            filterCountries: responseCountries,
        });
    }

    /**
     * Internal helper that when called will navigate the user to the next page
     */
    private goToNextPage = async () => {
        const isLastPage = this.state.currentPage === this.getAmountOfPages() - 1;

        if (isLastPage) {
            return;
        }

        this.setState({ isFetchingNext: true });

        await this.fetchProducts(this.state.currentPage + 1);
        this.setState({ currentPage: this.state.currentPage + 1, isFetchingNext: false });
        window.scrollTo(0, 0);
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

        await this.fetchProducts(this.state.currentPage - 1);
        this.setState({ currentPage: this.state.currentPage - 1, isFetchingPrevious: false });
        window.scrollTo(0, 0);
    }

    /**
     * Internal helper that returns the current amount of available pages based
     * on the total count of products
     */
    private getAmountOfPages = () => {
        return Math.ceil(this.state.totalProducts / BATCH_SIZE);
    }

    /**
     * Removes filters and displays all products
     */
    private removeFilter = () => {
        this.setState({ 
            filterCountry: undefined,
            filterCity: undefined,
        }, () => this.fetchProducts(this.state.currentPage));
    }

    /**
     * Toggle whether filters are showed or not
     */
    private toggleFilters = () => {
        this.setState({showFilters: !this.state.showFilters});
    }

    /**
     * Is passed down to SelectCountry and allows us to extract its value
     */
    private newCountrySelected = (newCountry: string) => {
        if (newCountry === "ALL") {
            this.setState({
                filterCountry: undefined,
                filterCity: undefined
            }, () => this.fetchProducts(this.state.currentPage));
        } else {
            this.setState({
                filterCountry: newCountry,
                filterCity: undefined
            }, () => this.fetchProducts(this.state.currentPage));
            this.fetchCities(newCountry);
        }
    }

    /**
     * Internal helper that'll fetch the cities
     */
    private fetchCities = async (country: string) => {
        const response = await fetchProductCities(country, this.props.store);
        if (!response) {
            this.setState({ filterCities: undefined });
            return;
        }
        this.setState({
            filterCities: response,
        });
    }

    /**
     * Is passed down to SelectCountry and allows us to extract its value
     */
    private newCitySelected = (newCity: string) => {
        if (newCity === "ALL") {
            this.setState({filterCity: undefined}, () => this.fetchProducts(this.state.currentPage));
        } else {
            this.setState({ filterCity: newCity}, () => this.fetchProducts(this.state.currentPage));
        }
    }
}

export const ProductsPage = injectStore((store) => ({ store }), UnwrappedProductsPage);