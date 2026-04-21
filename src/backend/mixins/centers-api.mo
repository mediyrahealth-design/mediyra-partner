import CenterTypes "../types/centers";
import AuthTypes "../types/auth";
import CentersLib "../lib/centers";
import AuthLib "../lib/auth";
import List "mo:core/List";
import Map "mo:core/Map";
import Time "mo:core/Time";

mixin (
  centers : List.List<CenterTypes.CollectionCenter>,
  users : Map.Map<Text, AuthTypes.User>,
  sessions : Map.Map<Text, AuthTypes.Session>,
) {
  public query func getCenters(token : Text) : async [CenterTypes.CollectionCenterPublic] {
    let _ = AuthLib.requireAdmin(sessions, token);
    CentersLib.getCenters(centers);
  };

  public query func getCenterById(token : Text, id : Text) : async ?CenterTypes.CollectionCenterPublic {
    let _ = AuthLib.requireAdmin(sessions, token);
    CentersLib.getCenterById(centers, id);
  };

  public query func getMyCenter(token : Text) : async ?CenterTypes.CollectionCenterPublic {
    let session = AuthLib.requireCenter(sessions, token);
    CentersLib.getCenterById(centers, session.userId);
  };

  public func addCenter(
    token : Text,
    id : Text,
    name : Text,
    ownerName : Text,
    phone : Text,
    email : Text,
    address : Text,
    password : Text,
  ) : async Bool {
    let _ = AuthLib.requireAdmin(sessions, token);
    CentersLib.addCenter(centers, users, id, name, ownerName, phone, email, address, password, Time.now());
  };

  public func updateCenter(
    token : Text,
    id : Text,
    name : Text,
    ownerName : Text,
    phone : Text,
    email : Text,
    address : Text,
  ) : async Bool {
    let _ = AuthLib.requireAdmin(sessions, token);
    CentersLib.updateCenter(centers, id, name, ownerName, phone, email, address);
  };

  public func setCenterStatus(
    token : Text,
    id : Text,
    active : Bool,
  ) : async Bool {
    let _ = AuthLib.requireAdmin(sessions, token);
    let status : CenterTypes.CenterStatus = if (active) { #active } else { #inactive };
    CentersLib.setCenterStatus(centers, id, status);
  };
};
