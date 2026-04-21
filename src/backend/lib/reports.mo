import ReportTypes "../types/reports";
import PatientTypes "../types/patients";
import List "mo:core/List";

module {
  // Returns the assigned report ID
  public func uploadReport(
    reports : List.List<ReportTypes.Report>,
    patients : List.List<PatientTypes.Patient>,
    patientId : Text,
    centerId : Text,
    filename : Text,
    reportUrl : Text,
    now : Int,
  ) : Nat {
    let reportId = reports.size() + 1;
    let report : ReportTypes.Report = {
      id = reportId;
      patientId;
      centerId;
      uploadedAt = now;
      filename;
      reportUrl;
    };
    reports.add(report);
    reportId;
  };

  public func getReportsByPatient(
    reports : List.List<ReportTypes.Report>,
    patientId : Text,
  ) : [ReportTypes.Report] {
    reports.filter(func(r) { r.patientId == patientId }).toArray();
  };

  public func getReportsByCenter(
    reports : List.List<ReportTypes.Report>,
    centerId : Text,
    dateFrom : ?Int,
    dateTo : ?Int,
  ) : [ReportTypes.Report] {
    reports.filter(func(r) {
      if (r.centerId != centerId) { return false };
      switch (dateFrom) {
        case (?from) { if (r.uploadedAt < from) { return false } };
        case null {};
      };
      switch (dateTo) {
        case (?to) { if (r.uploadedAt > to) { return false } };
        case null {};
      };
      true;
    }).toArray();
  };
};
