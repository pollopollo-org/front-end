import { observable } from "mobx";

/**
 * Root data store for the application lifecycle
 *
 * This store combines all data models, allowing for easy access down the
 *
 */
export class Store {
    /**
     * Specifies the application has managed to fully render itself yet.
     * This is used to activate initial transitions when required (i.e. when
     * didMount changes to true).
     */
    @observable
    public didMount: boolean = false;

    constructor() {
        // Todo...
    }
}
