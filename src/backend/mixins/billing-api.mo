import BillingTypes "../types/billing";
import PatientTypes "../types/patients";
import AuthTypes "../types/auth";
import BillingLib "../lib/billing";
import AuthLib "../lib/auth";
import List "mo:core/List";
import Map "mo:core/Map";
import Time "mo:core/Time";

mixin (
  payments : List.List<BillingTypes.Payment>,
  patients : List.List<PatientTypes.Patient>,
  sessions : Map.Map<Text, AuthTypes.Session>,
) {
  public query func getPaymentsByCenter(token : Text, centerId : Text) : async [BillingTypes.PaymentPublic] {
    let _ = AuthLib.requireCenter(sessions, token);
    BillingLib.getPaymentsByCenter(payments, centerId);
  };

  public query func getBillingStats(token : Text, centerId : Text) : async BillingTypes.BillingStats {
    let _ = AuthLib.requireCenter(sessions, token);
    BillingLib.getBillingStats(payments, patients, centerId);
  };

  public func addPayment(
    token : Text,
    centerId : Text,
    amount : Nat,
    invoiceNumber : Text,
    notes : Text,
  ) : async Nat {
    let _ = AuthLib.requireAdmin(sessions, token);
    BillingLib.addPayment(payments, centerId, amount, invoiceNumber, notes, Time.now());
  };

  public func markPaymentPaid(token : Text, paymentId : Nat) : async Bool {
    let _ = AuthLib.requireAdmin(sessions, token);
    BillingLib.markPaymentPaid(payments, paymentId);
  };
};
