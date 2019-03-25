import React from "react";
import { TransitionGroup } from "react-transition-group";
import { colors } from "src/ts/config";
import { Fade } from "src/ts/components/utils/Dropdown/Fade";

/**
 * Enumeration of different directions that the dropdowns can be pointing
 */
enum DropdownArrowDirection {
    UP,
    DOWN,
}

/**
 * Specification of props required to render <Dropdown />.
 */
export type DropdownProps = {
    /**
     * A reference to the DOM node, which the dropdown should be pointing
     * towards.
     */
    pointAt: React.RefObject<HTMLElement>;

    /**
     * Specifies if the dropdown should currently be toggled (ie. made visible
     * to the user).
     */
    active?: boolean;

    /**
     * Callback that'll be triggered when the dropdown should be closed, letting
     * the parent properly update it's state.
     */
    onClose(): void;
};

/**
 * Specification of lifecycle state of <Dropdown />.
 */
type DropdownState = {
    /**
     * Specifies if the arrow of the dropdown should be pointing up or down,
     * depending on whether the dropdown s below or above the reference node.
     */
    arrowDirection?: DropdownArrowDirection;

    /**
     * If we had to adjust the position of the dropdown on the x-axis in order
     * to keep it within the required margins of the horizontal edges of the
     * viewport, then we adjust the arrow by this offset to properly point at
     * the reference node.
     */
    arrowOffset?: number;

    /**
     * Specifies the current value to apply to style.top, so that the dropdown
     * will be pointing directly towards the reference node.
     */
    dropdownTop?: number;

    /**
     * Specifies the current value to apply to style.left, so that the dropdown
     * will be pointing directly towards the reference node.
     */
    dropdownLeft?: number;
};

/**
 * The Dropdown utility allows easy injection of the dropdowns in Gyldendal's
 * basic layout with custom content inside.
 */
export class Dropdown extends React.PureComponent<DropdownProps, DropdownState> {
    /**
     * Set up initial state, so that this.state can always be reference.
     */
    public readonly state: DropdownState = {};

    /**
     * Will contain a reference to the Dropdown wrapper node, when the dropdown
     * is actually mounted into the DOM.
     */
    protected readonly containerRef: React.RefObject<HTMLDivElement> = React.createRef();

    /**
     * Determine if the dropdown is initially activated, and in that case make
     * sure that it's position is going to be recalculated.
     */
    public componentDidMount(): void {
        if (this.props.active) {
            this.activateDropdown();
        }
    }

    /**
     * Determine if the dropdown is being activated at some point during it's
     * lifetime, and then make sure to properly recalculate position.
     */
    public componentDidUpdate(): void {
        if (this.props.active) {
            this.activateDropdown();
        } else {
            this.deactivateDropdown();
        }
    }

    /**
     * Inject a transition group into the render tree at the position of the
     * Dropdown, so that we're ready to transition it into / out of view when
     * needed.
     */
    public render(): JSX.Element {
        return (
            <TransitionGroup component={ React.Fragment }>
                { this.props.active ? this.renderDropdown() : undefined }
            </TransitionGroup>
        );
    }

    /**
     * Renders the dropdown, automatically pointing it towards the reference
     * node based on state from [[calculatePosition]].
     */
    protected renderDropdown(): JSX.Element {
        const { arrowDirection, arrowOffset, dropdownLeft, dropdownTop } = this.state;

        return (
            <Fade key="dropdown">
                <div
                    ref={ this.containerRef }
                    className={`dropdown ${ arrowDirection === DropdownArrowDirection.UP ? "up" : "down" }`}
                    role="presentation"
                    onClick={ this.preventClickPropagation }
                    style={{
                        top: `${ dropdownTop }px`,
                        left: `${ dropdownLeft }px`,
                    }}
                >
                    { this.props.children }

                    <div className="edge">
                        <div
                            className="arrow"
                            style={{ marginLeft: `${ (arrowOffset || 0) - 8 }px` }}
                        />
                    </div>
                </div>

                <div
                    className="backdrop"
                    role="presentation"
                    onClick={ this.onBackdropClick }
                />

                <style jsx>{`
                    .dropdown {
                        /** Prepare positioning of the dropdown */
                        position: absolute;
                        z-index: 1000;

                        /** Apply basic styling of the dropdown */
                        background: ${ colors.white };
                        box-shadow: 0 0 25px rgba(0, 0, 0, 0.15);

                        & .edge {
                            /**
                            * Prepare positioning of the edge layer.
                            */
                            position: absolute;
                            left: 0;
                            right: 0;

                            /**
                            * Set up basic sizing of the border that'll wrap the
                            * edge of the dropdown.
                            */
                            height: 3px;
                            background: ${ colors.primary };

                            & .arrow {
                                /**
                                * Position the arrow horizontally centered by
                                * default.
                                */
                                position: absolute;
                                left: 50%;

                                /** Reset size of the layer */
                                overflow: hidden;
                                width: 0;
                                height: 0;

                                /** Prepare rendering of the border */
                                border-left: 8px solid transparent;
                                border-right: 8px solid transparent;

                                /** Force rendering of element */
                                content: "";
                            }
                        }

                        &.up {
                            /** Position the edge on top */
                            padding-top: 3px;

                            & .edge {
                                top: 0;
                            }

                            /** Render the arrow pointing up */
                            & .arrow {
                                top: -8px;
                                border-bottom: 8px solid ${ colors.primary };
                            }
                        }

                        &.down {
                            /** Position the edge on bottom */
                            padding-bottom: 3px;

                            & .edge {
                                bottom: 0;
                            }

                            /** Render the arrow pointing down */
                            & .arrow {
                                bottom: -8px;
                                border-top: 8px solid ${ colors.primary };
                            }
                        }
                    }

                    .backdrop {
                        /** Overlap the entire viewport */
                        position: fixed;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        top: 0;
                        z-index: 999;

                        /** Disable cursor inheriting */
                        cursor: default;
                    }
                `}</style>
            </Fade>
        );
    }

    /**
     * Helper that'll prevent any click events inside the dropdown from ever
     * being propagated out to the parent layers.
     */
    protected preventClickPropagation = (evt: React.MouseEvent<HTMLDivElement>) => {
        evt.stopPropagation();
    }

    /**
     * Helper that should be triggered when the dropdown is being activated (ie.
     * when the "active" prop has just been set to true).
     */
    protected activateDropdown(): void {
        // Calculate initial position
        this.calculatePosition();

        // ... And bind an event listener to make sure that the position is
        // going to be updated when the user resizes the window
        window.addEventListener("resize", this.onResize);
    }

    /**
     * Helper that should be triggered when the dropdown is being deactivated
     * (ie. when the "active" prop has just been set to false).
     */
    protected deactivateDropdown(): void {
        // Reset state
        this.setState({
            arrowDirection: undefined,
            arrowOffset: undefined,
            dropdownLeft: undefined,
            dropdownTop: undefined,
        });

        // ... And unbind the resize event listener
        window.removeEventListener("resize", this.onResize);
    }

    /**
     * Helper that'll iterate over the
     */
    protected calculatePosition(force?: boolean): void {
        // Bail out if position has already been calculated
        if (!force) {
            if (this.state.dropdownLeft !== undefined && this.state.dropdownTop !== undefined) {
                return;
            }
        }

        // Bail out if the reference node isn't currently mounted
        if (!this.props.pointAt.current) {
            throw new Error("<Dropdown />.calculatePosition(): Unable to calculate position for unmounted pointAt ref!");
        }

        // Bail out if the node isn't currently mounted
        if (!this.containerRef.current) {
            return;
        }

        // And then calculate the position of the reference node and the parent
        // of the dropdown container
        const refPos = getAbsolutePosition(this.props.pointAt.current);
        const parentPos = getAbsolutePosition(this.containerRef.current.offsetParent as HTMLElement);

        // Now it's time to calculate the size of the reference node, which
        // we're going to be pointing towards, and the dropdown container itself
        const refSize = {
            width: this.props.pointAt.current.offsetWidth,
            height: this.props.pointAt.current.offsetHeight,
        };

        const dropdownSize = {
            width: this.containerRef.current.offsetWidth,
            height: this.containerRef.current.offsetHeight,
        };

        // Now find the closest scroll parent of the dropdown, so that we can
        // properly determine the available space
        const scrollParent = findScrollParent(this.containerRef.current.offsetParent as HTMLElement);
        const scrollParentPos = getAbsolutePosition(scrollParent);

        // ... Now we can determine if there's space available to render the
        // dropdown below the reference node (ie. if enough scrollable space
        // available below the reference node to include the dropdown and all
        // needed margins)?
        const arrowDirection = (
            // tslint:disable-next-line max-line-length
            scrollParent.scrollHeight > refPos.top - scrollParentPos.top + refSize.height + 30 + dropdownSize.height
                ? DropdownArrowDirection.UP
                : DropdownArrowDirection.DOWN
        );

        // Now we can calculate the position of the dropdown on the vertical
        // axis, based on the direction which it's going to be pointing
        const dropdownTop = (
            arrowDirection === DropdownArrowDirection.UP
                ? refPos.top - parentPos.top + refSize.height + 15
                : refPos.top - parentPos.top - dropdownSize.height - 15
        );

        // ... And we can then calculate the DESIRED position of the dropdown on
        // the horizontal axis (so that it's centered around the reference node)
        // - but that might not be possible due to required viewport margins
        const uncappedDropdownLeft = refPos.left - parentPos.left + refSize.width / 2 - dropdownSize.width / 2;

        // Now determine if we're going to need to cap position on the
        // horizontal axis
        let dropdownLeft = uncappedDropdownLeft;

        if (uncappedDropdownLeft + parentPos.left < 15) {
            dropdownLeft += 15 - (uncappedDropdownLeft + parentPos.left);
        }

        if (uncappedDropdownLeft + parentPos.left > window.innerWidth - dropdownSize.width - 15) {
            dropdownLeft -= (
                (uncappedDropdownLeft + parentPos.left) -
                (window.innerWidth - dropdownSize.width -  15)
            );
        }

        // Finally, determine if we've adjusted position on the x-axis (in which
        // case the rendered arrow will also need to be adjusted)
        const arrowOffset = uncappedDropdownLeft - dropdownLeft;

        // Now pdate state to render the dropdown at the correct position!
        this.setState({
            arrowDirection,
            arrowOffset,
            dropdownLeft,
            dropdownTop,
        });
    }

    /**
     * Listener that's triggered when the user clicks the backdrop of the layer,
     * making sure that the onClose callback is going to be triggered.
     */
    protected onBackdropClick = (evt: React.MouseEvent<HTMLDivElement>) => {
        this.props.onClose();
        evt.stopPropagation();
    }

    /**
     * Listener that'll be triggered when the user resizes the window, while the
     * dropdown is active, making sure that it's position is being recalculated.
     */
    protected onResize = (): void => {
        this.calculatePosition(true);
    }
}

/**
 * Helper that'll calculate the position of the given node, relativiely to the
 * viewport.
 */
// tslint:disable-next-line completed-docs
function getAbsolutePosition(node: HTMLElement): { top: number; left: number } {
    // Prepare position
    const position = {
        left: 0,
        top: 0,
    };

    // Iterate over offset parents, until we find the full position
    let currentNode = node;

    while (currentNode) {
        position.left += currentNode.offsetLeft;
        position.top += currentNode.offsetTop;

        // Continue to parent layer
        currentNode = currentNode.offsetParent as HTMLElement;
    }

    return position;
}

/**
 * Helper that'll find the closest possible scroll parent (ie. a layer that has
 * either overflow:auto or overflow:scroll applied)!
 */
function findScrollParent(node: Node): HTMLElement {
    let currentNode: Node | null = node;

    while (currentNode) {
        // Ignore anything but element nodes
        if (currentNode.nodeType !== currentNode.ELEMENT_NODE) {
            currentNode = currentNode.parentNode;
            continue;
        }

        // Determine if this node has an overflow scroll or auto applied to it
        // currently
        const overflow = window.getComputedStyle(currentNode as Element)
            .getPropertyValue("overflow-y")
            .toLowerCase();

        if (overflow === "auto" || overflow === "scroll") {
            return currentNode as HTMLElement;
        }

        // If we get here, then continue to parent
        currentNode = currentNode.parentNode;
    }

    // If we get here, no scroll parent was found - fall back to body
    return document.body;
}
