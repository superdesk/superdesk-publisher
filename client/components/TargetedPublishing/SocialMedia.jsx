import React, {Component} from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

import {ToggleBox} from '../UI/ToggleBox';

class SocialMedia extends Component {
    constructor(props) {
        super(props);

        this.state = {
            routes: [],
            loading: true
        };
    }

    render() {
        return (
            <ToggleBox title="Social media" style="toggle-box--dark sp--dark-ui toggle-box--circle" isOpen={true}>
                <div className="sd-list-item-group sd-shadow--z1">
                    <div className="sd-list-item" ng-click="$root.overlayPaneOpen = !$root.overlayPaneOpen">
                        <div className="sd-list-item__border"></div>
                        <div className="sd-list-item__column sd-list-item__column--grow sd-list-item__column--no-border">
                            <div className="sd-list-item__row">
                                <span className="sd-overflow-ellipsis">Facebook</span>
                            </div>
                        </div>
                        <div className="sd-list-item__action-menu">
                            <i className="icon-chevron-right-thin"></i>
                        </div>
                    </div>
                    <div className="sd-list-item" ng-click="$root.overlayPaneOpen = !$root.overlayPaneOpen">
                        <div className="sd-list-item__border"></div>
                        <div className="sd-list-item__column sd-list-item__column--grow sd-list-item__column--no-border">
                            <div className="sd-list-item__row">
                                <span className="sd-overflow-ellipsis">Twitter</span>
                            </div>
                        </div>
                        <div className="sd-list-item__action-menu">
                            <i className="icon-chevron-right-thin"></i>
                        </div>
                    </div>

                    <div className="sd-list-item" ng-click="$root.overlayPaneOpen = !$root.overlayPaneOpen">
                        <div className="sd-list-item__border"></div>
                        <div className="sd-list-item__column sd-list-item__column--grow sd-list-item__column--no-border">
                            <div className="sd-list-item__row">
                                <span className="sd-overflow-ellipsis">SEO / Meta Tags</span>
                            </div>
                        </div>
                        <div className="sd-list-item__action-menu">
                            <i className="icon-chevron-right-thin"></i>
                        </div>
                    </div>
                </div>
            </ToggleBox>
        )
    }

}

SocialMedia.propTypes = {

};


export default SocialMedia;
