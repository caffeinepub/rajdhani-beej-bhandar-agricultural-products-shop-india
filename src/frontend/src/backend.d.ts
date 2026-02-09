import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CustomerOrder {
    id: string;
    customerName: string;
    status: OrderStatus;
    createdAt: Time;
    customerMobile: string;
    productId: string;
    productName: string;
    productType: ProductType;
    customerAddress: string;
    totalAmount: bigint;
    quantity: bigint;
    productSummary: string;
}
export interface ProductInput {
    id: string;
    createdAt: Time;
    stock: bigint;
    minimumOrderQuantity: bigint;
    category: Category;
    translations: {
        name: Array<[string, string]>;
        description: Array<[string, string]>;
    };
    price: bigint;
    images: Array<string>;
}
export type Time = bigint;
export interface Agent {
    principal: Principal;
    username: string;
    password: string;
    agentRole: string;
    mobileNumber: string;
}
export interface ImmutableMap {
    entries: Array<[string, string]>;
}
export interface AgentInput {
    username: string;
    password: string;
    agentRole: string;
    mobileNumber: string;
}
export interface ProductView {
    id: string;
    createdAt: Time;
    stock: bigint;
    minimumOrderQuantity: bigint;
    category: Category;
    translations: {
        name: ImmutableMap;
        description: ImmutableMap;
    };
    price: bigint;
    images: Array<string>;
}
export interface LandingPageTranslationsView {
    heroSubtitle: ImmutableMap;
    heroTitle: ImmutableMap;
}
export interface CustomerOrderInput {
    customerName: string;
    customerMobile: string;
    productId: string;
    productType: ProductType;
    customerAddress: string;
    quantity: bigint;
}
export interface ReferenceWebsite {
    url: string;
    description: string;
}
export interface AboutUsContentTranslationsView {
    title: Array<[string, string]>;
    content: Array<[string, string]>;
}
export interface UserProfile {
    name: string;
}
export enum Category {
    seed = "seed",
    kitchenGarden = "kitchenGarden",
    pesticide = "pesticide",
    herbicide = "herbicide",
    machine = "machine",
    plantGrowthRegulator = "plantGrowthRegulator",
    fungicide = "fungicide",
    insecticide = "insecticide"
}
export enum OrderStatus {
    cancelled = "cancelled",
    pending = "pending",
    completed = "completed",
    confirmed = "confirmed"
}
export enum ProductType {
    agriProduct = "agriProduct",
    kitchenGarden = "kitchenGarden",
    machine = "machine"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    agentLogin(mobileNumber: string, password: string): Promise<boolean>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createAgent(adminSessionToken: string, agentInput: AgentInput, agentPrincipal: Principal): Promise<void>;
    createCustomerOrder(customerOrder: CustomerOrderInput): Promise<CustomerOrder | null>;
    createProduct(adminSessionToken: string, productInput: ProductInput): Promise<void>;
    deleteAgent(adminSessionToken: string, mobileNumber: string): Promise<void>;
    deleteProduct(adminSessionToken: string, productId: string): Promise<void>;
    getAboutUs(arg0: string): Promise<AboutUsContentTranslationsView | null>;
    getAgent(adminSessionToken: string, mobileNumber: string): Promise<Agent | null>;
    getAgentOrders(): Promise<Array<CustomerOrder>>;
    getAllAgents(adminSessionToken: string): Promise<Array<Agent>>;
    getAllProducts(arg0: string): Promise<Array<ProductView>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCustomerOrder(adminSessionToken: string, orderId: string): Promise<CustomerOrder | null>;
    getKitchenGardenProducts(): Promise<Array<ProductView>>;
    getLandingPageTranslations(arg0: string): Promise<LandingPageTranslationsView>;
    getMachineProducts(): Promise<Array<ProductView>>;
    getOrdersByStatus(adminSessionToken: string, status: OrderStatus): Promise<Array<CustomerOrder>>;
    getProductTranslations(arg0: string, productId: string): Promise<ProductView | null>;
    getProductsByCategory(category: Category, language: string): Promise<Array<ProductView>>;
    getReferenceWebsite(arg0: string): Promise<ReferenceWebsite | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setReferenceWebsite(adminSessionToken: string, reference: ReferenceWebsite): Promise<void>;
    updateAboutUsTranslation(adminSessionToken: string, language: string, title: string, content: string): Promise<void>;
    updateAgent(adminSessionToken: string, mobileNumber: string, updatedAgent: AgentInput): Promise<void>;
    updateLandingPageTranslation(adminSessionToken: string, language: string, title: string, subtitle: string): Promise<void>;
    updateOrderStatus(adminSessionToken: string, orderId: string, newStatus: OrderStatus): Promise<void>;
    updateProduct(adminSessionToken: string, productId: string, productInput: ProductInput): Promise<void>;
    updateProductTranslations(adminSessionToken: string, productId: string, language: string, name: string, description: string): Promise<void>;
}
