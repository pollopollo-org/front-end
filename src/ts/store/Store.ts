import { observable } from "mobx";
import { DummyModel } from "../models/DummyModel";

/**
 * Root data store for the application lifecycle
 *
 * This store combines all data models, allowing for easy access down the
 */
// tslint:disable completed-docs
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

    constructor(initial: {
        dummyModel: DummyModel,
    }) {
        this.dummy = initial.dummyModel;
    }
}
