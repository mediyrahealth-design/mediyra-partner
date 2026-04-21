module {
  public type Gender = { #male; #female; #other };

  public type SampleStatus = {
    #sampleCollected;
    #sampleReceived;
    #processing;
    #reportReady;
  };

  public type Patient = {
    id : Text; // MED-YYYYMMDD-XXXX format
    name : Text;
    age : Nat;
    gender : Gender;
    mobile : Text;
    refDoctor : Text;
    testIds : [Nat];
    centerId : Text;
    bookingDate : Int;
    var status : SampleStatus;
  };

  // Shared (immutable) version for API boundary
  public type PatientPublic = {
    id : Text;
    name : Text;
    age : Nat;
    gender : Gender;
    mobile : Text;
    refDoctor : Text;
    testIds : [Nat];
    centerId : Text;
    bookingDate : Int;
    status : SampleStatus;
  };

  public type BookPatientRequest = {
    name : Text;
    age : Nat;
    gender : Gender;
    mobile : Text;
    refDoctor : Text;
    testIds : [Nat];
  };
};
