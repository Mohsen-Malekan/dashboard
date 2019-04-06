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
    return item.report;
  };

  get = async reportId => {
    let item = this.state.reports.find(r => r.id === +reportId);
    if (!item) {
      item = await Api.get(reportId);
    }
    return item;
  };

  getReportInstance = async (reportId, params) => {
    return Api.getReportInstance(reportId, params);
  };

  removeInstance = async instanceId => {
    return Api.removeInstance(instanceId);
  };

  reportData = async (reportId, filters, params, page, size) => {
    return Api.reportData(reportId, filters, params, page, size);
  };
}

const container = new ReportContainer();

export default container;
