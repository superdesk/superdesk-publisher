import React, {Component} from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import axios from 'axios';
import Checkbox from '../UI/Checkbox.jsx';
import ContentLists from './ContentLists.jsx';

export default class Tenant extends Component {
    constructor(props) {
        super(props);
        const {rule, config, apiHeader, item} = this.props;
        const protocol = config.publisher.protocol || 'https';
        const subdomain = rule.tenant.subdomain ? `${rule.tenant.subdomain}.` : '';
        const domainName = rule.tenant.domain_name;

        this.state = {
            isOpen: false,
            routes: [],
            contentLists: [],
            rule: JSON.parse(JSON.stringify(rule)),
            newRule: JSON.parse(JSON.stringify(rule)),
            item: item,
            previewUrl: null,
            apiHeader: apiHeader,
            apiUrl: `${protocol}://${subdomain}${domainName}/api/v1/`
        };
    }

    componentDidMount() {
        this.getRoutes();
        this.getContentLists();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.rule) {
            const rule = nextProps.rule;
            this.setState({
                rule: JSON.parse(JSON.stringify(rule)),
                newRule: JSON.parse(JSON.stringify(rule))
            });
        }
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

    getContentLists() {
        return axios.get(this.state.apiUrl + 'content/lists/', {headers: this.state.apiHeader, params: {limit: 1000}})
            .then(res => {
                let manualLists = res.data._embedded._items.filter(el => el.type === 'manual');

                this.setState({
                    contentLists: manualLists
                });
                return res;
            });
    }

    setPreview() {
        if (!this.state.newRule.route)
            return false;

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
        const newRule = {...this.state.newRule};
        newRule.is_published_fbia = e.target.value;
        this.setState({newRule});
    }

    paywallSecuredCheckboxHandler(e) {
        const newRule = {...this.state.newRule};
        newRule.paywall_secured = e.target.value;
        this.setState({newRule});
    }

    publishedCheckboxHandler(e) {
        const newRule = {...this.state.newRule};
        newRule.published = !newRule.published;
        this.setState({newRule});
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

    saveContentListsHandler = (data) => {
        let newRule = {...this.state.newRule};
        newRule.content_lists = data;
        this.setState({newRule: newRule});
    }

    addContentList = () => {
        let newRule = {...this.state.newRule};

        if (!newRule.content_lists) newRule.content_lists = [];
        newRule.content_lists.push({id: '', position: 0});

        this.setState({newRule});
    }

    removeContentList = (index) => {
        let newRule = {...this.state.newRule};
        newRule.content_lists.splice(index, 1);
        this.setState({newRule});
    }

    saveHandler() {
        const destination = {
            "tenant": this.state.newRule.tenant.code,
            "route": this.state.newRule.route ? this.state.newRule.route.id : null ,
            "is_published_fbia": this.state.newRule.is_published_fbia,
            "published": this.state.newRule.published,
            "paywall_secured": this.state.newRule.paywall_secured,
            "package_guid": this.state.item.evolvedfrom ? this.state.item.evolvedfrom : this.state.item.guid,
            "content_lists": this.state.newRule.content_lists ? this.state.newRule.content_lists : []
        };

        return axios.post(this.state.apiUrl + 'organization/destinations/', destination, {headers: this.state.apiHeader})
            .then(res => {
                this.openHandler();
                this.props.done();
                return res;
            });
    }

    render() {
        const {newRule} = this.state;
        let siteDomain = newRule.tenant.subdomain ? newRule.tenant.subdomain + '.' + newRule.tenant.domain_name : newRule.tenant.domain_name;
        let publishRoute = null;

        if (newRule.tenant.output_channel) {
            publishRoute = newRule.tenant.output_channel.type;
        } else {
            publishRoute = newRule.is_published_fbia ? newRule.route.name + ', Facebook' : newRule.route.name;
        }

        let contentListsNames = '';

        if (newRule.content_lists && newRule.content_lists.length) {
            newRule.content_lists.forEach(list => {
                let list = this.state.contentLists.find(el => el.id === list.id);
                if (list) contentListsNames += contentListsNames ? ', ' + list.name : list.name;
            });
        }

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
                        {contentListsNames && newRule.published &&
                            <div className="sd-list-item__row">
                                <span className="sd-list-item__text-label">Content lists:</span><span className="sd-overflow-ellipsis">{contentListsNames}</span>
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

        let paywalSecuredStyle = {};

        if (newRule.tenant.paywall_enabled && newRule.tenant.fbia_enabled) {
            paywalSecuredStyle = {marginLeft: '2em'};
        }

        let optionsSwitches = null;
        if(newRule.tenant.paywall_enabled || newRule.tenant.fbia_enabled) {
            optionsSwitches = (
                <div className="form__row">
                    {newRule.tenant.fbia_enabled ? (
                        <span sd-tooltip="Publish to facebook">
                            <Checkbox label="Facebook" value={newRule.is_published_fbia} onChange={this.fbiaCheckboxHandler.bind(this)}/>
                        </span>
                    ) : null}

                    {newRule.tenant.paywall_enabled ? (
                        <span style={paywalSecuredStyle}>
                            <Checkbox label="Paywall Secured" value={newRule.paywall_secured} onChange={this.paywallSecuredCheckboxHandler.bind(this)}/>
                        </span>
                    ) : null}
                </div>
            );
        }

        let routesSelect = null;
        if (!newRule.tenant.output_channel) {
            routesSelect = (
                <div className="sd-line-input sd-line-input--is-select sd-line-input--dark-ui sd-line-input--no-margin">
                    <label className="sd-line-input__label">Route</label>
                    <select className="sd-line-input__select" value={this.state.newRule.route.id} onChange={this.routeChangeHandler.bind(this)}>
                        {this.state.routes.map((route, index) => {
                            return <option value={route.id} key={route.id}>{route.name}</option>
                        })}
                    </select>
                </div>
            );
        }

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
                                    <span className="sd-list-item__text-label sd-overflow-ellipsis">Automatically:</span><span className="sd-overflow-ellipsis">{publishRoute}</span>
                                </div>
                                {contentListsNames ? (
                                    <div className="sd-list-item__row">
                                        <span className="sd-list-item__text-label">Content lists:</span><span className="sd-overflow-ellipsis">{contentListsNames}</span>
                                    </div>
                                ) : null}

                            </div>
                        </div>
                    </div>
                    <div className="form__row">
                        {routesSelect}
                    </div>
                    {optionsSwitches}
                    <div className="form__row">
                        <Checkbox label="Do not publish" value={!newRule.published} onChange={this.publishedCheckboxHandler.bind(this)}/>
                    </div>
                    {this.state.contentLists.length ?
                        <ContentLists
                            ruleLists={newRule.content_lists ? newRule.content_lists : []}
                            contentLists={this.state.contentLists}
                            save={this.saveContentListsHandler}
                            addList={this.addContentList}
                            removeList={this.removeContentList}
                        />
                    : null}
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
