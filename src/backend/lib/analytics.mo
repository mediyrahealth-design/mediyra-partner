import AnalyticsTypes "../types/analytics";
import PatientTypes "../types/patients";
import BillingTypes "../types/billing";
import List "mo:core/List";
import Int "mo:core/Int";

module {
  let DAY_NS : Int = 86_400_000_000_000;
  let MONTH_NS : Int = 2_592_000_000_000_000;

  /// Compute dashboard stats across all patients and payments.
  public func computeDashboardStats(
    patients : List.List<PatientTypes.Patient>,
    payments : List.List<BillingTypes.Payment>,
    nowNs : Int,
  ) : AnalyticsTypes.DashboardStats {
    let todayBucket = nowNs / DAY_NS;
    let monthBucket = nowNs / MONTH_NS;

    let totalBookings = patients.size();

    let todaysSamples = patients.filter(
      func(p) { p.bookingDate / DAY_NS == todayBucket }
    ).size();

    let pendingReports = patients.filter(
      func(p) {
        switch (p.status) {
          case (#reportReady) { false };
          case (_) { true };
        };
      }
    ).size();

    let thisMonthRevenue = payments.foldLeft(
      0,
      func(acc : Nat, p : BillingTypes.Payment) : Nat {
        switch (p.status) {
          case (#paid) {
            if (p.date / MONTH_NS == monthBucket) {
              acc + p.amount;
            } else { acc };
          };
          case (_) { acc };
        };
      },
    );

    {
      totalBookings;
      todaysSamples;
      pendingReports;
      thisMonthRevenue;
    };
  };
};
