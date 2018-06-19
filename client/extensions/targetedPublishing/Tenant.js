import React, {Component} from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import axios from 'axios';
import Checkbox from './components/Checkbox.jsx';

export default class Tenant extends Component {
    constructor(props) {
        super(props);
        const {rule, config, apiHeader, item} = this.props;
        const protocol = config.publisher.protocol || 'https';
        const subdomain = rule.tenant.subdomain ? `${rule.tenant.subdomain}.` : '';
        const domainName = rule.tenant.domainName;

        this.state = {
            isOpen: false,
            routes: [],
            rule: rule,
            newRule: rule,
            item: item,
            previewUrl: null,
            apiHeader: apiHeader,
            apiUrl: `${protocol}://${subdomain}${domainName}/api/v1/`
        };
    }

    componentDidMount() {
        this.getRoutes();
    }

    getRoutes() {
        return axios.get(this.state.apiUrl + 'content/routes/', {headers: this.state.apiHeader, params: {limit: 1000, type: 'collection'}})
            .then(res => {
                this.setState({
                    routes: res.data._embedded._items
                });
                return res;
            });
    }

    setPreview() {
        return axios.post(this.state.apiUrl + 'preview/package/generate_token/' + this.state.newRule.route.id, this.state.item, {headers: this.state.apiHeader})
            .then(res => {
                this.setState({
                    previewUrl: res.data.preview_url
                });
                return res;
            });
    }

    openHandler() {
        let isOpen = this.state.isOpen;
        isOpen = !isOpen;
        this.setState({
            isOpen: isOpen
        });
        if (isOpen) this.setPreview();
    }

    fbiaCheckboxHandler(e) {
        const rule = {...this.state.newRule};
        rule.fbia = e.target.value;
        this.setState({
            newRule: rule
        });
    }

    publishedCheckboxHandler(e) {
        const rule = {...this.state.newRule};
        rule.published = !rule.published;
        this.setState({
            newRule: rule
        });
    }

    cancelHandler() {
        const rule = {...this.state.rule};
        this.setState({
            newRule: rule
        });
        this.openHandler();
    }

    routeChangeHandler(evt) {
        const routeId = parseInt(evt.target.value);
        let newRule = {...this.state.newRule};
        let newRoute = _.find(this.state.routes, route => {
                return route.id === routeId;
            });

        newRule.route = newRoute;
        this.setState(
            {
                newRule: newRule,
                previewUrl: null
            },
            this.setPreview
        );

    }

    saveHandler() {
        const destination = {
            "publish_destination":{
                "tenant": this.state.newRule.tenant.code,
                "route": this.state.newRule.route.id,
                "fbia": this.state.newRule.fbia,
                "published": this.state.newRule.published,
                "packageGuid": this.state.item.guid
            }
        };

        return axios.post(this.state.apiUrl + 'organization/destinations/', destination, {headers: this.state.apiHeader})
            .then(res => {
                this.openHandler();
                this.props.done();
                return res;
            });
    }

    render() {
        const newRule = this.state.newRule;
        let siteDomain = newRule.tenant.subdomain ? newRule.tenant.subdomain + '.' + newRule.tenant.domainName : newRule.tenant.domainName;
        let publishRoute = newRule.fbia ? newRule.route.name + ', Facebook' : newRule.route.name;


        const header = (
            <div className="sd-collapse-box__header" onClick={this.openHandler.bind(this)}>
                <div className="sd-list-item">
                    <div className="sd-list-item__border"></div>
                    <div className="sd-list-item__column sd-list-item__column--grow sd-list-item__column--no-border">
                        <div className="sd-list-item__row">
                            <span className="sd-overflow-ellipsis sd-list-item--element-grow">
                                <span className="sd-list-item__text-strong">{siteDomain}</span>
                            </span>
                        </div>
                        {!newRule.published &&
                            <div className="sd-list-item__row">
                                <span className="label label--alert">Do not publish</span>
                            </div>
                        }
                        {newRule.published &&
                            <div className="sd-list-item__row">
                                <span className="sd-list-item__text-label">Publish to:</span>
                                <span className="sd-overflow-ellipsis">{publishRoute}</span>
                            </div>
                        }
                    </div>
                </div>

            </div>
        );

        let saveBar = null;
        if (!_.isEqual(this.state.rule, this.state.newRule)){
            saveBar = (
                <div className="sd-collapse-box__sliding-toolbar-wrapper">
                    <div className="sd-collapse-box__sliding-toolbar">
                        <div className="sliding-toolbar__inner"></div>
                        <a className="btn btn--hollow btn--ui-dark" onClick={this.cancelHandler.bind(this)}>Cancel</a>
                        <a className="btn btn--primary" onClick={this.saveHandler.bind(this)}>Save</a>
                    </div>
                </div>
            );
        }

        let routesSelect = (
            <select className="sd-line-input__select" value={this.state.newRule.route.id} onChange={this.routeChangeHandler.bind(this)}>
                {this.state.routes.map((route, index) => {
                    return <option value={route.id} key={route.id}>{route.name}</option>
                })}
            </select>
        );

        let preview = <a className="icn-btn" sd-tooltip="Preview" flow="left" target="_blank"></a>;

        if (this.state.previewUrl) {
            preview = <a href={this.state.previewUrl} className="icn-btn" sd-tooltip="Preview" flow="left" target="_blank"><i className="icon-external"></i></a>;
        }

        const content = (
            <div className="sd-collapse-box__content-wraper">
                <div className="sd-collapse-box__content">
                    {saveBar}
                    <div className="sd-collapse-box__tools sd-collapse-box__tools--flex">
                        <a className="sd-collapse-box__collapse-btn" onClick={this.openHandler.bind(this)}>
                            <span className="icn-btn"><i className="icon-chevron-up-thin"></i></span>
                        </a>
                    </div>
                    <div className="sd-collapse-box__content-block sd-collapse-box__content-block--top">
                        <div className="sd-list-item sd-list-item--no-bg sd-list-item--no-hover">
                            <div className="sd-list-item__column sd-list-item__column--grow sd-list-item__column--no-border">
                                <div className="sd-list-item__row">
                                    <span className="sd-overflow-ellipsis sd-list-item--element-grow sd-list-item__text-strong">{siteDomain}</span>
                                    {preview}
                                </div>
                                <div className="sd-list-item__row">
                                    <span className="sd-list-item__text-label sd-overflow-ellipsis">Automatically:</span><span className="sd-overflow-ellipsis">{this.state.rule.route.name}</span>
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
                        <Checkbox label="Publish to facebook" value={newRule.fbia} onChange={this.fbiaCheckboxHandler.bind(this)}/>
                    </div>
                    <div className="form__row">
                        <Checkbox label="Do not publish" value={!newRule.published} onChange={this.publishedCheckboxHandler.bind(this)}/>
                    </div>
            </div>
        </div>
        );

        return (
            <div className={classNames('sd-collapse-box sd-shadow--z2', { 'sd-collapse-box--open': this.state.isOpen })}>
            {header}
            {content}
            </div>
        );
    }
};
