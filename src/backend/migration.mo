module {
  type OldActor = {};
  type NewActor = { referenceWebsite : ?{ url : Text; designNotes : ?Text } };
  public func run(old : OldActor) : NewActor {
    { referenceWebsite = null };
  };
};
