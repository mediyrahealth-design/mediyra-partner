import ReportTypes "../types/reports";
import PatientTypes "../types/patients";
import AuthTypes "../types/auth";
import ReportsLib "../lib/reports";
import AuthLib "../lib/auth";
import List "mo:core/List";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";

mixin (
  reports : List.List<ReportTypes.Report>,
  patients : List.List<PatientTypes.Patient>,
  sessions : Map.Map<Text, AuthTypes.Session>,
) {
  public func uploadReport(
    token : Text,
    patientId : Text,
    filename : Text,
    reportUrl : Text,
  ) : async Nat {
    let _ = AuthLib.requireAdmin(sessions, token);
    switch (patients.find(func(p) { p.id == patientId })) {
      case null { Runtime.trap("Patient not found") };
      case (?patient) {
        let reportId = ReportsLib.uploadReport(
          reports,
          patients,
          patientId,
          patient.centerId,
          filename,
          reportUrl,
          Time.now(),
        );
        reportId;
      };
    };
  };

  public query func getReportsByPatient(token : Text, patientId : Text) : async [ReportTypes.Report] {
    let _ = AuthLib.requireCenter(sessions, token);
    ReportsLib.getReportsByPatient(reports, patientId);
  };

  public query func getReportsByCenter(
    token : Text,
    centerId : Text,
    dateFrom : ?Int,
    dateTo : ?Int,
  ) : async [ReportTypes.Report] {
    let _ = AuthLib.requireCenter(sessions, token);
    ReportsLib.getReportsByCenter(reports, centerId, dateFrom, dateTo);
  };
};
