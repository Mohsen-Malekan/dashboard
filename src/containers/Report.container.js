import { Container } from "unstated";
import Api from "../api/report.api";

export class ReportContainer extends Container {
  state = {
    reports: [],
    userReports: [],
    totalCount: 0
  };

  getAll = async (page, size) => {
    const data = await Api.getAll(page, size);
    await this.setState({
      reports: data.data,
      totalCount: data.totalSize
    });
    return data;
  };

  get = async reportId => {
    let item = this.state.reports.find(r => r.id === +reportId);
    if (!item) {
      item = await Api.get(reportId);
      const reports = [...this.state.reports, item];
      await this.setState({ reports });
    }
    return item;
  };

  getUserReports = async () => {
    const userReports = await Api.getUserReports();
    await this.setState({ userReports });
    return userReports;
  };

  getUserReport = async instanceId => {
    let item = this.state.userReports.find(r => r.id === +instanceId);
    if (!item) {
      item = await Api.getUserReport(instanceId);
      const userReports = [...this.state.userReports, item];
      await this.setState({ userReports });
    }
    return item;
  };

  getHashCode = async instanceId => {
    const hash = await Api.getHashCode(instanceId);
    console.log("hash> ", hash);
    return hash;
  };

  createReportInstance = async (
    reportId,
    userReportName,
    params,
    dashboardId
  ) => {
    return Api.createReportInstance(
      reportId,
      userReportName,
      params,
      dashboardId
    );
  };

  getDrilldownInstance = async (reportId, instanceId, params) => {
    return Api.getDrilldownInstance(reportId, instanceId, params);
  };

  removeInstance = async instanceId => {
    await Api.removeInstance(instanceId);
    const userReports = this.state.userReports.filter(
      item => item.id !== +instanceId
    );
    return this.setState({ userReports });
  };

  reportData = async (
    reportId,
    filters,
    params,
    useCache,
    page,
    size,
    orderBy,
    order
  ) => {
    return Api.reportData(
      reportId,
      filters,
      params,
      useCache,
      page,
      size,
      orderBy,
      order
    );
  };

  isDrillDown = instanceId => {
    const temp = this.state.userReports.some(
      ur => +ur.drillDownId === +instanceId
    );
    return temp;
  };
}

const container = new ReportContainer();

export default container;
