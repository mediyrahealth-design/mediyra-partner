import Types "../types/patients";
import List "mo:core/List";

module {
  public func toPublic(patient : Types.Patient) : Types.PatientPublic {
    {
      id = patient.id;
      name = patient.name;
      age = patient.age;
      gender = patient.gender;
      mobile = patient.mobile;
      refDoctor = patient.refDoctor;
      testIds = patient.testIds;
      centerId = patient.centerId;
      bookingDate = patient.bookingDate;
      status = patient.status;
    };
  };

  public func generatePatientId(counter : Nat, now : Int) : Text {
    // Format: MED-YYYYMMDD-XXXX (approximate from epoch nanoseconds)
    let secs : Nat = now.toNat() / 1_000_000_000;
    let daysSinceEpoch : Nat = secs / 86400;
    let approxYear : Nat = 1970 + (daysSinceEpoch / 365);
    let dayOfYear : Nat = daysSinceEpoch % 365;
    let approxMonth : Nat = (dayOfYear / 30) + 1;
    let approxDayOfMonth : Nat = (dayOfYear % 30) + 1;

    let pad2 = func(n : Nat) : Text {
      if (n < 10) { "0" # n.toText() } else { n.toText() };
    };
    let pad4 = func(n : Nat) : Text {
      if (n < 10) { "000" # n.toText() }
      else if (n < 100) { "00" # n.toText() }
      else if (n < 1000) { "0" # n.toText() }
      else { n.toText() };
    };

    let dateStr = approxYear.toText() # pad2(approxMonth) # pad2(approxDayOfMonth);
    "MED-" # dateStr # "-" # pad4((counter % 9999) + 1);
  };

  // Returns the patient ID
  public func bookPatient(
    patients : List.List<Types.Patient>,
    now : Int,
    centerId : Text,
    req : Types.BookPatientRequest,
  ) : Text {
    let counter = patients.size();
    let patientId = generatePatientId(counter, now);
    let patient : Types.Patient = {
      id = patientId;
      name = req.name;
      age = req.age;
      gender = req.gender;
      mobile = req.mobile;
      refDoctor = req.refDoctor;
      testIds = req.testIds;
      centerId;
      bookingDate = now;
      var status = #sampleCollected;
    };
    patients.add(patient);
    patientId;
  };

  public func getPatientsByCenter(
    patients : List.List<Types.Patient>,
    centerId : Text,
  ) : [Types.PatientPublic] {
    patients.filter(func(p) { p.centerId == centerId })
      .map<Types.Patient, Types.PatientPublic>(toPublic)
      .toArray();
  };

  public func getPatientByIdOrMobile(
    patients : List.List<Types.Patient>,
    searchQuery : Text,
  ) : ?Types.PatientPublic {
    switch (patients.find(func(p) { p.id == searchQuery or p.mobile == searchQuery })) {
      case null { null };
      case (?p) { ?toPublic(p) };
    };
  };

  public func updateSampleStatus(
    patients : List.List<Types.Patient>,
    patientId : Text,
    status : Types.SampleStatus,
  ) : ?Types.PatientPublic {
    switch (patients.find(func(p) { p.id == patientId })) {
      case null { null };
      case (?patient) {
        patient.status := status;
        ?toPublic(patient);
      };
    };
  };
};
