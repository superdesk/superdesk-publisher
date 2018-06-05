import React from 'react';
import axios from 'axios';
import _ from 'lodash';
import classNames from 'classnames';
import {ToggleBox} from './components/ToggleBox.jsx';
import Tenant from './Tenant';
import NewDestination from './NewDestination';
import styles from './targetedPublishing.css';


export class TargetedPublishing extends React.Component {
    constructor(props) {
        super(props);
        const {item, session, config} = this.props;
        const pubConfig = config.publisher || {};
        const protocol = pubConfig.protocol || 'https';
        const subdomain = pubConfig.tenant ? `${pubConfig.tenant}.` : '';
        const domainName = pubConfig.domain;
        let filteredItem =  {
            language: item.language,
            body_html: item.body_html,
            byline: item.byline,
            keywords: item.keywords,
            "guid":"urn:newsml:localhost:2016-09-23T13:56:39.404843:56465de4-0d5c-495a-8e36-3b396def3cf0",
            priority: item.priority,
            urgency: item.urgency,
            headline: item.headline,
            description_html: item.abstract,
            pubstatus: item.pubstatus,
            authors: item.authors
          };



        // _(item).omitBy(_.isNil).omitBy(_.isEmpty).value();

        // filteredItem.guid = filteredItem._id;
        // // genre "fix"
        // filteredItem.genre.forEach(obj => {
        //     obj.code = obj.qcode;
        //     delete obj.qcode;
        // });
        // // subject "fix"
        // filteredItem.subject.forEach(obj => {
        //     obj.code = obj.qcode;
        //     delete obj.qcode;
        //     delete obj.parent;
        // });

        console.log(item);

        this.state = {
            config: config,
            session: session,
            item: filteredItem,
            apiUrl: `${protocol}://${subdomain}${domainName}/api/v1/`,
            apiHeader: null,
            sites: [],
            rules: [],
            addWebsiteOpen: false,
            newSite: {}
        };
    }

    authorize() {
        const _this = this;
        return axios.post(this.state.apiUrl + 'auth/superdesk/', {auth_superdesk: {session_id: this.state.session.sessionId, token: this.state.session.token}})
            .then((res) => {
                _this.setState({
                    apiHeader: {Authorization: 'Basic ' + res.data.token.api_key}
                });
                return res;
            });
    }

    evaluate() {
        return axios.post(this.state.apiUrl + 'organization/rules/evaluate',this.state.item, {headers: this.state.apiHeader})
            .then(res => {
                if (!_.isEmpty(res.data)) {
                    this.setState({
                        rules: res.data.tenants
                    });
                }
                return res;
            });
    }

    getSites() {
        return axios.get(this.state.apiUrl + 'tenants', {headers: this.state.apiHeader})
        .then(res => {
            this.setState({
                sites: res.data._embedded._items
            });
            return res;
        });
    }

    addDestinationHandler(site) {
        // close site selection "dropdown"
        this.addButtonHandler();
        this.setState({
            newSite: site
        });

    };

    addButtonHandler() {
        let addWebsiteOpen = !this.state.addWebsiteOpen;
        this.setState({
            addWebsiteOpen: addWebsiteOpen
        });
    }

    cancelNewDestinationHandler() {
        this.setState({
            newSite: {}
        });
    }

    reload() {
        this.cancelNewDestinationHandler();
        this.evaluate();
    }

    componentDidMount() {
        this.authorize()
            .then(() => {
                this.evaluate();
                this.getSites();
            });
    }



    render() {
        const siteRules = (
            <div>
                {!this.state.rules.length &&
                    <div className="sp-targetedPublshing__alert">
                        No websites have been set, this article won't show up on any website. It will go to: <br />
                        <span>Publisher > Output Control > Incoming list</span>
                    </div>
                }
                {this.state.rules.map((rule, index) => {
                    return (
                        <Tenant
                            rule={rule}
                            key={rule.tenant.code}
                            apiHeader={this.state.apiHeader}
                            config={this.props.config}
                            item={this.state.item}
                            done={this.reload.bind(this)}
                        />
                    )
                })}
            </div>
        );

        const remainingSites = [...this.state.sites];
        const rules = [...this.state.rules];
        let index = -1;

        rules.forEach(rule => {
            index = remainingSites.findIndex(site => rule.tenant.id === site.id);
            if (index => 0 ) {
                remainingSites.splice(index,1);
                index = -1;
            }
        });

        let addButton = null;

        if (remainingSites.length) {
            addButton = (
                <button className="navbtn dropdown sd-create-btn" onClick={this.addButtonHandler.bind(this)}>
                    <i className="icon-plus-large"></i>
                    <span className="circle"></span>
                </button>
            );
        }

        const addWebsite = (
            <div className={classNames('sp-targetedPublshing__addWebsiteDropdown', { 'sp-targetedPublshing__addWebsiteDropdown--open sd-shadow--z2': this.state.addWebsiteOpen })} >
                <div className="sp-targetedPublshing__addWebsiteDropdown__inner">
                    <h3>Add Website</h3>
                    <ul>
                        { remainingSites.map(site => {
                            let siteDomain = site.subdomain ? site.subdomain + '.' + site.domainName : site.domainName;

                            return (
                                <li key={site.id} onClick={() => this.addDestinationHandler(site)}>{siteDomain}</li>
                            )
                        })
                        }
                    </ul>
                </div>
            </div>
        );

        let newRuleForm = null;

        if (this.state.newSite.id) {
            newRuleForm = (
                 <NewDestination
                    key={this.state.newSite.id}
                    site={this.state.newSite}
                    apiHeader={this.state.apiHeader}
                    config={this.props.config}
                    item={this.state.item}
                    cancel={this.cancelNewDestinationHandler.bind(this)}
                    done={this.reload.bind(this)}
                />
            );
        }


        return (
            <ToggleBox title="Web publishing" style="toggle-box--dark sp--dark-ui" isOpen={true}>
                {siteRules}
                {addButton}
                {addWebsite}
                {newRuleForm}
            </ToggleBox>
          );
    }
}
