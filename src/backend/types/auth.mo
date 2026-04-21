module {
  public type Role = { #collectionCenter; #admin };

  public type User = {
    id : Text; // collection center ID or "admin"
    var passwordHash : Text;
    role : Role;
  };

  public type Session = {
    token : Text;
    userId : Text;
    role : Role;
    createdAt : Int;
  };

  public type LoginRequest = {
    userId : Text;
    password : Text;
  };

  public type LoginResult = {
    #ok : Session;
    #err : Text;
  };
};
