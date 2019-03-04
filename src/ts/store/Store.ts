import { observable } from "mobx";

import { ApplicationModel } from "../models/ApplicationModel";

/**
 * Specifies where the created models should fetch their data from.
 */
export enum DataProviders {
    DUMMY = "dummy",
    BACKEND = "backend",
};

/**
 * Specifies the arguments required to create a store.
 * The specific arguments are described both in their respective classes,
 * and in the fields within the store that they're exposed upon.
 */
// tslint:disable completed-docs
type StoreArgs = {
    applications: ApplicationModel[];
}
// tslint:enable completed-docs

/**
 * Root data store for the application lifecycle
 *
 * This store combines all data models, allowing for easy access down the
 */
// tslint:disable completed-docs
export class Store {
    /**
     * Contains a reference to the ApplicationModel, which contains fetched data
     * about an application.
     */
    public readonly applications: ApplicationModel[];

    /**
     * Specifies the application has managed to fully render itself yet.
     * This is used to activate initial transitions when required (i.e. when
     * didMount changes to true).
     */
    @observable
    public didMount: boolean = false;

    constructor(initial: StoreArgs) {
        this.applications = initial.applications;
    }
}
