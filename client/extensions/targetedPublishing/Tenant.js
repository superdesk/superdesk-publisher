import React, {Component} from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import axios from 'axios';
import Checkbox from '../helperComponents/Checkbox.jsx';
import ContentLists from './ContentLists';

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
        newRule.isPublishedFbia = e.target.value;
        this.setState({newRule});
    }

    paywallSecuredCheckboxHandler(e) {
        const newRule = {...this.state.newRule};
        newRule.paywallSecured = e.target.value;
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
        newRule.contentLists = data;
        this.setState({newRule: newRule});
    }

    addContentList = () => {
        let newRule = {...this.state.newRule};

        if (!newRule.contentLists) newRule.contentLists = [];
        newRule.contentLists.push({id: '', position: 0});

        this.setState({newRule});
    }

    removeContentList = (index) => {
        let newRule = {...this.state.newRule};
        newRule.contentLists.splice(index, 1);
        this.setState({newRule});
    }

    saveHandler() {
        const destination = {
            "publish_destination":{
                "tenant": this.state.newRule.tenant.code,
                "route": this.state.newRule.route ? this.state.newRule.route.id : null ,
                "isPublishedFbia": this.state.newRule.isPublishedFbia,
                "published": this.state.newRule.published,
                "paywallSecured": this.state.newRule.paywallSecured,
                "packageGuid": this.state.item.guid,
                "contentLists": this.state.newRule.contentLists ? this.state.newRule.contentLists : null
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
        const {newRule} = this.state;
        let siteDomain = newRule.tenant.subdomain ? newRule.tenant.subdomain + '.' + newRule.tenant.domainName : newRule.tenant.domainName;
        let publishRoute = null;

        if (newRule.tenant.outputChannel) {
            publishRoute = newRule.tenant.outputChannel.type;
        } else {
            publishRoute = newRule.isPublishedFbia ? newRule.route.name + ', Facebook' : newRule.route.name;
        }

        let contentListsNames = '';

        if (newRule.contentLists && newRule.contentLists.length) {
            newRule.contentLists.forEach(list => {
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

        let routesSelect = null;
        if (!newRule.tenant.outputChannel) {
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

        const paywalSecuredStyle = {
            marginLeft: '2em'
        };

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
                    <div className="form__row">
                        <span sd-tooltip="Publish to facebook">
                            <Checkbox label="Facebook" value={newRule.isPublishedFbia} onChange={this.fbiaCheckboxHandler.bind(this)}/>
                        </span>
                        <span style={paywalSecuredStyle}>
                            <Checkbox label="Paywall Secured" value={newRule.paywallSecured} onChange={this.paywallSecuredCheckboxHandler.bind(this)}/>
                        </span>
                    </div>
                    <div className="form__row">
                        <Checkbox label="Do not publish" value={!newRule.published} onChange={this.publishedCheckboxHandler.bind(this)}/>
                    </div>
                    {this.state.contentLists.length ?
                        <ContentLists
                            ruleLists={newRule.contentLists ? newRule.contentLists : []}
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
