import React from "react";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../../UI/Loading/Loading";
import Item from "./Item";

class Reports extends React.Component {
  constructor(props) {
    super(props);

    this.timer = null;

    this.state = {
      reports: [],
      page: 0,
      totalPages: 1,
      loading: false,
    };
  }

  componentDidMount() {
    this.loadReports();
    this.timer = setInterval(() => {
      this.refreshReports();
    }, 15000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  loadReports = () => {
    if (this.state.loading || this.state.page >= this.state.totalPages) return;

    this.setState({ loading: true });

    let params = {
      "sorting[createdAt]": "desc",
      limit: 10,
      page: this.state.page + 1,
    };

    this.props.publisher.getAnalyticsReports(params).then((response) =>
      this.setState({
        reports: [...this.state.reports, ...response._embedded._items],
        loading: false,
        totalPages: response.pages,
        page: this.state.page + 1,
      })
    );
  };

  refreshReports = () => {
    let params = {
      "sorting[createdAt]": "desc",
      limit: 10 * this.state.page,
      page: 1,
    };

    this.props.publisher.getAnalyticsReports(params).then((response) => {
      const currentReports = [...this.state.reports];
      const newItems = response._embedded._items;

      let reports = currentReports.map((item) =>
        newItems.find((newItem) => item.id === newItem.id)
      );

      this.setState({
        reports: reports,
      });
    });
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
            loader={<Loading />}
            scrollableTarget="scrollableDiv"
          >
            {this.state.reports.map((item, index) => (
              <Item item={item} key={"report" + item.id} />
            ))}
          </InfiniteScroll>
        </div>
      </div>
    );
  }
}

Reports.propTypes = {
  publisher: PropTypes.object.isRequired,
};

export default Reports;
