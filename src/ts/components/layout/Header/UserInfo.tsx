import React from "react";
import { TransitionGroup } from "react-transition-group";
import { getSVG } from 'src/assets/svg';
import { colors } from 'src/ts/config';
import { injectStore } from 'src/ts/store/injectStore';
import { Chevron } from '../../utils';
import { Dropdown } from '../../utils/Dropdown/Dropdown';


/**
 * Specification of props required to render <UserInfo />.
 */
type UserInfoProps = {
    /**
     * A reference to the user model describing the currently signed in user.
     */
    user: UserModel;
};

/**
 * Specification of lifecycle state of <UserInfo />.
 */
type UserInfoState = {
    /**
     * Specifies if the profile dropdown should currently be shown.
     */
    showDropdown?: boolean;
};

/**
 * Component responsible for rendering information related to information about
 * the user
 */
export class UserInfoUnwrapped extends React.PureComponent<UserInfoProps, UserInfoState> {
    /**
     * Set up initial state, so this.state can be safely accessed.
     */
    public readonly state: UserInfoState = {};

    /**
     * Will contain a reference to the user name wrapper, so that we can make
     * the dropdown point towards it properly.
     */
    protected readonly wrapperRef: React.RefObject<HTMLDivElement> = React.createRef();

    /**
     * Primary render method.
     */
    public render(): JSX.Element | undefined {
        // Bail out if no user was available
        if (!this.props.user) {
            return undefined;
        }

        return (
            <div
                className={`${ this.state.showDropdown ? "active" : "" }`}
                ref={ this.wrapperRef }
                onClick={ this.onUsernameClick }
                role="button"
            >
                <i className="icon">{ getSVG("user") }</i>
                <span className="chevron">
                    <Chevron
                        vertical
                        size={ 10 }
                        inverseDuration={ 200 }
                        inversed={ this.state.showDropdown }
                    />
                </span>

                { this.renderDropdown() }

                <style jsx>{`
                    div {
                        /** Indicate that the element is clickable */
                        cursor: pointer;

                        /** Apply default color */
                        & .icon > :global(.svgIcon) > :global(svg) > :global(path) {
                            fill: blue;
                        }

                        & .chevron {
                            border-color: blue;
                        }

                        /** Apply hover colors */
                        &:hover .icon > :global(.svgIcon) > :global(svg) > :global(path),
                        &.active .icon > :global(.svgIcon > svg > path) {
                            fill: ${ colors.primary };
                        }

                        &:hover .chevron,
                        &.active .chevron {
                            border-color: ${ colors.primary };
                        }
                    }

                    .icon {
                        /** Set up sizing of the icon */
                        display: inline-block;
                        height: 30px;
                        width: 32px;
                    }

                    .chevron {
                        /**
                         * Ensure that the wrapper is position to the right
                         * of the button and that the chevron will be contained
                         * within
                         */
                        position: relative;
                        display: inline-block;

                        /** Render chevron properly */
                        width: 14px;
                        height: 30px;
                        border-color: #8f8f8f;

                        /** Setup space between chevron and text */
                        margin-left: 10px;
                    }
                `}</style>
            </div>
        );
    }

    /**
     * Renders the dropdown that'll become visible when the user clicks his own
     * profile name.
     */
    protected renderDropdown(): JSX.Element {
        return (
            <Dropdown
                active={ this.state.showDropdown }
                pointAt={ this.wrapperRef }
                onClose={ this.onDropdownClose }
            >
                <div className="wrapper">
                    { this.renderUserData() }

                    <button onClick={ this.signOut } role="button">
                        <i>{ getSVG("signIn") }</i>

                        Log out
                    </button>
                </div>

                <style jsx>{`
                    .wrapper {
                        /** Apply internal padding */
                        padding: 20px 0;

                        /** By default element isn't clickable */
                        cursor: default;
                    }

                    a {
                        /** Center items within vertically */
                        display: flex;
                        align-items: center;

                        /**
                         * Set up basic padding around the element (the 6px top
                         * padding is applied to take into account that the icon
                         * will push text further down, and we want the white-
                         * space to visually align with the text instead of the
                         * icon).
                         */
                        padding: 10px 20px;
                        margin: -10px 0;

                        /** Prevent line-breaks within the label */
                        white-space: nowrap;

                        /** Set up text styling */
                        color: ${ colors.black };
                        line-height: 1em;
                        text-decoration: none;

                        /** Prepare hover transition */
                        transition:
                            background-color 0.1s linear,
                            color 0.1s linear;

                        & i {
                            /** Set up icon sizing */
                            display: inline-block;
                            width: 16px;
                            height: 20px;

                            /** Apply margin between icon and text */
                            margin-right: 10px;

                            & > :global(.svgIcon) > :global(svg) > :global(path) {
                                /** Apply default font color */
                                fill: ${ colors.black };
                            }
                        }

                        /** Apply highlight color on hover */
                        &:hover {
                            background-color: red;
                            color: ${ colors.primary };

                            & i > :global(.svgIcon) > :global(svg) > :global(path) {
                                fill: ${ colors.primary };
                            }
                        }
                    }
                `}</style>
            </Dropdown>
        );
    }

    /**
     * Renderer that'll inject data about the currently signed in user, so that
     * it's available in the dropdown.
     */
    protected renderUserData(): JSX.Element {
        const { user } = this.props;

        return (
            <div className="user">
                <b>{ user.name }</b><br />

                { this.renderUserType() }

                <style jsx>{`
                    .user {
                        /** Apply required margins */
                        padding: 0 20px calc(20px - 0.15em);
                        margin: -0.15em 0 20px;

                        /** Add separator */
                        border-bottom: 1px solid #ccc;

                        /** Adjust line-height */
                        line-height: 1.3em;

                        /** Disable text-selection */
                        user-select: none;
                    }
                `}</style>
            </div>
        );
    }

    /**
     * Renderer that'll inject the user's type into the DOM (this is used, if we
     * were unable to identify the user's institution assoication).
     */
    protected renderUserType(): JSX.Element {
        // ... Otherwise return label based on user type
        switch (this.props.user.userType) {
            case PRODUCER:
                return "Producer";

            default:
                return "Reciever";
        }
    }

    /**
     * Listener that's triggered when the user clicks the user info component,
     * and prompts opening of the dropdown.
     */
    protected onUsernameClick = () => {
        this.setState({ showDropdown: true });
    }

    /**
     * Listener that's triggered when the user somehow prompts for the user
     * dropdown to be closed.
     */
    protected onDropdownClose = () => {
        this.setState({ showDropdown: false });
    }
}

// tslint:disable-next-line variable-name
export const UserInfo = injectStore((store) => ({ user: store.user }), UserInfoUnwrapped);
