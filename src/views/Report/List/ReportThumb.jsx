import React, { Component } from "react";
import { Subscribe } from "unstated";
import { withSnackbar } from "notistack";
import moment from "moment-jalaali";
import classnames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AddIcon from "@material-ui/icons/Add";
import Chart from "../../../components/Chart/Chart";
import Table from "../../../components/Table/Table";
import Scalar from "../../../components/Scalar/Scalar";
import Dialog from "../../../components/Dialog/Dialog";
import NewDashboardForm from "./NewDashboard";
import LayoutContainer from "../../../containers/Layout.container";
import * as mockData from "../../../mockdata";

const styles = theme => ({
  card: {
    // height: 400
  },
  Content: {
    paddingLeft: "0",
    paddingRight: "0"
    // paddingTop: "56.25%" // 16:9
  },
  title: {
    fontSize: "1.1rem"
  },
  subheader: {
    fontSize: "0.7rem",
    paddingTop: "5px"
  },
  actions: {
    display: "flex"
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  description: {
    paddingLeft: "10px",
    paddingRight: "10px"
  },
  hidden: {
    visibility: "hidden"
  }
});

const ASPECT_RATIO = 16 / 9;

class ReportThumbCard extends Component {
  state = { anchorEl: null, expanded: false, loading: false, open: false };

  handleExpandClick = () => {
    this.setState(({ expanded }) => ({ expanded: !expanded }));
  };

  handleMenuClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  handleSelectDashboard = dashboardId => async () => {
    this.handleMenuClose();
    await this.addToDashboard(dashboardId);
  };

  toggleNewDashboardModal = () => {
    return this.setState(({ open }) => ({ open: !open }));
  };

  handleSaveNewDashboard = async () => {
    try {
      this.setState({ loading: true });
      await LayoutContainer.addDashboard(LayoutContainer.newDashboardName);
    } catch (error) {
      this.props.enqueueSnackbar("درخواست با خطا مواجه شد", {
        variant: "error"
      });
    } finally {
      LayoutContainer.setNewDashboardName("");
      this.toggleNewDashboardModal();
      this.setState({ loading: false });
    }
  };

  addToDashboard = async dashboardId => {
    const { report } = this.props;
    return this.props.navigate(
      `/user/reports/${report.id}/config/params/${dashboardId}`
    );
  };

  getReport = (reportType, data) => {
    switch (reportType) {
      case "Table":
        return (
          <Table
            cols={data.cols}
            rows={data.rows}
            count={data.rows.length}
            aspect={ASPECT_RATIO}
          />
        );

      case "Scalar":
        return <Scalar aspect={ASPECT_RATIO} data={data} />;

      default:
        return <Chart aspect={ASPECT_RATIO} data={data} type={reportType} />;
    }
  };

  render = () => {
    const { classes, report } = this.props;
    const { anchorEl, expanded, loading, open } = this.state;
    const { name, type, created, description = "" } = report;
    const date = created.slice(0, created.length - 6);
    const data =
      ["Table", "Scalar"].indexOf(type) > -1
        ? mockData[type]
        : mockData["Charts"];

    return (
      <Subscribe to={[LayoutContainer]}>
        {Layout => (
          <>
            <Dialog
              title="نام داشبورد جدید"
              open={open}
              loading={loading}
              maxWidth="sm"
              onSave={this.handleSaveNewDashboard}
              onClose={this.toggleNewDashboardModal}
            >
              <NewDashboardForm />
            </Dialog>
            <Card className={classes.card}>
              <CardHeader
                action={
                  <>
                    <IconButton
                      title="انتخاب"
                      color="primary"
                      onClick={this.handleMenuClick}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                    <Menu
                      id="dashboards-menu"
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={this.handleMenuClose}
                    >
                      {Layout.state.dashboards
                        .filter(d => !d.shared)
                        .map(d => (
                          <MenuItem
                            key={d.id}
                            onClick={this.handleSelectDashboard(d.id)}
                          >{`داشبورد ${d.name || d.id}`}</MenuItem>
                        ))}
                      <MenuItem onClick={this.toggleNewDashboardModal}>
                        داشبورد جدید
                      </MenuItem>
                    </Menu>
                  </>
                }
                title={name}
                subheader={moment(date).format("LL")}
                classes={{ title: classes.title, subheader: classes.subheader }}
              />
              <CardContent className={classes.Content}>
                {this.getReport(type, data)}
              </CardContent>
              <CardActions className={classes.actions} disableActionSpacing>
                {!expanded && (
                  <Typography component="p" className={classes.description}>
                    {description.slice(0, 50)}{" "}
                    {description.length > 50 && "..."}
                  </Typography>
                )}
                <IconButton
                  className={classnames(classes.expand, {
                    [classes.expandOpen]: expanded,
                    [classes.hidden]: description.length <= 50
                  })}
                  onClick={this.handleExpandClick}
                  aria-expanded={expanded}
                  aria-label="نمایش توضیحات"
                >
                  <ExpandMoreIcon />
                </IconButton>
              </CardActions>
              <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                  <Typography>{description}</Typography>
                </CardContent>
              </Collapse>
            </Card>
          </>
        )}
      </Subscribe>
    );
  };
}

const WithSnackbar = withSnackbar(ReportThumbCard);
export default withStyles(styles)(WithSnackbar);
