import { observable } from "mobx";

import { DataProviders } from "../store/createStore.js";

type DummyModelData = {
    /**
     * Specifies the data of the dummy model.
     */
    title: string;

    /**
     * Specifies the userId of the user associated with the dummy model
     */
    userId: string;
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
