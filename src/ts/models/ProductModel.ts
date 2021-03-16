import { CountryCodes } from "src/ts/models/CountryCodes";
import countriesJson from "src/assets/countries.json";
import { History } from "history";

import { alertApiError } from "src/ts/utils/alertApiError";
import { apis } from "src/ts/config/apis";
import { Store } from "src/ts/store/Store";
import { objectToFormData } from "src/ts/utils/objectToFormData";
import { asyncTimeout } from "src/ts/utils";
import { routes } from "src/ts/config";
import { ApplicationModel, ApplicationModelData } from "src/ts/models/ApplicationModel";

export enum ProductStatus {
    ACTIVE = "Available",
    INACTIVE = "Unavailable",
    ALL = "All",
}

/**
 * Defines what the backend will return, and what is required to create a product 
 * model.
 *
 * The fields have been commented in length within the actual class, and therefore
 * won't be documented here.
 */
// tslint:disable completed-docs
export type ProductModelData = {
    productId: number;
    country: CountryCodes;
    description: string;
    title: string;
    price: number;
    available: boolean;
    userId: number;
    thumbnail: string;
    rank?: number;
    openApplications: ApplicationModelData[];
    pendingApplications: ApplicationModelData[];
    closedApplications: ApplicationModelData[];
    completedApplications?: ApplicationModelData[];

    // product stats
    dateLastDonation: string;
    completedDonationsPastWeek: number;
    completedDonationsPastMonth: number;
    completedDonationsAllTime: number;
    pendingDonationsPastWeek: number;
    pendingDonationsPastMonth: number;
    pendingDonationsAllTime: number;
};

export type ProductModelFields = {
    id: number;
    location: string;
    countryCode: CountryCodes;
    description: string;
    title: string;
    price: number;
    isActive: boolean;
    producerId: number;
    thumbnail?: string;
    rank?: number;
    openApplications: ApplicationModel[];
    pendingApplications: ApplicationModel[];
    closedApplications: ApplicationModel[];
    completedApplications: ApplicationModel[];

    // product stats
    dateLastDonation: string;
    completedDonationsPastWeek: number;
    completedDonationsPastMonth: number;
    completedDonationsAllTime: number;
    pendingDonationsPastWeek: number;
    pendingDonationsPastMonth: number;
    pendingDonationsAllTime: number;
}

/**
 * Specifies data required to post a product to the backend
 */
export type ProductPostData = {
    title: string;
    price: number;
    description: string;
    image?: Blob;
    rank?: number;
}
// tslint:enable completed-docs

/**
 * Contains the path to the backend which is used to resolve images
 */
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

/**
 *  Product model reflecting the data of a product
 */
export class ProductModel {
    /**
     * Helper that instantiates a model, populated with required data.
     */
    public static CREATE(data: ProductModelData): ProductModel {
        // Parse the country from the supplied countryCode
        const country = countriesJson.find((c) => !data.country ? false : c.Code.toLowerCase() === data.country.toLowerCase());
        const thumbnail = data.thumbnail ? `${BACKEND_URL}/${data.thumbnail}` : undefined;
        let location = "";

        if (!country) {
            console.warn("Unable to find country from countryCode!");
            location = "";
        } else {
            location = country.Name;
        }
        return new ProductModel({
            ...data,
            id: data.productId,
            producerId: data.userId,
            countryCode: data.country,
            isActive: data.available,
            location,
            thumbnail,
            rank: data.rank,
            //Add null checks to show products with no stats
            dateLastDonation: data.dateLastDonation ? data.dateLastDonation : "",
            completedDonationsPastWeek: data.completedDonationsPastWeek ?  data.completedDonationsPastWeek : 0,
            completedDonationsPastMonth: data.completedDonationsPastMonth ? data.completedDonationsPastMonth : 0,
            completedDonationsAllTime: data.completedDonationsAllTime ? data.completedDonationsAllTime : 0,
            pendingDonationsPastWeek: data.pendingDonationsPastWeek ? data.pendingDonationsPastWeek : 0,
            pendingDonationsPastMonth: data.pendingDonationsPastMonth ? data.pendingDonationsPastMonth : 0,
            pendingDonationsAllTime: data.pendingDonationsAllTime ? data.pendingDonationsAllTime : 0,
            openApplications: data.openApplications ? data.openApplications.map((applicationData) => ApplicationModel.CREATE(applicationData)) : [],
            pendingApplications: data.pendingApplications ? data.pendingApplications.map((applicationData) => ApplicationModel.CREATE(applicationData)) : [],
            closedApplications: data.closedApplications ? data.closedApplications.map((applicationData) => ApplicationModel.CREATE(applicationData)) : [],
            completedApplications: data.completedApplications ? data.completedApplications.map((applicationData) => ApplicationModel.CREATE(applicationData)) : []
        });
    }

    /**
     * Specifies the id of the current product
     */
    public readonly id: number;

    /**
     * Defines the location where the product is being sold
     */
    public readonly location: string;

    /**
     * Defines the countryCode of the country that applicant is coming from
     */
    public readonly countryCode: CountryCodes;

    /**
     * Description defines the product in detail, in order
     * for potential receivers determine
     */
    public readonly description: string;


    /**
     * Defines the title to shortly define the product
     */
    public readonly title: string;

    /**
     * Describes the price of the product being sold in dollars.
     */
    public readonly price: number;

    /**
     * Defines whether the isActive of the product is active.
     */
    public readonly isActive: boolean;

    /**
     * The rank of the product, default is 0, which is placed below all other ranks
     */
    public readonly rank?: number;

    /**
     * Describes the PRODUCER who is selling the product
     */
    public readonly producerId: number;

    /**
     * Contains a thumbnail of the producer
     */
    public readonly thumbnail?: string;

    /**
     * Statistics: date for last donation of product
     */
    public readonly dateLastDonation: string;

    /**
     * Statistics: number of completed donations past week
     */
    public readonly completedDonationsPastWeek: number;

    /**
     * Statistics: number of completed donations past month
     */
    public readonly completedDonationsPastMonth: number;

    /**
     * Statistics: number of completed donations alle time
     */
    public readonly completedDonationsAllTime: number;

    /**
     * Statistics: number of pending donations past week
     */
    public readonly pendingDonationsPastWeek: number;

    /**
     * Statistics: number of pending donations past month
     */
    public readonly pendingDonationsPastMonth: number;

    /**
     * Statistics: number of pending donations all time
     */
    public readonly pendingDonationsAllTime: number;

    /**
     * Specifies the amount of open applications related to the product
     */
    public readonly openApplications: ApplicationModel[];

    /**
     * Specifies the amount of pending applications related to the product
     */
    public readonly pendingApplications: ApplicationModel[];

    /**
     * Specifies the amount of closed applications related to the product
     */
    public readonly closedApplications: ApplicationModel[];

    /**
     * Specifies the amount of completed applications related to the product
     */
    public readonly completedApplications: ApplicationModel[];

    constructor(data: ProductModelFields) {
        this.id = data.id;
        this.description = data.description;
        this.countryCode = data.countryCode;
        this.title = data.title;
        this.price = data.price;
        this.description = data.description;
        this.isActive = data.isActive;
        this.producerId = data.producerId;
        this.location = data.location;
        this.thumbnail = data.thumbnail;
        this.rank = data.rank;
        this.openApplications = data.openApplications;
        this.pendingApplications = data.pendingApplications;
        this.closedApplications = data.closedApplications;
        this.completedApplications = data.completedApplications;

        // stats
        this.dateLastDonation = data.dateLastDonation;
        this.completedDonationsPastWeek = data.completedDonationsPastWeek;
        this.completedDonationsPastMonth = data.completedDonationsPastMonth;
        this.completedDonationsAllTime = data.completedDonationsAllTime;
        this.pendingDonationsPastWeek = data.pendingDonationsPastWeek;
        this.pendingDonationsPastMonth = data.pendingDonationsPastMonth;
        this.pendingDonationsAllTime = data.pendingDonationsAllTime;
    }
}

/**
 * The product cache will contain products fetched from the backend in order to
 * avoid having to fetch them over and over again.
 */
const productCache: Map<string, ProductModel[]> = new Map();
let cachedCount: number = 0;

const filteredProductCache: Map<string, ProductModel[]> = new Map();
let filteredCachedCount: number = 0;

/**
 * Method used to fetch a batch of active products from the backend. The fetched
 * products can be from any producers and will be returned in the order
 */
export async function fetchProductBatch(offset: number, amount: number, store: Store) {
    const cacheKey = `${offset}${amount}`;

    // If we have the current request cached, then simply return that!
    if (productCache.has(cacheKey)) {
        return {
            count: cachedCount,
            products: productCache.get(cacheKey),
        };
    }

    const endPoint = apis.products.getBatch.path.replace("{offset}", String(offset)).replace("{amount}", String(amount));

    try {
        const response = await fetch(endPoint, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        // tslint:disable-next-line completed-docs
        const json: { count: number; list: ProductModelData[] } = await response.json();

        // In case everything wen't well, then convert our data to product models
        // and store the response in our cache before returning it.
        if (response.ok) {
            const productArray = json.list.map((productData) => ProductModel.CREATE(productData));
            productCache.set(`${offset}${amount - (amount - json.list.length)}`, productArray);
            cachedCount = json.count;

            return {
                count: json.count,
                products: productArray
            };
        } else {
            // ... else alert any errors that occurred to our users!
            alertApiError(response.status, apis.products.getBatch.errors, store);
            return;
        }

    } catch (err) {
        return;
    }
}

/**
 * Method used to fetch a batch of active products from the backend. The fetched
 * products can be from any producers and will be returned in the order
 * FILTERED by country and city
 */
export async function fetchFilteredProductBatch(store: Store, offset: number, amount: number, country?: string, city?: string) {
    const cacheKey = !country ? `${offset}${amount}` 
                              : (!city ? `${offset}${amount}${country}` 
                                       : `${offset}${amount}${country}${city}`);
    
    // If we have the current request cached, then simply return that!
    if (filteredProductCache.has(cacheKey)) {
        return {
            count: filteredCachedCount,
            products: filteredProductCache.get(cacheKey),
        };
    }

    let endPoint = apis.products.getFilteredBatch.path.replace("{offset}", String(offset)).replace("{amount}", String(amount));
    endPoint = country ? endPoint.replace("{country}", String(country)) : endPoint.replace("&country={country}", "")
    endPoint = city ? endPoint.replace("{city}", String(city)) : endPoint.replace("&city={city}", "")
    try {
        const response = await fetch(endPoint, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        // tslint:disable-next-line completed-docs
        const json: { count: number; list: ProductModelData[] } = await response.json();
        // In case everything wen't well, then convert our data to product models
        // and store the response in our cache before returning it.
        if (response.ok) {
            const productArray = json.list.map((productData) => ProductModel.CREATE(productData));
            const key = !country ? `${offset}${amount}` 
                                 : (!city ? `${offset}${amount}${country}` 
                                          : `${offset}${amount}${country}${city}`);
            
            filteredProductCache.set(key, productArray);
            filteredCachedCount = json.count;

            return {
                count: json.count,
                products: productArray
            };
        } else {
            // ... else alert any errors that occurred to our users!
            alertApiError(response.status, apis.products.getBatch.errors, store);
            return;
        }

    } catch (err) {
        return;
    }
}

/**
 * Method used to fetch a specific product based on its Id.
 * 
 * Users must be logged in to perform this request.
 */
export async function fetchProductById(productId: number, store: Store) {
    const cacheKey = String(productId);

    // If we have a cache hit, then simply return the cached product!
    if (productCache.has(cacheKey)) {
        const cacheHit = productCache.get(cacheKey);
        return cacheHit ? cacheHit[0] : undefined;
    }

    const endPoint = apis.products.getById.path.replace("{productId}", String(productId));

    try {
        const response = await fetch(endPoint, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        const productData: ProductModelData = await response.json();

        // If everything goes well, then create a bunch of productModels from the
        // data and add them to the cache before returning output.
        if (response.ok) {
            const product = ProductModel.CREATE(productData);
            productCache.set(cacheKey, [product]);

            return product;
        } else {
            // ... else alert any errors that occurred to our users!
            alertApiError(response.status, apis.products.getById.errors, store);
            return;
        }

    } catch (err) {
        return;
    }
}

/**
 * Method used to fetch all products related to a specific producer.
 * 
 * Users must be logged in to perform this request.
 */
export async function fetchProductByProducer(producerId: number, store: Store, status: ProductStatus) {
    const cacheKey = `producer-${producerId}-${status}`;

    if (productCache.has(cacheKey)) {
        return productCache.get(cacheKey);
    }

    const endPoint = apis.products.getByProducer.path
        .replace("{producerId}", String(producerId))
        .replace("{productStatus}", String(status));

    try {
        const response = await fetch(endPoint, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        const productsData: ProductModelData[] = await response.json();

        // If everything goes well, then create a bunch of productModels from the
        // data and add them to the cache before returning output.
        if (response.ok) {
            const productArray = productsData.map((productData) => ProductModel.CREATE(productData));
            productCache.set(cacheKey, productArray);

            return productArray;
        } else {
            // ... else alert any errors that occurred to our users!
            alertApiError(response.status, apis.products.getByProducer.errors, store);
            return;
        }

    } catch (err) {
        return;
    }
}

/**
 * Method that'll post a new product to the backend
 */
export async function postProduct(data: ProductPostData, store: Store, history: History) {
    try {
        const startedAt = performance.now();
        const token = localStorage.getItem("userJWT");

        // If either a user haven't been logged in or if we're currently missing
        // a token, then we cannot process this process, and hence we bail out.
        if (!store.user || !token) {
            return;
        }

        const result = await fetch(apis.products.post.path, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                userId: store.user.id,
                title: data.title,
                price: data.price,
                description: data.description,
                country: store.user.country,
                rank: data.rank,
            }),
        });

        let imageResult: Response | undefined = undefined;

        // If the user has passed an image to our form, then we should attempt to 
        // upload that to the server as well.
        if (data.image) {
            const formObject = {
                userId: String(store.user.id),
                productId: String((await result.json()).productId),
                file: data.image,
            }

            imageResult = await fetch(apis.products.postImage.path, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: objectToFormData(formObject),
            })
        }

        // Now, ensure we've waited for at least 500ms before resolving the request
        // in order to ensure throbber actually will be displayed, and that the 
        // UI want appear 'jumpy'
        await asyncTimeout(Math.max(0, 500 - (performance.now() - startedAt)));

        if (result.ok && (!imageResult || imageResult.ok)) {
            // If everything goes well, then we should invalidate the cache for
            // the given producer, in order to ensure that the newly created product
            // will be properly fetched with all data needed, the next time the
            // user profile is visited
            productCache.delete(`producer-${store.user.id}-Available`);

            // ... and finally navigate the user back to his/hers own profile
            history.push(routes.profile.path);
        } else {
            alertApiError(result.status, apis.products.post.errors, store);

            // In case we actually attempted to send an image, then log any errors
            // related to that.
            if (imageResult) {
                alertApiError(imageResult.status, apis.products.postImage.errors, store);
            }
        }
    } catch (err) {
        store.currentErrorMessage = "Something went wrong while attempting to create your product, please try again later.";
    }
}

/**
 * Helper that toggles the product from either active to inactive or vice versa
 * and updates the backend in the process
 */
export async function toggleProductAvailability(product: ProductModel, store: Store, callback?: (newProduct: ProductModel) => void) {
    try {
        const token = localStorage.getItem("userJWT");

        // The user MUST be logged in in order to be able to toggle the product
        // availability. (furthermore the logged in user must be the owner of
        // the product, else the backend will throw errors).
        if (!token || !store.user) {
            return;
        }

        const result = await fetch(apis.products.put.path.replace("{productId}", String(product.id)), {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                id: product.id,
                userId: store.user.id,
                available: !product.isActive, // Updating availability
            }),
        });

        const data = await result.json();

        if (result.ok) {
            productCache.delete(`producer-${store.user.id}-Available`);
            productCache.delete(`producer-${store.user.id}-Unavailable`);

            if (!product.isActive === false && data.pendingApplications > 0) {
                store.currentErrorMessage = `The product has been made inactive, but ${data.pendingApplications} pending application remains.`;
            }

            // In case we have a callback, then broadcast the newly updated product
            // to it.
            if (callback) {
                const newProduct = new ProductModel({ ...product, isActive: !product.isActive });
                callback(newProduct);
            }
        } else {
            alertApiError(result.status, apis.products.post.errors, store);
        }
    } catch (err) {
        // Show error message
        store.currentErrorMessage = "Something went wrong while attempting to update your product, please try again later.";
    } finally {
    }
}

/**
 * Method used to fetch countries in which available products exist
 */
export async function fetchProductCountries(store: Store) {
    //const cacheKey = String(productId);

    // If we have a cache hit, then simply return the cached product!
    /*if (productCache.has(cacheKey)) {
        const cacheHit = productCache.get(cacheKey);
        return cacheHit ? cacheHit[0] : undefined;
    }*/

    const endPoint = apis.products.getCountries.path;

    try {
        const response = await fetch(endPoint, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        const list: string[] = await response.json();
        

        // If everything goes well, then create a bunch of productModels from the
        // data and add them to the cache before returning output.
        if (response.ok) {
            // tslint:disable-next-line: no-unnecessary-local-variable
            //const countryArray = list.map(data => CountriesAndCitiesModel.CREATE(data));
            //productCache.set(cacheKey, [product]);

            //return countryArray;
            return list;
        } else {
            // ... else alert any errors that occurred to our users!
            alertApiError(response.status, apis.products.getCountries.errors, store);
            return;
        }

    } catch (err) {
        return;
    }
}

/**
 * Method used to fetch cities in which available products exist in a given country
 */
export async function fetchProductCities(country: string, store: Store) {
    //const cacheKey = String(productId);

    // If we have a cache hit, then simply return the cached product!
    /*if (productCache.has(cacheKey)) {
        const cacheHit = productCache.get(cacheKey);
        return cacheHit ? cacheHit[0] : undefined;
    }*/

    const endPoint = apis.products.getCities.path.replace("{country}", country);

    try {
        const response = await fetch(endPoint, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        const list: string[] = await response.json();
        

        // If everything goes well, then create a bunch of productModels from the
        // data and add them to the cache before returning output.
        if (response.ok) {
            return list;
        } else {
            // ... else alert any errors that occurred to our users!
            alertApiError(response.status, apis.products.getCountries.errors, store);
            return;
        }

    } catch (err) {
        return;
    }
}