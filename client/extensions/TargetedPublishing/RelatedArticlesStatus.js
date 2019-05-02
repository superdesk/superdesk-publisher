import React from 'react';
import axios from 'axios';
import classNames from 'classnames';
import {ToggleBox} from '../helperComponents/ToggleBox.jsx';
import Loading from '../helperComponents/Loading.jsx';

export default class RelatedArticlesStatus extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            item: props.item,
            apiUrl: props.apiUrl,
            apiHeader: props.apiHeader,
            rules: props.rules,
            relatedArticlesData: [],
            loading: true
        };
    }

    componentDidMount() {
        if (!this.state.item.associations) return;
        this.getRelatedArticlesData();
    }

    componentWillReceiveProps({rules}) {
        this.setState({rules});
    }

    getRelatedArticlesData = () => {
        return axios.post(this.state.apiUrl + 'organization/articles/related/', this.state.item, {headers: this.state.apiHeader})
            .then(res => {
                this.setState({
                    relatedArticlesData: res.data.related_article_items,
                    loading: false
                });
                return res;
            });
    }

    render() {

        if (!this.state.item.associations) return null;

        return (
            <ToggleBox title="Related Articles" style="toggle-box--dark sp--dark-ui" isOpen={true}>
                {this.state.loading && <Loading />}
                <ul className="simple-list simple-list--dotted simple-list--no-padding">
                    {this.state.relatedArticlesData.map(article =>
                        <li className="simple-list__item" key={article.title}>
                            <p>{article.title}</p>
                            {this.state.rules.map(rule => {
                                let index = article.tenants.findIndex(t => t.code === rule.tenant.code);
                                let siteDomain = rule.tenant.subdomain ? rule.tenant.subdomain + '.' + rule.tenant.domain_name : rule.tenant.domain_name;

                                return <span key={'site' + rule.tenant.code} className={classNames('label-icon', { 'label-icon--success': index >= 0})} className=""><i className="icon-globe"></i> {siteDomain}</span>

                            })}
                        </li>
                    )}
                </ul>
            </ToggleBox>
          );
    }
}
