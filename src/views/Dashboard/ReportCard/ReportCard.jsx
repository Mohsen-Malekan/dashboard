import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Collapse from "@material-ui/core/Collapse";
import TableWrapper from "./TableWrapper";
import ScalarWrapper from "./ScalarWrapper";
import ChartWrapper from "./ChartWrapper";
import Loading from "../../../components/Loading/Loading";
import Error from "../../../components/Error/Error";
import ReportCardActions from "./ReportCardActions";
import ReportContainer from "../../../containers/Report.container";
import Filters from "./Filters";

const styles = () => ({
  card: {
    height: "100%",
    backgroundColor: "transparent"
    // overflow: "auto"
  },
  content: {
    padding: "0",
    "&:last-child": {
      padding: "0"
    }
  },
  headerRoot: {
    paddingTop: "8px",
    paddingBottom: "8px"
  },
  title: {
    fontSize: "0.9rem"
  }
});

class ReportCard extends Component {
  state = {
    expanded: false,
    filters: "",
    report: undefined,
    loading: false,
    error: ""
  };

  componentDidMount = async () => {
    this.setState({ loading: true });
    const { i: instanceId } = this.props.layout;
    const report = await ReportContainer.getUserReport(instanceId);
    this.setState({ loading: false, report });
  };

  actionHandler = action => {
    if (action === "FILTER") {
      return this.toggleFilters();
    }
    if (action === "SHARE") {
      return this.shareReport();
    }
  };

  toggleFilters = () => {
    this.setState(({ expanded }) => ({ expanded: !expanded }));
  };

  shareReport = () => {
    alert("NOT IMPLEMENTED");
  };

  changeFilters = filters => {
    this.setState({ expanded: false, filters });
  };

  chartClickHandler = data => {
    console.log(data);
  };

  getReport = (reportType, layout) => {
    const height = layout.h * 19.5 - 72;
    switch (reportType) {
      case "Table":
        return (
          <TableWrapper
            instanceId={layout.i}
            filters={this.state.filters}
            editEnabled={this.props.editEnabled}
            height={height}
          />
        );

      case "Scalar":
        return (
          <ScalarWrapper
            instanceId={layout.i}
            filters={this.state.filters}
            editEnabled={this.props.editEnabled}
            height={height * 10}
          />
        );

      default:
        return (
          <ChartWrapper
            instanceId={layout.i}
            type={reportType}
            filters={this.state.filters}
            editEnabled={this.props.editEnabled}
            height={height}
            onClick={this.chartClickHandler}
          />
        );
    }
  };

  render = () => {
    const { expanded, filters, report, loading, error } = this.state;

    if (!report) {
      return null;
    }

    const { layout, editEnabled, classes } = this.props;

    if (loading) {
      return <Loading />;
    }

    if (error) {
      return <Error message={error} />;
    }

    return (
      <Card className={classes.card} raised>
        <CardHeader
          action={
            <ReportCardActions
              instanceId={layout.i}
              editEnabled={editEnabled}
              hasFilters={report.query.queryFilters.length > 0}
              actionHandler={this.actionHandler}
            />
          }
          title={report.name}
          classes={{ root: classes.headerRoot, title: classes.title }}
        />
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Filters
              report={report}
              values={filters}
              onSubmit={this.changeFilters}
            />
          </CardContent>
        </Collapse>
        <CardContent className={classes.content} id={`report-${layout.i}`}>
          {this.getReport(report.type, layout)}
        </CardContent>
      </Card>
    );
  };
}

export default withStyles(styles)(ReportCard);
