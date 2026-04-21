module {
  public type Report = {
    id : Nat;
    patientId : Text;
    centerId : Text;
    uploadedAt : Int;
    filename : Text;
    reportUrl : Text;
  };
};
