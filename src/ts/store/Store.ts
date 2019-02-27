import { observable } from "mobx";
import { DummyModel } from "../models/DummyModel";

/**
 * Specifies the arguments required to create a store.
 * The specific arguments are described both in their respective classes,
 * and in the fields within the store that they're exposed upon.
 */
// tslint:disable completed-docs
type StoreArgs = {
    dummyModel: DummyModel;
}
// tslint:enable completed-docs

/**
 * Root data store for the application lifecycle
 *
 * This store combines all data models, allowing for easy access down the
 */
export class Store {
    /**
     * Contains a reference to the DummyModel making it accessible from the RootStore
     */
    public readonly dummy: DummyModel;

    /**
     * Specifies the application has managed to fully render itself yet.
     * This is used to activate initial transitions when required (i.e. when
     * didMount changes to true).
     */
    @observable
    public didMount: boolean = false;

    constructor(initial: StoreArgs) {
        this.dummy = initial.dummyModel;
    }
}
