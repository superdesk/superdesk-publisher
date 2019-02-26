import React from 'react';
import axios from 'axios';
import _ from 'lodash';
import classNames from 'classnames';
import {ToggleBox} from './components/ToggleBox.jsx';
import Tenant from './Tenant';
import NewDestination from './NewDestination';
import Loading from './components/Loading.jsx';

export class TargetedPublishing extends React.Component {
    constructor(props) {
        super(props);
        const {item, session, config} = this.props;
        const pubConfig = config.publisher || {};
        const protocol = pubConfig.protocol || 'https';
        const subdomain = pubConfig.tenant ? `${pubConfig.tenant}.` : '';
        const domainName = pubConfig.domain;

        let service = item.anpa_category.map( item => {
            return {
                name: item.name,
                code: item.qcode
            };
        });

        this.state = {
            config: config,
            session: session,
            item: null,
            apiUrl: `${protocol}://${subdomain}${domainName}/api/v1/`,
            apiHeader: null,
            sites: [],
            rules: [],
            addWebsiteOpen: false,
            newSite: {},
            loading: true
        };
    }

    componentDidMount() {
        const {api, item, urls} = this.props;

        api.query('subscribers')
            .then((res) => {
                let subscriber_id = (res['_items'])[0] ? (res['_items'])[0]._id : null;
                let formatterUrl = urls.item('format-document-for-preview')
                    + `?subscriber_id=${subscriber_id}&formatter=ninjs&document_id=${item._id}`;

                fetch(formatterUrl).then((response) => response.text()
                    .then((responseText) => {
                        let json = JSON.parse(responseText);
                        this.setState({item: json});
                        this.prepare();
                    }));
            });
    }

    prepare() {
        this.authorize()
            .then((res) => {
                this.setState(
                    {apiHeader: {Authorization: 'Basic ' + res.data.token.api_key}},
                    () => {
                        this.evaluate();
                        this.getSites();
                    });
            });
    }

    authorize() {
        return axios.post(this.state.apiUrl + 'auth/superdesk/', {auth_superdesk: {session_id: this.state.session.sessionId, token: this.state.session.token}});
    }

    evaluate() {
        return axios.post(this.state.apiUrl + 'organization/rules/evaluate',this.state.item, {headers: this.state.apiHeader})
            .then(res => {
                if (!_.isEmpty(res.data)) {
                    let rules = _.filter(res.data.tenants, rule => rule.published);
                    this.setState({
                        rules: rules,
                        loading: false
                    });
                }
                return res;
            });
    }

    getSites() {
        return axios.get(this.state.apiUrl + 'tenants/?limit=9999', {headers: this.state.apiHeader})
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

    render() {
        let styles = {
            alert: {
                padding: '1.8rem 3rem 1.8rem 2rem',
                marginBottom: '2rem',
                verticalAlign: 'middle',
                borderRadius: '4px',
                lineHeight: '1.4em',
                border: '1px solid rgba(123, 123, 123, 0.5)',
                fontWeight: '200',
                position: 'relative',
                color: '#fff',
                maxHeight: '20rem',
                maxWidth: '100%',
                height: 'auto',
                transition: 'all linear 100ms'
            },
            addWebsiteDropdown: {
                boxSizing: 'border-box',
                background: '#fff',
                marginTop: '10px',
                maxHeight: 0,
                overflow: 'hidden',
                transition: 'all ease-in-out .4s'
            },
            addWebsiteDropdownH3: {
                color: 'rgba(0, 0, 0, 0.35)',
                fontSize: '1.2rem',
                lineHeight: '1em',
                textTransform: 'uppercase'
            },
            addWebsiteDropdownLi: {
                fontWeight: 500,
                lineHeight: '2.4em',
                color: '#333',
                cursor: 'pointer',
                margin: '0 -1.5rem',
                padding: '0 1.5rem'
            }
        };

        if (this.state.addWebsiteOpen) {
            styles.addWebsiteDropdown.maxHeight = 999;
        }

        const siteRules = (
            <div>
                {!this.state.rules.length && !this.state.loading &&
                    <div style={styles.alert}>
                        No websites have been set, this article won't show up on any website. It will go to: <br />
                        <span style={{fontWeight: '500'}}>Publisher > Output Control > Incoming list</span>
                    </div>
                }
                {this.state.rules.map((rule, index) =>
                        <Tenant
                            rule={rule}
                            key={rule.tenant.code}
                            apiHeader={this.state.apiHeader}
                            config={this.props.config}
                            item={this.state.item}
                            done={this.reload.bind(this)}
                        />
                )}
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

        if (remainingSites.length && !this.state.loading) {
            addButton = (
                <button className="btn btn--primary btn--icon-only-circle" onClick={this.addButtonHandler.bind(this)}>
                    <i className="icon-plus-large"></i>
                </button>
            );
        }

        const addWebsite = (
            <div style={styles.addWebsiteDropdown}>
                <div style={{padding: '1.5rem'}}>
                    <h3 style={styles.addWebsiteDropdownH3}>Add Website</h3>
                    <ul className='simple-list--dotted simple-list'>
                        { remainingSites.map(site => {
                            let siteDomain = site.subdomain ? site.subdomain + '.' + site.domainName : site.domainName;

                            return (
                                <li key={site.id} className='simple-list__item' style={styles.addWebsiteDropdownLi} onClick={() => this.addDestinationHandler(site)}>{siteDomain}</li>
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
                {this.state.loading && <Loading />}
                {siteRules}
                {addButton}
                {addWebsite}
                {newRuleForm}
            </ToggleBox>
          );
    }
}
