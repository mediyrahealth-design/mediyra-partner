import AuthTypes "../types/auth";
import AuthLib "../lib/auth";
import Map "mo:core/Map";

mixin (
  users : Map.Map<Text, AuthTypes.User>,
  sessions : Map.Map<Text, AuthTypes.Session>,
) {
  public func login(userId : Text, password : Text) : async AuthTypes.LoginResult {
    AuthLib.login(users, sessions, userId, password);
  };

  public func logout(token : Text) : async Bool {
    AuthLib.logout(sessions, token);
  };

  public func validateSession(token : Text) : async ?AuthTypes.Session {
    AuthLib.validateSession(sessions, token);
  };
};
