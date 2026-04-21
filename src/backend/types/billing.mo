module {
  public type PaymentStatus = { #pending; #paid };

  public type Payment = {
    id : Nat;
    centerId : Text;
    amount : Nat;
    invoiceNumber : Text;
    var status : PaymentStatus;
    date : Int;
    notes : Text;
  };

  // Shared (immutable) version for API boundary
  public type PaymentPublic = {
    id : Nat;
    centerId : Text;
    amount : Nat;
    invoiceNumber : Text;
    status : PaymentStatus;
    date : Int;
    notes : Text;
  };

  public type BillingStats = {
    totalTests : Nat;
    totalCommission : Nat;
    lastPayment : ?PaymentPublic;
  };
};
