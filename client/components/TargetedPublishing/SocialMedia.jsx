import React, {Component} from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

import {ToggleBox} from '../UI/ToggleBox';
import ButtonListItem from '../UI/ButtonListItem';
import SocialMediaOverlay from './SocialMediaOverlay';

class SocialMedia extends Component {
    constructor(props) {
        super(props);

        this.state = {
            overlayOpen: false,
            overlayType: ''
        };
    }

    toggleOverlay = type => {
        this.setState({
            overlayOpen: !this.state.overlayOpen,
            overlayType: type
        });
    }

    render() {
        return (
            <React.Fragment>
                <ToggleBox title="Social media" style="toggle-box--dark sp--dark-ui toggle-box--circle" isOpen={true}>
                    <div className="sd-list-item-group sd-shadow--z1">
                        <ButtonListItem onClick={() => this.toggleOverlay('facebook')} label="Facebook"/>
                        <ButtonListItem onClick={() => this.toggleOverlay('twitter')} label="Twitter"/>
                        <ButtonListItem onClick={() => this.toggleOverlay('seo')} label="SEO"/>
                    </div>
                </ToggleBox>
                <SocialMediaOverlay open={this.state.overlayOpen} />
            </React.Fragment>
        )
    }

}

SocialMedia.propTypes = {

};


export default SocialMedia;
