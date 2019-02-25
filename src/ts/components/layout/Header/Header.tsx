import React from "react";
import { getSVG } from "src/assets/svg";
import { colors } from "src/ts/config/colors";


/**
 * Header to be placed at the top of all pages
 */
export class Header extends React.PureComponent {

    /**
     * Main render method, used to render Header
     */
	public render(): JSX.Element {
		return (
			<div>

                <div className="header">
                    <i>
                        { getSVG("logo_full") }
                    </i>
                </div>

                <div className="phantom-header" />
				
				<style jsx>{`

                    .header {
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 60px;
                        position: fixed;
                        display: flex;
                        flex-direction: row;
                        border-bottom: 1px solid ${ colors.primaryColor }
                    }

                    .phantom-header {
                        width: 100%;
                        height: 60px;
                        background-color: ${ colors.white }
                    }

					i {
                        margin-left: 10px;
                        width: 200px;
                        height: 60px;
                    }
				`}</style>
			</div>
		);
	}
}
