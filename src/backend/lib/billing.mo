import Types "../types/billing";
import PatientTypes "../types/patients";
import List "mo:core/List";

module {
  public func toPublic(payment : Types.Payment) : Types.PaymentPublic {
    {
      id = payment.id;
      centerId = payment.centerId;
      amount = payment.amount;
      invoiceNumber = payment.invoiceNumber;
      status = payment.status;
      date = payment.date;
      notes = payment.notes;
    };
  };

  public func getPaymentsByCenter(
    payments : List.List<Types.Payment>,
    centerId : Text,
  ) : [Types.PaymentPublic] {
    payments.filter(func(p) { p.centerId == centerId })
      .map<Types.Payment, Types.PaymentPublic>(toPublic)
      .toArray();
  };

  public func getBillingStats(
    payments : List.List<Types.Payment>,
    patients : List.List<PatientTypes.Patient>,
    centerId : Text,
  ) : Types.BillingStats {
    let totalTests = patients.filter(func(p) { p.centerId == centerId }).size();
    let centerPayments = payments.filter(func(p) { p.centerId == centerId });
    let totalCommission = centerPayments.foldLeft(
      0,
      func(acc, p) { acc + p.amount },
    );
    let lastPayment = switch (centerPayments.last()) {
      case null { null };
      case (?p) { ?toPublic(p) };
    };
    { totalTests; totalCommission; lastPayment };
  };

  // Returns the assigned payment ID
  public func addPayment(
    payments : List.List<Types.Payment>,
    centerId : Text,
    amount : Nat,
    invoiceNumber : Text,
    notes : Text,
    now : Int,
  ) : Nat {
    let paymentId = payments.size() + 1;
    let payment : Types.Payment = {
      id = paymentId;
      centerId;
      amount;
      invoiceNumber;
      var status = #pending;
      date = now;
      notes;
    };
    payments.add(payment);
    paymentId;
  };

  public func markPaymentPaid(
    payments : List.List<Types.Payment>,
    paymentId : Nat,
  ) : Bool {
    switch (payments.find(func(p) { p.id == paymentId })) {
      case null { false };
      case (?payment) {
        payment.status := #paid;
        true;
      };
    };
  };
};
