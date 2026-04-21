module {
  public type CenterStatus = { #active; #inactive };

  public type CollectionCenter = {
    id : Text;
    name : Text;
    ownerName : Text;
    phone : Text;
    email : Text;
    address : Text;
    var status : CenterStatus;
    createdAt : Int;
  };

  // Shared (immutable) version for API boundary
  public type CollectionCenterPublic = {
    id : Text;
    name : Text;
    ownerName : Text;
    phone : Text;
    email : Text;
    address : Text;
    status : CenterStatus;
    createdAt : Int;
  };
};
