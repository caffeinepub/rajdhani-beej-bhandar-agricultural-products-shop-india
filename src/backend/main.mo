import Array "mo:core/Array";
import Int "mo:core/Int";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Set "mo:core/Set";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";



actor {
  type Translations = Map.Map<Text, Text>;

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type ReferenceWebsite = {
    url : Text;
    description : Text;
  };

  public type AboutUsContentTranslations = {
    title : Translations;
    content : Translations;
  };

  public type AboutUsContentTranslationsView = {
    title : [(Text, Text)];
    content : [(Text, Text)];
  };

  func defaultReferenceWebsite() : ReferenceWebsite {
    {
      url = "";
      description = "";
    };
  };

  var referenceWebsite : ?ReferenceWebsite = ?defaultReferenceWebsite();
  let supportedLanguages = Set.fromIter(["en", "hi", "ta", "te", "kn", "gu", "mr", "pa", "bn"].values());

  public type Category = {
    #fungicide;
    #herbicide;
    #insecticide;
    #pesticide;
    #plantGrowthRegulator;
    #seed;
    #machine;
    #kitchenGarden;
  };

  public type ProductTranslations = {
    name : Translations;
    description : Translations;
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

  public type ProductType = {
    #agriProduct;
    #machine;
    #kitchenGarden;
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
    productType : ProductType;
  };

  public type CustomerOrderInput = {
    productId : Text;
    quantity : Nat;
    customerName : Text;
    customerAddress : Text;
    customerMobile : Text;
    productType : ProductType;
  };

  public type LandingPageTranslations = {
    heroTitle : Translations;
    heroSubtitle : Translations;
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

  public type Agent = {
    username : Text;
    mobileNumber : Text;
    password : Text;
    agentRole : Text;
    principal : Principal;
  };

  public type AgentInput = {
    username : Text;
    mobileNumber : Text;
    password : Text;
    agentRole : Text;
  };

  let products = Map.empty<Text, Product>();
  let customerOrders = Map.empty<Text, CustomerOrder>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let agents = Map.empty<Text, Agent>();
  let agentPrincipals = Map.empty<Principal, Text>();

  let landingPageTranslations : LandingPageTranslations = {
    heroTitle = Map.empty<Text, Text>();
    heroSubtitle = Map.empty<Text, Text>();
  };

  var aboutUsContent : ?AboutUsContentTranslations = ?{
    title = Map.empty<Text, Text>();
    content = Map.empty<Text, Text>();
  };

  let adminSessionToken : Text = "QOCb5ncoyBmax3denemyuw3phcymdpFE";

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

  func toAboutUsContentTranslationsView(content : AboutUsContentTranslations) : AboutUsContentTranslationsView {
    {
      title = content.title.toArray();
      content = content.content.toArray();
    };
  };

  public shared ({ caller }) func setReferenceWebsite(adminSessionToken_ : Text, reference : ReferenceWebsite) : async () {
    if (adminSessionToken_ != adminSessionToken) {
      Runtime.trap("Authorization failed: Invalid admin session token");
    };
    referenceWebsite := ?reference;
  };

  public query ({ caller }) func getReferenceWebsite(_ : Text) : async ?ReferenceWebsite {
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

  public query ({ caller }) func getOrdersByStatus(adminSessionToken_ : Text, status : OrderStatus) : async [CustomerOrder] {
    if (adminSessionToken_ != adminSessionToken) {
      Runtime.trap("Authorization failed: Invalid admin session token");
    };
    let filteredOrders = customerOrders.toArray().filter(
      func((_, order)) {
        order.status == status;
      }
    );
    filteredOrders.map(func((_, order)) { order });
  };

  public query ({ caller }) func getCustomerOrder(adminSessionToken_ : Text, orderId : Text) : async ?CustomerOrder {
    if (adminSessionToken_ != adminSessionToken) {
      Runtime.trap("Authorization failed: Invalid admin session token");
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

  public shared ({ caller }) func updateLandingPageTranslation(adminSessionToken_ : Text, language : Text, title : Text, subtitle : Text) : async () {
    if (adminSessionToken_ != adminSessionToken) {
      Runtime.trap("Authorization failed: Invalid admin session token");
    };

    switch (supportedLanguages.contains(language)) {
      case (true) {};
      case (false) { Runtime.trap("Language not supported: " # language) };
    };

    landingPageTranslations.heroTitle.add(language, title);
    landingPageTranslations.heroSubtitle.add(language, subtitle);
  };

  public shared ({ caller }) func updateAboutUsTranslation(
    adminSessionToken_ : Text,
    language : Text,
    title : Text,
    content : Text,
  ) : async () {
    if (adminSessionToken_ != adminSessionToken) {
      Runtime.trap("Authorization failed: Invalid admin session token");
    };

    switch (supportedLanguages.contains(language)) {
      case (true) {};
      case (false) { Runtime.trap("Language not supported: " # language) };
    };

    let current = switch (aboutUsContent) {
      case (null) {
        Runtime.trap("Missing About Us content");
      };
      case (?content) {
        content;
      };
    };

    current.title.add(language, title);
    current.content.add(language, content);
  };

  public query ({ caller }) func getAboutUs(_ : Text) : async ?AboutUsContentTranslationsView {
    switch (aboutUsContent) {
      case (null) { null };
      case (?content) { ?toAboutUsContentTranslationsView(content) };
    };
  };

  public query ({ caller }) func getProductTranslations(_ : Text, productId : Text) : async ?ProductView {
    switch (products.get(productId)) {
      case (?product) { ?toProductView(product) };
      case (null) { null };
    };
  };

  public shared ({ caller }) func updateProductTranslations(
    adminSessionToken_ : Text,
    productId : Text,
    language : Text,
    name : Text,
    description : Text,
  ) : async () {
    if (adminSessionToken_ != adminSessionToken) {
      Runtime.trap("Authorization failed: Invalid admin session token");
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

  public shared ({ caller }) func createProduct(adminSessionToken_ : Text, productInput : ProductInput) : async () {
    if (adminSessionToken_ != adminSessionToken) {
      Runtime.trap("Authorization failed: Invalid admin session token");
    };
    if (products.containsKey(productInput.id)) {
      Runtime.trap("Product with that ID already exists");
    };
    let product = toProduct(productInput);
    products.add(productInput.id, product);
  };

  public shared ({ caller }) func updateProduct(adminSessionToken_ : Text, productId : Text, productInput : ProductInput) : async () {
    if (adminSessionToken_ != adminSessionToken) {
      Runtime.trap("Authorization failed: Invalid admin session token");
    };
    if (not products.containsKey(productId)) {
      Runtime.trap("Product with ID " # productId # " does not exist");
    };
    let product = toProduct(productInput);
    products.add(productId, product);
  };

  public shared ({ caller }) func deleteProduct(adminSessionToken_ : Text, productId : Text) : async () {
    if (adminSessionToken_ != adminSessionToken) {
      Runtime.trap("Authorization failed: Invalid admin session token");
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
      productType = customerOrder.productType;
    };

    customerOrders.add(order.id, order);
    ?order;
  };

  public shared ({ caller }) func updateOrderStatus(adminSessionToken_ : Text, orderId : Text, newStatus : OrderStatus) : async () {
    if (adminSessionToken_ != adminSessionToken) {
      Runtime.trap("Authorization failed: Invalid admin session token");
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
      productType = order.productType;
    };
    customerOrders.add(orderId, updatedOrder);
  };

  // Agent CRUD implementation - Admin only
  public shared ({ caller }) func createAgent(adminSessionToken_ : Text, agentInput : AgentInput, agentPrincipal : Principal) : async () {
    if (adminSessionToken_ != adminSessionToken) {
      Runtime.trap("Authorization failed: Invalid admin session token");
    };

    if (agents.containsKey(agentInput.mobileNumber)) {
      Runtime.trap("Agent with this mobile number already exists");
    };

    agents.add(agentInput.mobileNumber, {
      username = agentInput.username;
      mobileNumber = agentInput.mobileNumber;
      password = agentInput.password;
      agentRole = agentInput.agentRole;
      principal = agentPrincipal;
    });

    agentPrincipals.add(agentPrincipal, agentInput.mobileNumber);
  };

  public shared ({ caller }) func updateAgent(adminSessionToken_ : Text, mobileNumber : Text, updatedAgent : AgentInput) : async () {
    if (adminSessionToken_ != adminSessionToken) {
      Runtime.trap("Authorization failed: Invalid admin session token");
    };

    let existingAgent = switch (agents.get(mobileNumber)) {
      case (null) {
        Runtime.trap("Agent not found");
      };
      case (?agent) { agent };
    };

    agents.add(
      mobileNumber,
      {
        username = updatedAgent.username;
        mobileNumber = updatedAgent.mobileNumber;
        password = updatedAgent.password;
        agentRole = updatedAgent.agentRole;
        principal = existingAgent.principal;
      },
    );
  };

  public shared ({ caller }) func deleteAgent(adminSessionToken_ : Text, mobileNumber : Text) : async () {
    if (adminSessionToken_ != adminSessionToken) {
      Runtime.trap("Authorization failed: Invalid admin session token");
    };

    let agent = switch (agents.get(mobileNumber)) {
      case (null) {
        Runtime.trap("Agent not found");
      };
      case (?agent) { agent };
    };

    agents.remove(mobileNumber);
    agentPrincipals.remove(agent.principal);
  };

  public query ({ caller }) func getAgent(adminSessionToken_ : Text, mobileNumber : Text) : async ?Agent {
    if (adminSessionToken_ != adminSessionToken) {
      Runtime.trap("Authorization failed: Invalid admin session token");
    };
    agents.get(mobileNumber);
  };

  public query ({ caller }) func getAllAgents(adminSessionToken_ : Text) : async [Agent] {
    if (adminSessionToken_ != adminSessionToken) {
      Runtime.trap("Authorization failed: Invalid admin session token");
    };
    agents.values().toArray();
  };

  // Agent Login - returns success/failure, authentication is via Internet Identity
  public shared ({ caller }) func agentLogin(mobileNumber : Text, password : Text) : async Bool {
    switch (agents.get(mobileNumber)) {
      case (null) {
        false;
      };
      case (?agent) {
        if (agent.password == password and agent.principal == caller) {
          true;
        } else { false };
      };
    };
  };

  // Agent read-only access to orders - must be authenticated agent
  public query ({ caller }) func getAgentOrders() : async [CustomerOrder] {
    switch (agentPrincipals.get(caller)) {
      case (null) {
        Runtime.trap("Unauthorized: Only authenticated agents can view orders");
      };
      case (?_) {
        customerOrders.values().toArray();
      };
    };
  };

  // Machine and Kitchen Garden Products - public access
  public query ({ caller }) func getMachineProducts() : async [ProductView] {
    let filtered = products.values().toArray().filter(
      func(product) { product.category == #machine }
    );
    filtered.sort().map(toProductView);
  };

  public query ({ caller }) func getKitchenGardenProducts() : async [ProductView] {
    let filtered = products.values().toArray().filter(
      func(product) { product.category == #kitchenGarden }
    );
    filtered.sort().map(toProductView);
  };
};
