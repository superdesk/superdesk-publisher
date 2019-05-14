import React, {Component} from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

class SocialMediaOverlay extends Component {
    constructor(props) {
        super(props);

        this.state = {
            routes: [],
            loading: true
        };
    }

    render() {
        return (
            <div className={classNames('side-panel__content-block-overlay',{'side-panel__content-block-overlay--open': this.props.open })}>
                <div className="side-panel">
                    <div className="side-panel__header">
                        <a className="icn-btn sd-margin-l--1" ng-click="$root.overlayPaneOpen = !$root.overlayPaneOpen" sd-tooltip="Back" flow="right"><i className="icon-arrow-left"></i></a>
                        <h3 className="side-panel__heading side-panel__heading--big">Facebook</h3>
                    </div>
                    <div className="side-panel__content">
                        <div className="side-panel__content-block">
                            <div className="form__row">
                                <div className="sd-line-input">
                                    <label className="sd-line-input__label">Post image</label>
                                    <div className="sd-overlay-block">
                                        <div className="sd-overlay-block__overlay">
                                            <div className="sd-overlay-block__overlay-action-group">
                                                <a className="sd-overlay-block__overlay-action" sd-tooltip="Upload image"><i className="icon-upload"></i></a>
                                            </div>
                                        </div>
                                        <img src="../examples/img/overlay-img.jpg" />
                                    </div>
                                </div>
                            </div>
                            <div className="form__row">
                                <div className="sd-line-input sd-line-input--required sd-line-input--dark-ui sd-line-input--boxed">
                                    <label className="sd-line-input__label">Headline</label>
                                    <input className="sd-line-input__input" type="text" value="Article headline here." />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

SocialMediaOverlay.propTypes = {

};


export default SocialMediaOverlay;
