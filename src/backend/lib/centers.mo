import Types "../types/centers";
import AuthTypes "../types/auth";
import AuthLib "../lib/auth";
import List "mo:core/List";
import Map "mo:core/Map";

module {
  public func toPublic(center : Types.CollectionCenter) : Types.CollectionCenterPublic {
    {
      id = center.id;
      name = center.name;
      ownerName = center.ownerName;
      phone = center.phone;
      email = center.email;
      address = center.address;
      status = center.status;
      createdAt = center.createdAt;
    };
  };

  public func getCenters(centers : List.List<Types.CollectionCenter>) : [Types.CollectionCenterPublic] {
    centers.map<Types.CollectionCenter, Types.CollectionCenterPublic>(toPublic).toArray();
  };

  public func getCenterById(centers : List.List<Types.CollectionCenter>, id : Text) : ?Types.CollectionCenterPublic {
    switch (centers.find(func(c) { c.id == id })) {
      case null { null };
      case (?c) { ?toPublic(c) };
    };
  };

  public func addCenter(
    centers : List.List<Types.CollectionCenter>,
    users : Map.Map<Text, AuthTypes.User>,
    id : Text,
    name : Text,
    ownerName : Text,
    phone : Text,
    email : Text,
    address : Text,
    password : Text,
    now : Int,
  ) : Bool {
    // Check if center with this ID already exists
    switch (centers.find(func(c) { c.id == id })) {
      case (?_) { false };
      case null {
        let center : Types.CollectionCenter = {
          id;
          name;
          ownerName;
          phone;
          email;
          address;
          var status = #active;
          createdAt = now;
        };
        centers.add(center);
        AuthLib.addUser(users, id, password, #collectionCenter);
        true;
      };
    };
  };

  public func updateCenter(
    centers : List.List<Types.CollectionCenter>,
    id : Text,
    name : Text,
    ownerName : Text,
    phone : Text,
    email : Text,
    address : Text,
  ) : Bool {
    switch (centers.findIndex(func(c) { c.id == id })) {
      case null { false };
      case (?idx) {
        let existing = centers.at(idx);
        // Mutate the mutable fields directly, update immutable via put
        let updated : Types.CollectionCenter = {
          id = existing.id;
          name;
          ownerName;
          phone;
          email;
          address;
          var status = existing.status;
          createdAt = existing.createdAt;
        };
        centers.put(idx, updated);
        true;
      };
    };
  };

  public func setCenterStatus(
    centers : List.List<Types.CollectionCenter>,
    id : Text,
    status : Types.CenterStatus,
  ) : Bool {
    switch (centers.find(func(c) { c.id == id })) {
      case null { false };
      case (?center) {
        center.status := status;
        true;
      };
    };
  };
};
