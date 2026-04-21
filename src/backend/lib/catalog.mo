import Types "../types/catalog";
import List "mo:core/List";

module {
  public func getTests(tests : List.List<Types.LabTest>) : [Types.LabTest] {
    tests.toArray();
  };

  public func getTestById(tests : List.List<Types.LabTest>, id : Nat) : ?Types.LabTest {
    tests.find(func(t) { t.id == id });
  };

  // Returns the assigned ID
  public func addTest(tests : List.List<Types.LabTest>, test : Types.LabTest) : Nat {
    let newId = tests.size() + 1;
    let newTest : Types.LabTest = { test with id = newId };
    tests.add(newTest);
    newId;
  };

  public func updateTest(tests : List.List<Types.LabTest>, test : Types.LabTest) : Bool {
    switch (tests.findIndex(func(t) { t.id == test.id })) {
      case null { false };
      case (?idx) {
        tests.put(idx, test);
        true;
      };
    };
  };

  public func deleteTest(tests : List.List<Types.LabTest>, id : Nat) : Bool {
    switch (tests.findIndex(func(t) { t.id == id })) {
      case null { false };
      case (?_) {
        let filtered = tests.filter(func(t) { t.id != id });
        tests.clear();
        tests.append(filtered);
        true;
      };
    };
  };

  public func seedTests(tests : List.List<Types.LabTest>) {
    let seedData : [(Text, Text, Text, Text, Bool, Text, Nat, Nat)] = [
      ("CBC", "Hematology", "Blood", "EDTA (Purple)", false, "Same Day", 350, 250),
      ("LFT", "Biochemistry", "Blood", "SST (Yellow)", false, "Same Day", 800, 600),
      ("KFT", "Biochemistry", "Blood", "SST (Yellow)", false, "Same Day", 700, 520),
      ("Lipid Profile", "Biochemistry", "Blood", "SST (Yellow)", true, "Same Day", 900, 680),
      ("BSR", "Biochemistry", "Blood", "Fluoride (Grey)", false, "2 Hours", 80, 60),
      ("Urine Routine", "Microbiology", "Urine", "Urine Cup", false, "Same Day", 150, 110),
    ];
    for ((name, category, sampleType, tubeType, fasting, reportTime, mrp, partner) in seedData.values()) {
      let id = tests.size() + 1;
      let test : Types.LabTest = {
        id;
        name;
        category;
        sampleType;
        tubeType;
        fastingRequired = fasting;
        reportTime;
        mrpPrice = mrp;
        partnerPrice = partner;
      };
      tests.add(test);
    };
  };
};
