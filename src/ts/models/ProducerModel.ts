import { UserModel, UserModelData } from "src/ts/models/UserModel";
import { ProductModel } from "src/ts/models/ProductModel";

/**
 * Defines the data required to create a producer model.
 *
 * The fields have been commented in length within the actual class
 */
// tslint:disable completed-docs
export type ProducerModelData = {
    wallet?: string;
    pairingLink?: string;
    street: string;
    streetNumber: string;
    zipcode?: string;
    city: string;
    // statistics
    completedDonationsPastWeekNo: number;
    completedDonationsPastWeekPrice: number;
    completedDonationsPastMonthNo: number;
    completedDonationsPastMonthPrice: number;
    completedDonationsAllTimeNo: number;
    completedDonationsAllTimePrice: number;
    pendingDonationsPastWeekNo: number;
    pendingDonationsPastWeekPrice: number;
    pendingDonationsPastMonthNo: number;
    pendingDonationsPastMonthPrice: number;
    pendingDonationsAllTimeNo: number;
    pendingDonationsAllTimePrice: number;
} & UserModelData;
// tslint:enable completed-docs

/**
 * User model for a producer
 */
export class ProducerModel extends UserModel {
    /**
     * The Obyte wallet of the user
     */
    public readonly wallet?: string;

    /**
     * The pairing code of the user
     */
    public readonly pairingLink?: string;

    /**
     * The street the user lives on
     */
    public readonly street: string;

    /**
     * The street number the user lives in
     */
    public readonly streetNumber: string;

    /**
     * The zipcode the user lives in
     */
    public readonly zipcode?: string;

    /**
     * The city the user lives in
     */
    public readonly city: string;

    /**
     * Contains a collection of all products available to a producer
     */
    public readonly products?: ProductModel[];



    /**
     * Statistics: number of completed donations the producer has participated in PAST WEEK
     */
    public readonly completedDonationsPastWeekNo: number;

    /**
     * Statistics: total price of completed donations the producer has participated in PAST WEEK
     */
    public readonly completedDonationsPastWeekPrice: number;

    /**
     * Statistics: number of completed donations the producer has participated in PAST MONTH
     */
    public readonly completedDonationsPastMonthNo: number;

    /**
     * Statistics: total price of completed donations the producer has participated in PAST MONTH
     */
    public readonly completedDonationsPastMonthPrice: number;

    /**
     * Statistics: number of completed donations the producer has participated in ALL TIME
     */
    public readonly completedDonationsAllTimeNo: number;

    /**
     * Statistics: total price of completed donations the producer has participated in ALL TIME
     */
    public readonly completedDonationsAllTimePrice: number;

    /**
     * Statistics: number of pending donations the producer has participated in PAST WEEK
     */
    public readonly pendingDonationsPastWeekNo: number;

    /**
     * Statistics: total price of pending donations the producer has participated in PAST WEEK
     */
    public readonly pendingDonationsPastWeekPrice: number;

    /**
     * Statistics: number of pending donations the producer has participated in PAST MONTH
     */
    public readonly pendingDonationsPastMonthNo: number;

    /**
     * Statistics: total price of pending donations the producer has participated in PAST MONTH
     */
    public readonly pendingDonationsPastMonthPrice: number;

    /**
     * Statistics: number of pending donations the producer has participated in ALL TIME
     */
    public readonly pendingDonationsAllTimeNo: number;

    /**
     * Statistics: total price of pending donations the producer has participated in ALL TIME
     */
    public readonly pendingDonationsAllTimePrice: number;

    constructor(data: ProducerModelData) {
        super(data);
        this.wallet = data.wallet;
        this.pairingLink = data.pairingLink;
        this.street = data.street;
        this.streetNumber = data.streetNumber;
        this.zipcode = data.zipcode;
        this.city = data.city;

        // Statistics
        this.completedDonationsPastWeekNo = data.completedDonationsPastWeekNo;
        this.completedDonationsPastWeekPrice = data.completedDonationsPastWeekPrice;
        this.completedDonationsPastMonthNo = data.completedDonationsPastMonthNo;
        this.completedDonationsPastMonthPrice = data.completedDonationsPastMonthPrice;
        this.completedDonationsAllTimeNo = data.completedDonationsAllTimeNo;
        this.completedDonationsAllTimePrice = data.completedDonationsAllTimePrice;

        this.pendingDonationsPastWeekNo = data.pendingDonationsPastWeekNo;
        this.pendingDonationsPastWeekPrice = data.pendingDonationsPastWeekPrice;
        this.pendingDonationsPastMonthNo = data.pendingDonationsPastMonthNo;
        this.pendingDonationsPastMonthPrice = data.pendingDonationsPastMonthPrice;
        this.pendingDonationsAllTimeNo = data.pendingDonationsAllTimeNo;
        this.pendingDonationsAllTimePrice = data.pendingDonationsAllTimePrice;
    }
}
