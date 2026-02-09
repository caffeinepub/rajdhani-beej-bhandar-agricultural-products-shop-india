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
    customerAddress: string;
    quantity: bigint;
}
export interface ImmutableMap {
    entries: Array<[string, string]>;
}
export interface ReferenceWebsite {
    url: string;
    designNotes?: string;
}
export interface UserProfile {
    name: string;
}
export enum Category {
    seed = "seed",
    pesticide = "pesticide",
    herbicide = "herbicide",
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
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCustomerOrder(customerOrder: CustomerOrderInput): Promise<CustomerOrder | null>;
    createProduct(productInput: ProductInput): Promise<void>;
    deleteProduct(productId: string): Promise<void>;
    getAllProducts(arg0: string): Promise<Array<ProductView>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCustomerOrder(orderId: string): Promise<CustomerOrder | null>;
    getLandingPageTranslations(arg0: string): Promise<LandingPageTranslationsView>;
    getOrdersByStatus(status: OrderStatus): Promise<Array<CustomerOrder>>;
    getProductTranslations(arg0: string, productId: string): Promise<ProductView | null>;
    getProductsByCategory(category: Category, language: string): Promise<Array<ProductView>>;
    getReferenceWebsite(): Promise<ReferenceWebsite | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setReferenceWebsite(reference: ReferenceWebsite): Promise<void>;
    updateLandingPageTranslation(language: string, title: string, subtitle: string): Promise<void>;
    updateOrderStatus(orderId: string, newStatus: OrderStatus): Promise<void>;
    updateProduct(productId: string, productInput: ProductInput): Promise<void>;
    updateProductTranslations(productId: string, language: string, name: string, description: string): Promise<void>;
}
