import PatientTypes "../types/patients";
import AuthTypes "../types/auth";
import PatientsLib "../lib/patients";
import AuthLib "../lib/auth";
import List "mo:core/List";
import Map "mo:core/Map";
import Time "mo:core/Time";

mixin (
  patients : List.List<PatientTypes.Patient>,
  sessions : Map.Map<Text, AuthTypes.Session>,
) {
  public func bookPatient(
    token : Text,
    req : PatientTypes.BookPatientRequest,
  ) : async Text {
    let session = AuthLib.requireCenter(sessions, token);
    PatientsLib.bookPatient(patients, Time.now(), session.userId, req);
  };

  public query func getPatientsByCenter(token : Text) : async [PatientTypes.PatientPublic] {
    let session = AuthLib.requireCenter(sessions, token);
    PatientsLib.getPatientsByCenter(patients, session.userId);
  };

  public query func getPatientByIdOrMobile(token : Text, searchQuery : Text) : async ?PatientTypes.PatientPublic {
    let _ = AuthLib.requireCenter(sessions, token);
    PatientsLib.getPatientByIdOrMobile(patients, searchQuery);
  };

  public func updateSampleStatus(
    token : Text,
    patientId : Text,
    status : PatientTypes.SampleStatus,
  ) : async ?PatientTypes.PatientPublic {
    let _ = AuthLib.requireAdmin(sessions, token);
    PatientsLib.updateSampleStatus(patients, patientId, status);
  };
};
