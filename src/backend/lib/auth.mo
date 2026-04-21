import Types "../types/auth";
import Map "mo:core/Map";
import Time "mo:core/Time";

module {
  // Simple deterministic hash using Nat arithmetic
  func djb2(text : Text) : Nat {
    var h : Nat = 5381;
    for (c in text.toIter()) {
      h := (h * 33 + Nat32.toNat(Char.toNat32(c))) % 4294967296;
    };
    h;
  };

  public func hashPassword(password : Text) : Text {
    djb2(password).toText();
  };

  public func generateToken(userId : Text) : Text {
    let ts = Time.now().toText();
    userId # "-" # djb2(userId # ts).toText();
  };

  public func login(
    users : Map.Map<Text, Types.User>,
    sessions : Map.Map<Text, Types.Session>,
    userId : Text,
    password : Text,
  ) : Types.LoginResult {
    switch (users.get(userId)) {
      case null { #err("Invalid user ID or password") };
      case (?user) {
        let hash = hashPassword(password);
        if (user.passwordHash != hash) {
          #err("Invalid user ID or password");
        } else {
          let token = generateToken(userId);
          let session : Types.Session = {
            token;
            userId;
            role = user.role;
            createdAt = Time.now();
          };
          sessions.add(token, session);
          #ok(session);
        };
      };
    };
  };

  public func logout(
    sessions : Map.Map<Text, Types.Session>,
    token : Text,
  ) : Bool {
    switch (sessions.get(token)) {
      case null { false };
      case (?_) {
        sessions.remove(token);
        true;
      };
    };
  };

  public func validateSession(
    sessions : Map.Map<Text, Types.Session>,
    token : Text,
  ) : ?Types.Session {
    sessions.get(token);
  };

  public func requireAdmin(
    sessions : Map.Map<Text, Types.Session>,
    token : Text,
  ) : Types.Session {
    switch (sessions.get(token)) {
      case null { Runtime.trap("Unauthorized: invalid session") };
      case (?session) {
        switch (session.role) {
          case (#admin) { session };
          case (_) { Runtime.trap("Unauthorized: admin required") };
        };
      };
    };
  };

  public func requireCenter(
    sessions : Map.Map<Text, Types.Session>,
    token : Text,
  ) : Types.Session {
    switch (sessions.get(token)) {
      case null { Runtime.trap("Unauthorized: invalid session") };
      case (?session) {
        switch (session.role) {
          case (#collectionCenter) { session };
          case (#admin) { session }; // admins can also call center endpoints
        };
      };
    };
  };

  public func addUser(
    users : Map.Map<Text, Types.User>,
    id : Text,
    password : Text,
    role : Types.Role,
  ) {
    let user : Types.User = {
      id;
      var passwordHash = hashPassword(password);
      role;
    };
    users.add(id, user);
  };
};
