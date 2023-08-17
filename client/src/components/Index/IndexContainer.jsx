import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import Preloader from "../common/preloader/Preloader";
import Index from "./Index";
import { getTotals } from "../../redux/reducers/dashboard-reducer";

class IndexContainer extends React.Component {
  componentDidMount() {
    this.props.getTotals();
  }

  render() {
    return (
      <>
        {this.props.isFetching ? <Preloader /> : null}
        <Index
          data={this.props.data}
          wpsData={this.props.wpsData}
          puData={this.props.puData}
          hhData={this.props.hhData}
          lsData={this.props.lsData}
        />
      </>
    );
  }
}

let mapStateToProps = (state) => {
  return {
    wpsData: state.dashboard.wpsData,
    puData: state.dashboard.puData,
    hhData: state.dashboard.hhData,
    lsData: state.dashboard.lsData,
    data: state.dashboard.data,
    isFetching: state.dashboard.isFetching,
  };
};

export default compose(
  connect(mapStateToProps, {
    getTotals,
  })
)(IndexContainer);
