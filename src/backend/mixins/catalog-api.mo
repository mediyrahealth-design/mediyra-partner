import CatalogTypes "../types/catalog";
import AuthTypes "../types/auth";
import CatalogLib "../lib/catalog";
import AuthLib "../lib/auth";
import List "mo:core/List";
import Map "mo:core/Map";

mixin (
  tests : List.List<CatalogTypes.LabTest>,
  sessions : Map.Map<Text, AuthTypes.Session>,
) {
  public query func getTests() : async [CatalogTypes.LabTest] {
    CatalogLib.getTests(tests);
  };

  public query func getTestById(id : Nat) : async ?CatalogTypes.LabTest {
    CatalogLib.getTestById(tests, id);
  };

  public func addTest(
    token : Text,
    name : Text,
    category : Text,
    sampleType : Text,
    tubeType : Text,
    fastingRequired : Bool,
    reportTime : Text,
    mrpPrice : Nat,
    partnerPrice : Nat,
  ) : async Nat {
    let _ = AuthLib.requireAdmin(sessions, token);
    let newTest : CatalogTypes.LabTest = {
      id = 0; // will be overwritten with next ID in addTest
      name;
      category;
      sampleType;
      tubeType;
      fastingRequired;
      reportTime;
      mrpPrice;
      partnerPrice;
    };
    CatalogLib.addTest(tests, newTest);
  };

  public func updateTest(token : Text, test : CatalogTypes.LabTest) : async Bool {
    let _ = AuthLib.requireAdmin(sessions, token);
    CatalogLib.updateTest(tests, test);
  };

  public func deleteTest(token : Text, id : Nat) : async Bool {
    let _ = AuthLib.requireAdmin(sessions, token);
    CatalogLib.deleteTest(tests, id);
  };
};
