import AuthTypes "types/auth";
import CatalogTypes "types/catalog";
import CenterTypes "types/centers";
import PatientTypes "types/patients";
import ReportTypes "types/reports";
import BillingTypes "types/billing";
import AuthLib "lib/auth";
import CatalogLib "lib/catalog";
import CentersLib "lib/centers";
import List "mo:core/List";
import Map "mo:core/Map";

import AuthMixin "mixins/auth-api";
import CatalogMixin "mixins/catalog-api";
import CentersMixin "mixins/centers-api";
import PatientsMixin "mixins/patients-api";
import ReportsMixin "mixins/reports-api";
import BillingMixin "mixins/billing-api";
import AnalyticsMixin "mixins/analytics-api";

actor {
  // Auth state
  let users = Map.empty<Text, AuthTypes.User>();
  let sessions = Map.empty<Text, AuthTypes.Session>();

  // Catalog state
  let tests = List.empty<CatalogTypes.LabTest>();

  // Centers state
  let centers = List.empty<CenterTypes.CollectionCenter>();

  // Patients state
  let patients = List.empty<PatientTypes.Patient>();

  // Reports state
  let reports = List.empty<ReportTypes.Report>();

  // Billing state
  let payments = List.empty<BillingTypes.Payment>();

  // Seed admin user, demo collection center, and test data on first deploy
  do {
    AuthLib.addUser(users, "admin", "admin123", #admin);
    ignore CentersLib.addCenter(centers, users, "CC001", "Demo Collection Center", "Demo Owner", "9999999999", "demo@example.com", "Demo Address", "password123", 0);
    CatalogLib.seedTests(tests);
  };

  include AuthMixin(users, sessions);
  include CatalogMixin(tests, sessions);
  include CentersMixin(centers, users, sessions);
  include PatientsMixin(patients, sessions);
  include ReportsMixin(reports, patients, sessions);
  include BillingMixin(payments, patients, sessions);
  include AnalyticsMixin(patients, payments, sessions);
};
