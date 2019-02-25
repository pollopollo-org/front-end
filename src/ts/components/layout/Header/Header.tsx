import React from "react";
import { getSVG } from 'src/assets/svg';
import { colors } from 'src/ts/config/colors';



export class Header extends React.PureComponent {
	public render(): JSX.Element {
		return (
			<div>

                <div className="header">
                    <i>
                        { getSVG("logo_full") }
                    </i>
                </div>
				
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
					i {
                        width: 200px;
                        height: 60px;
                    }
				`}</style>
			</div>
		);
	}
}
