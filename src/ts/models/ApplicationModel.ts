import { observable } from "mobx";

import { DataProviders } from "../store/createStore";

type DummyModelData = {
    /**
     * Specifies the amount of times the user wish to buy a given product
     */
    amount: string;

    country: string;

    /**
     * Motivation defines why the user has applied for the given product, in order
     * for potential doners determine
     */
    motivation: string;

    name: string;

    /**
     * Describes the price of the produce being sold in dollars.
     */
    price: number;

    /**
     * Describes the product the PRODUCER is selling
     */
    product: string;

    /**
     * Contains a thumbnail of the applicant
     */
    thumbnail: string;
};

/**
 * Exmaple of a model, and how to implement one.
 */
export class DummyModel {
    /**
     * Helper that instantiates a dummy model, populated with required data.
     */
    public static async CREATE(dataProivder: DataProviders): Promise<DummyModel> {
        if (dataProivder === DataProviders.BACKEND) {
            // Actually fetch data from backend.. :-)
            return new DummyModel({ title: "invalid", userId: "invalid" });
        } else {
            const data = await import("../../assets/dummy/dummy.json");

            return new DummyModel(data);
        }
    }

    /**
     * Dummy title
     */
    public readonly title: string;

    /**
     * Dummy userId
     */
    public readonly userId: string;

    /**
     * Value that increments over time :-)
     */
    @observable
    public incrementingValue: number = 0;

    constructor(data: DummyModelData) {
        this.title = data.title;
        this.userId = data.userId;

        this.autoIncrement();
    }

    /**
     * Temp method to illustrate that mobx properly reflects updated values
     * in the UI.
     */
    private autoIncrement(): void {
        setTimeout(
            () => {
                this.incrementingValue++;
                this.autoIncrement();
            },
            500,
        );
    }
}
