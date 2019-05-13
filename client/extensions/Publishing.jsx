import React from 'react';
import axios from 'axios';
import _ from 'lodash';
import PropTypes from 'prop-types';

import TargetedPublishing from '../components/TargetedPublishing/TargetedPublishing';
import RelatedArticlesStatus from '../components/TargetedPublishing/RelatedArticlesStatus.jsx';
import SocialMedia from '../components/TargetedPublishing/SocialMedia';
import Loading from '../components/UI/Loading/Loading';

import './Publishing.css';

class Publishing extends React.Component {
    constructor(props) {
        super(props);

        const pubConfig = props.config.publisher || {};
        const protocol = pubConfig.protocol || 'https';
        const subdomain = pubConfig.tenant ? `${pubConfig.tenant}.` : '';
        const domainName = pubConfig.domain;

        this.state = {
            apiUrl: `${protocol}://${subdomain}${domainName}/api/v1/`,
            apiHeader: null,
            item: null,
            rules: [],
            loading: true,
            ninjsError: false
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
                        if (!json.guid) {
                            this.setState({ninjsError: json.message, loading: false});
                        } else {
                            this.setState({item: json});
                            this.prepare();
                        }
                    }));
            });
    }

    prepare = () => {
        this.authorize()
            .then((res) => {
                this.setState(
                    {apiHeader: {Authorization: 'Basic ' + res.data.token.api_key}},
                    () => {
                        this.evaluate();
                    });
            });
    }

    authorize = () => {
        return axios.post(this.state.apiUrl + 'auth/superdesk/', {session_id: this.props.session.sessionId, token: this.props.session.token});
    }

    evaluate = () => {
        return axios.post(this.state.apiUrl + 'organization/rules/evaluate', this.state.item, {headers: this.state.apiHeader})
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

    render() {
        return (
            <React.Fragment>
                {this.state.ninjsError &&
                    <div className="tp-alert">
                        <span style={{fontWeight: '500'}}>Error: </span>{this.state.ninjsError}
                    </div>
                }
                {this.state.loading && <Loading />}
                {!this.state.loading && !this.state.ninjsError &&
                    <TargetedPublishing
                        config={this.props.config}
                        rules={this.state.rules}
                        apiUrl={this.state.apiUrl}
                        apiHeader={this.state.apiHeader}
                        item={this.state.item}
                        reload={() => this.evaluate()}/>}
                {!this.state.loading && !this.state.ninjsError &&
                    <RelatedArticlesStatus
                        rules={this.state.rules}
                        apiUrl={this.state.apiUrl}
                        apiHeader={this.state.apiHeader}
                        item={this.state.item}/>}
                {!this.state.loading && !this.state.ninjsError &&
                    <SocialMedia
                        apiUrl={this.state.apiUrl}
                        apiHeader={this.state.apiHeader}
                        item={this.state.item}/>}
            </React.Fragment>
          );
    }
}


Publishing.propTypes = {
    config: PropTypes.object.isRequired,
    api: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
    urls: PropTypes.object.isRequired
}

export default Publishing
