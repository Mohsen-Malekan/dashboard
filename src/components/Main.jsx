import React, { Component } from "react";
import { SnackbarProvider } from "notistack";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Page from "./Page/Page";
import Loading from "./Loading/Loading";
import AuthContainer from "../containers/Auth.container";
import LayoutContainer from "../containers/Layout.container";
import ReportContainer from "../containers/Report.container";

class Main extends Component {
  state = {
    error: "",
    loading: false
  };

  componentDidMount = async () => {
    await this.loadInitilData();
  };

  loadInitilData = async () => {
    try {
      console.log("Main.loadInitialData...");
      this.setState({ loading: true });
      await AuthContainer.refreshToken();
      await AuthContainer.fetchUser();
      await LayoutContainer.fetchDashboards();
      await ReportContainer.getAll(0, 12);
      await ReportContainer.getUserReports();
      this.setState({ loading: false });
    } catch (error) {
      this.setState({ loading: false, error });
    }
  };

  // static getDerivedStateFromError(error) {
  //   return { error };
  // }

  componentDidCatch(error, info) {
    this.setState({ error });
  }

  reset = () => {
    this.setState({ error: "" });
  };

  render = () => {
    const { loading, error } = this.state;
    if (loading) {
      return <Loading />;
    }

    if (error) {
      return (
        <Page>
          <Typography color="error" variant="h3" gutterBottom>
            خطا
          </Typography>
          <Typography color="error" variant="h5" gutterBottom>
            {error.message || error || "خطا"}
          </Typography>
          <Button color="primary" variant="outlined" onClick={this.reset}>
            تلاش مجدد
          </Button>
        </Page>
      );
    }

    return (
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left"
        }}
        autoHideDuration={2000}
      >
        <>{this.props.children}</>
      </SnackbarProvider>
    );
  };
}

export default Main;
