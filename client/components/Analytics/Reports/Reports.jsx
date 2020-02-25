import React from "react";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../../UI/Loading/Loading";
import Item from "./Item";

class Reports extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      reports: [],
      page: 0,
      totalPages: 1,
      loading: false
    };
  }

  componentDidMount() {
    this.loadReports();
  }

  loadReports = () => {
    if (this.state.loading || this.state.page >= this.state.totalPages) return;

    this.setState({ loading: true });

    let params = {
      "sorting[createdAt]": "desc",
      limit: 10,
      page: this.state.page + 1
    };

    this.props.publisher.getAnalyticsReports(params).then(response =>
      this.setState({
        reports: [...this.state.reports, ...response._embedded._items],
        loading: false,
        totalPages: response.pages,
        page: this.state.page + 1
      })
    );
  };

  render() {
    return (
      <div className="sd-column-box__main-column" id="scrollableDiv">
        <div className="sd-list-item-group sd-list-item-group--space-between-items">
          <InfiniteScroll
            style={{ overflow: "visible" }}
            dataLength={this.state.reports.length}
            next={this.loadReports}
            hasMore={this.state.page < this.state.totalPages}
            loader={<Loading dark={true} />}
            scrollableTarget="scrollableDiv"
          >
            {this.state.reports.map((item, index) => (
              <Item item={item} key={"report" + index} />
            ))}
          </InfiniteScroll>
        </div>
      </div>
    );
  }
}

Reports.propTypes = {
  publisher: PropTypes.object.isRequired
};

export default Reports;
