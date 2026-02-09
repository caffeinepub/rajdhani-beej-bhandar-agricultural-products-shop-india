import Array "mo:core/Array";
import Int "mo:core/Int";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Migration "migration";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Set "mo:core/Set";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

(with migration = Migration.run)
actor {
  public type ReferenceWebsite = {
    url : Text;
    designNotes : ?Text;
  };

  var referenceWebsite : ?ReferenceWebsite = null;

  let supportedLanguages = Set.fromIter(["en", "hi", "ta", "te", "kn", "gu", "mr", "pa", "bn"].values());
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type Category = {
    #fungicide;
    #herbicide;
    #insecticide;
    #pesticide;
    #plantGrowthRegulator;
    #seed;
  };

  public type ProductTranslations = {
    name : Map.Map<Text, Text>;
    description : Map.Map<Text, Text>;
  };

  public type Product = {
    id : Text;
    translations : ProductTranslations;
    images : [Text];
    price : Nat;
    stock : Nat;
    category : Category;
    createdAt : Time.Time;
    minimumOrderQuantity : Nat;
  };

  public type ProductInput = {
    id : Text;
    translations : {
      name : [(Text, Text)];
      description : [(Text, Text)];
    };
    images : [Text];
    price : Nat;
    stock : Nat;
    category : Category;
    createdAt : Time.Time;
    minimumOrderQuantity : Nat;
  };

  public type ImmutableMap<K, V> = {
    entries : [(K, V)];
  };

  public type ProductView = {
    id : Text;
    translations : {
      name : ImmutableMap<Text, Text>;
      description : ImmutableMap<Text, Text>;
    };
    images : [Text];
    price : Nat;
    stock : Nat;
    category : Category;
    createdAt : Time.Time;
    minimumOrderQuantity : Nat;
  };

  module Product {
    public func compare(product1 : Product, product2 : Product) : Order.Order {
      switch (Text.compare(product1.id, product2.id)) {
        case (#equal) { Int.compare(product1.createdAt, product2.createdAt) };
        case (order) { order };
      };
    };
  };

  public type CustomerOrder = {
    id : Text;
    productId : Text;
    quantity : Nat;
    customerName : Text;
    customerAddress : Text;
    customerMobile : Text;
    status : OrderStatus;
    createdAt : Time.Time;
    totalAmount : Nat;
    productName : Text;
    productSummary : Text;
  };

  public type CustomerOrderInput = {
    productId : Text;
    quantity : Nat;
    customerName : Text;
    customerAddress : Text;
    customerMobile : Text;
  };

  public type LandingPageTranslations = {
    heroTitle : Map.Map<Text, Text>;
    heroSubtitle : Map.Map<Text, Text>;
  };

  public type LandingPageTranslationsView = {
    heroTitle : ImmutableMap<Text, Text>;
    heroSubtitle : ImmutableMap<Text, Text>;
  };

  public type OrderStatus = {
    #pending;
    #confirmed;
    #completed;
    #cancelled;
  };

  public type UserProfile = {
    name : Text;
  };

  let products = Map.empty<Text, Product>();
  let customerOrders = Map.empty<Text, CustomerOrder>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  let landingPageTranslations : LandingPageTranslations = {
    heroTitle = Map.empty<Text, Text>();
    heroSubtitle = Map.empty<Text, Text>();
  };

  func toImmutableMap<K, V>(map : Map.Map<K, V>) : ImmutableMap<K, V> {
    { entries = map.toArray() };
  };

  func toProductView(product : Product) : ProductView {
    {
      id = product.id;
      translations = {
        name = toImmutableMap(product.translations.name);
        description = toImmutableMap(product.translations.description);
      };
      images = product.images;
      price = product.price;
      stock = product.stock;
      category = product.category;
      createdAt = product.createdAt;
      minimumOrderQuantity = product.minimumOrderQuantity;
    };
  };

  func toLandingPageTranslationsView(landingPageTranslations : LandingPageTranslations) : LandingPageTranslationsView {
    {
      heroTitle = toImmutableMap(landingPageTranslations.heroTitle);
      heroSubtitle = toImmutableMap(landingPageTranslations.heroSubtitle);
    };
  };

  public shared ({ caller }) func setReferenceWebsite(reference : ReferenceWebsite) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set reference website");
    };
    referenceWebsite := ?reference;
  };

  public query ({ caller }) func getReferenceWebsite() : async ?ReferenceWebsite {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view reference website");
    };
    referenceWebsite;
  };

  public query ({ caller }) func getProductsByCategory(category : Category, language : Text) : async [ProductView] {
    let filtered = products.values().toArray().filter(
      func(product) { product.category == category }
    );
    filtered.sort().map(toProductView);
  };

  public query ({ caller }) func getAllProducts(_ : Text) : async [ProductView] {
    let sorted = products.values().toArray().sort();
    if (sorted.size() == 0) {
      [];
    } else {
      sorted.map(toProductView);
    };
  };

  public query ({ caller }) func getOrdersByStatus(status : OrderStatus) : async [CustomerOrder] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view orders");
    };
    let filteredOrders = customerOrders.toArray().filter(
      func((_, order)) {
        order.status == status;
      }
    );
    filteredOrders.map(func((_, order)) { order });
  };

  public query ({ caller }) func getCustomerOrder(orderId : Text) : async ?CustomerOrder {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view order details");
    };
    customerOrders.get(orderId);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getLandingPageTranslations(_ : Text) : async LandingPageTranslationsView {
    toLandingPageTranslationsView(landingPageTranslations);
  };

  public shared ({ caller }) func updateLandingPageTranslation(language : Text, title : Text, subtitle : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update translations");
    };

    switch (supportedLanguages.contains(language)) {
      case (true) {};
      case (false) { Runtime.trap("Language not supported: " # language) };
    };

    landingPageTranslations.heroTitle.add(language, title);
    landingPageTranslations.heroSubtitle.add(language, subtitle);
  };

  public query ({ caller }) func getProductTranslations(_ : Text, productId : Text) : async ?ProductView {
    switch (products.get(productId)) {
      case (?product) { ?toProductView(product) };
      case (null) { null };
    };
  };

  public shared ({ caller }) func updateProductTranslations(
    productId : Text,
    language : Text,
    name : Text,
    description : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update translations");
    };

    switch (products.get(productId)) {
      case (?existingProduct) {
        existingProduct.translations.name.add(language, name);
        existingProduct.translations.description.add(language, description);
        products.add(productId, existingProduct);
      };
      case (null) { Runtime.trap("Product not found: " # productId) };
    };
  };

  func toProduct(productInput : ProductInput) : Product {
    {
      id = productInput.id;
      translations = {
        name = Map.fromIter<Text, Text>(productInput.translations.name.values());
        description = Map.fromIter<Text, Text>(productInput.translations.description.values());
      };
      images = productInput.images;
      price = productInput.price;
      stock = productInput.stock;
      category = productInput.category;
      createdAt = productInput.createdAt;
      minimumOrderQuantity = productInput.minimumOrderQuantity;
    };
  };

  public shared ({ caller }) func createProduct(productInput : ProductInput) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create products");
    };
    if (products.containsKey(productInput.id)) {
      Runtime.trap("Product with that ID already exists");
    };
    let product = toProduct(productInput);
    products.add(productInput.id, product);
  };

  public shared ({ caller }) func updateProduct(productId : Text, productInput : ProductInput) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    if (not products.containsKey(productId)) {
      Runtime.trap("Product with ID " # productId # " does not exist");
    };
    let product = toProduct(productInput);
    products.add(productId, product);
  };

  public shared ({ caller }) func deleteProduct(productId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    if (not products.containsKey(productId)) {
      Runtime.trap("Product with ID " # productId # " does not exist");
    };
    products.remove(productId);
  };

  public shared ({ caller }) func createCustomerOrder(
    customerOrder : CustomerOrderInput
  ) : async ?CustomerOrder {
    if (customerOrder.customerMobile == "") {
      Runtime.trap("Mobile number cannot be empty");
    };

    let product = switch (products.get(customerOrder.productId)) {
      case (null) {
        Runtime.trap("Product with that ID does not exist");
      };
      case (?product) { product };
    };

    if (product.stock < customerOrder.quantity) {
      Runtime.trap("Not enough stock. Only " # product.stock.toText() # " left.");
    };

    let order : CustomerOrder = {
      id = (customerOrders.size() + 1 : Nat).toText();
      productId = product.id;
      quantity = customerOrder.quantity;
      customerName = customerOrder.customerName;
      customerAddress = customerOrder.customerAddress;
      customerMobile = customerOrder.customerMobile;
      status = #pending;
      createdAt = Time.now();
      totalAmount = product.price * customerOrder.quantity;
      productName = switch (product.translations.name.get("en")) {
        case (?english) { english };
        case (null) { "" };
      };
      productSummary = switch (product.translations.description.get("en")) {
        case (?english) { english };
        case (null) { "" };
      };
    };

    customerOrders.add(order.id, order);
    ?order;
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Text, newStatus : OrderStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };
    let order = switch (customerOrders.get(orderId)) {
      case (null) {
        Runtime.trap("Order with ID " # orderId # " does not exist");
      };
      case (?order) { order };
    };
    let updatedOrder : CustomerOrder = {
      id = order.id;
      productId = order.productId;
      quantity = order.quantity;
      customerName = order.customerName;
      customerAddress = order.customerAddress;
      customerMobile = order.customerMobile;
      status = newStatus;
      createdAt = order.createdAt;
      totalAmount = order.totalAmount;
      productName = order.productName;
      productSummary = order.productSummary;
    };
    customerOrders.add(orderId, updatedOrder);
  };
};
