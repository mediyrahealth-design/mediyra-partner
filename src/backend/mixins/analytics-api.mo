import AnalyticsTypes "../types/analytics";
import PatientTypes "../types/patients";
import BillingTypes "../types/billing";
import AuthTypes "../types/auth";
import AnalyticsLib "../lib/analytics";
import AuthLib "../lib/auth";
import List "mo:core/List";
import Map "mo:core/Map";
import Time "mo:core/Time";

mixin (
  patients : List.List<PatientTypes.Patient>,
  payments : List.List<BillingTypes.Payment>,
  sessions : Map.Map<Text, AuthTypes.Session>,
) {
  /// Returns aggregate dashboard stats. Admin-only.
  public query func getDashboardStats(token : Text) : async AnalyticsTypes.DashboardStats {
    let _session = AuthLib.requireAdmin(sessions, token);
    AnalyticsLib.computeDashboardStats(patients, payments, Time.now());
  };
};
