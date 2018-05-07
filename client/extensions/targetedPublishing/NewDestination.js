import React, {Component} from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import axios from 'axios';
import Checkbox from './components/Checkbox.jsx';


export default class NewDestination extends Component {
    constructor(props) {
        super(props);
        const {site, config, apiHeader, item} = this.props;
        const protocol = config.publisher.protocol || 'https';
        const subdomain = site.subdomain ? `${site.subdomain}.` : '';
        const domainName = site.domainName;

        const destination = {
            "tenant": site.code,
            "route": undefined,
            "fbia": false,
            "published": true,
            "packageGuid": item.guid
        };

        this.state = {
            item: item,
            site: site,
            destination: destination,
            routes: [],
            previewUrl: null,
            apiHeader: apiHeader,
            apiUrl: `${protocol}://${subdomain}${domainName}/api/v1/`
        };
    }

    componentDidMount() {
        this.getRoutes();
    }

    setPreview() {
        return axios.post(this.state.apiUrl + 'preview/package/generate_token/' + this.state.destination.route, this.state.item, {headers: this.state.apiHeader})
            .then(res => {
                this.setState({
                    previewUrl: res.data.preview_url
                });
                return res;
            });
    }

    getRoutes() {
        return axios.get(this.state.apiUrl + 'content/routes', {headers: this.state.apiHeader, params: {limit: 1000, type: 'collection'}})
            .then(res => {
                this.setState({
                    routes: res.data._embedded._items
                });
                return res;
            });
    }

    fbiaCheckboxHandler(e) {
        const dest = {...this.state.destination};
        dest.fbia = e.target.value;
        this.setState({
            destination: dest
        });
    }

    cancelHandler() {
        this.props.cancel();
    }

    routeChangeHandler(evt) {
        const routeId = parseInt(evt.target.value);
        const dest = {...this.state.destination};

        dest.route = routeId;
        this.setState(
            {
                destination: dest,
                previewUrl: null
            },
            this.setPreview
        );

    }

    saveHandler() {
        const destination = {
            "publish_destination": this.state.destination
        };

        return axios.post(this.state.apiUrl + 'organization/destinations/', destination, {headers: this.state.apiHeader})
            .then(res => {
                this.props.done();
                return res;
            });
    }

    render() {
        let siteDomain = this.state.site.subdomain ? this.state.site.subdomain + '.' + this.state.site.domainName : this.state.site.domainName;

        const destination = {...this.state.destination};
        const saveBar = (
            <div className="sd-collapse-box__sliding-toolbar-wrapper">
                <div className="sd-collapse-box__sliding-toolbar">
                    <div className="sliding-toolbar__inner"></div>
                    <a className="btn btn--hollow btn--ui-dark" onClick={this.cancelHandler.bind(this)}>Cancel</a>
                    <button className={classNames('btn btn--primary', { 'btn--disabled': !this.state.destination.route })} onClick={this.saveHandler.bind(this)} disabled={!this.state.destination.route} >Save</button>
                </div>
            </div>
        );

        const routesSelect = (
            <select className="sd-line-input__select" value={this.state.destination.route} onChange={this.routeChangeHandler.bind(this)}>
                {this.state.routes.map((route, index) => {
                    return <option value={route.id} key={route.id}>{route.name}</option>
                })}
            </select>
        );

        let preview = <a className="icn-btn" sd-tooltip="Preview" flow="left" target="_blank"></a>;

        if (this.state.previewUrl) {
            preview = <a href={this.state.previewUrl} target="_blank" className="icn-btn" sd-tooltip="Preview" flow="left"><i className="icon-external"></i></a>;
        }

        const newDestinationForm = (
             <div className="sd-collapse-box__content-wraper">
                <div className="sd-collapse-box__content">
                    {saveBar}
                    <div className="sd-collapse-box__content-block sd-collapse-box__content-block--top">
                        <div className="sd-list-item sd-list-item--no-bg sd-list-item--no-hover">
                            <div className="sd-list-item__column sd-list-item__column--grow sd-list-item__column--no-border">
                                <div className="sd-list-item__row">
                                    <span className="sd-overflow-ellipsis sd-list-item--element-grow sd-list-item__text-strong">{siteDomain}</span>
                                    {preview}
                                </div>
                                <div className="sd-list-item__row">
                                    <span className="sd-list-item__text-label sd-overflow-ellipsis">Manual</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="form__row">
                        <div className="sd-line-input sd-line-input--is-select sd-line-input--dark-ui sd-line-input--no-margin">
                            <label className="sd-line-input__label">Route</label>
                            {routesSelect}
                        </div>
                    </div>
                    <div className="form__row" ng-init="contentChanged0 = true">
                        <Checkbox label="Publish to facebook" value={this.state.destination.fbia} onChange={this.fbiaCheckboxHandler.bind(this)}/>
                    </div>
                </div>
            </div>
        );

        return (
            <div className="sd-collapse-box sd-shadow--z2 sd-collapse-box--open">
                {newDestinationForm}
            </div>
        );
    }
};


