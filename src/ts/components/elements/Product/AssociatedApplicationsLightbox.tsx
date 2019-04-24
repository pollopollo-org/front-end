import React from "react";
import { ProductModel } from "src/ts/models/ProductModel";
import { Lightbox } from "src/ts/components/utils/Lightbox/Lightbox";
import { Application } from "src/ts/components/elements/Application/Application";
import { UserTypes } from "src/ts/models/UserModel";

type AssociatedApplicationsLightboxProps = {
    /**
     * Specifies if we should currently be displaying the open applications
     * associated with the product
     */
    displayOpenApplications?: boolean;

    /**s
     * Specifies if we should currently be displaying the pending applications
     * associated with the product
     */
    displayPendingApplications?: boolean;

    /**
     * Specifies the product that the lightbox should be connected to.
     */
    product: ProductModel;

    /**
     * Callback to be triggered once the lightbox should be closed
     */
    onClose(): void;
}

/**
 * Component associated with the product template that can be used to open a
 * list of associated applications.
 */
export class AssociatedApplicationsLightbox extends React.PureComponent<AssociatedApplicationsLightboxProps> {
    /**
     * Main render method
     */
    public render(): JSX.Element {
        return (
            <Lightbox
                active={!!this.props.displayOpenApplications || !!this.props.displayPendingApplications}
                onClose={this.props.onClose}
            >
                <div>
                    <h3>{this.getTitle()}</h3>
                    {this.getApplications().map((application, index) => (
                        <Application
                            key={index}
                            isOnReceiversPage={false}
                            isOwnApplication={false}
                            userType={UserTypes.PRODUCER}
                            application={application}
                            isAssociatedApplication={true}
                        />
                    ))}

                    <style jsx>{`
                        div {
                            /**
                             * Crop applications to maxmimum dimensions
                             */
                            width: calc(100vw - 60px);
                            max-width: 560px;
                            padding: 20px;
                        }    

                        h3 {
                            margin: 0;
                        }
                    `}</style>
                </div>
            </Lightbox>
        );
    }

    /**
     * Internal helper that returns the appropriate title to be rendered at the
     * given moment
     */
    private getTitle = () => {
        if (this.props.displayOpenApplications) {
            return "Open applications";
        }

        if (this.props.displayPendingApplications) {
            return "Pending applications";
        }

        return "";
    }

    /**
     * Internal helper that returns the appropriate applications to be rendered
     * at the given moment
     */
    private getApplications = () => {
        if (this.props.displayOpenApplications) {
            return this.props.product.openApplications;
        }

        if (this.props.displayPendingApplications) {
            return this.props.product.pendingApplications;
        }

        return [];
    }
}