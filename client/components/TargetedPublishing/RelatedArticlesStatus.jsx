import React from 'react';
import axios from 'axios';
import classNames from 'classnames';
import {ToggleBox} from '../UI/ToggleBox.jsx';
import Loading from '../UI/Loading/Loading.jsx';

export default class RelatedArticlesStatus extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            relatedArticles: [],
            loading: true
        };
    }

    componentDidMount() {
        if (!this.props.item.associations) return;
        this.getRelatedArticles();
    }

    componentWillReceiveProps({rules}) {
        this.setState({rules});
    }

    getRelatedArticles = () => {
        return axios.post(this.props.apiUrl + 'organization/articles/related/', this.props.item, {headers: this.props.apiHeader})
            .then(res => {
                this.setState({
                    relatedArticles: res.data.related_article_items,
                    loading: false
                });
                return res;
            });
    }

    render() {
        if (!this.props.item.associations) {
            return null;
        }

        return (
            <ToggleBox title="Related Articles" style="toggle-box--dark sp--dark-ui" isOpen={true}>
                {this.state.loading && <Loading />}
                <ul className="simple-list simple-list--dotted simple-list--no-padding">
                    {this.state.relatedArticles.map(article =>
                        <li className="simple-list__item" key={article.title}>
                            <p>{article.title}</p>
                            {this.props.rules.map(rule => {
                                let index = article.tenants.findIndex(t => t.code === rule.tenant.code);
                                let siteDomain = rule.tenant.subdomain ? rule.tenant.subdomain + '.' + rule.tenant.domain_name : rule.tenant.domain_name;

                                return <span key={'site' + rule.tenant.code} className={classNames('label-icon', { 'label-icon--success': index >= 0})}><i className="icon-globe"></i> {siteDomain}</span>
                            })}
                        </li>
                    )}
                </ul>
            </ToggleBox>
          );
    }
}
