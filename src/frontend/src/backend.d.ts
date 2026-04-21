import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface BookPatientRequest {
    age: bigint;
    name: string;
    refDoctor: string;
    gender: Gender;
    testIds: Array<bigint>;
    mobile: string;
}
export interface CollectionCenterPublic {
    id: string;
    status: CenterStatus;
    ownerName: string;
    name: string;
    createdAt: bigint;
    email: string;
    address: string;
    phone: string;
}
export interface PatientPublic {
    id: string;
    age: bigint;
    status: SampleStatus;
    name: string;
    refDoctor: string;
    centerId: string;
    bookingDate: bigint;
    gender: Gender;
    testIds: Array<bigint>;
    mobile: string;
}
export interface PaymentPublic {
    id: bigint;
    status: PaymentStatus;
    date: bigint;
    invoiceNumber: string;
    centerId: string;
    notes: string;
    amount: bigint;
}
export interface Report {
    id: bigint;
    reportUrl: string;
    patientId: string;
    filename: string;
    centerId: string;
    uploadedAt: bigint;
}
export interface LabTest {
    id: bigint;
    mrpPrice: bigint;
    fastingRequired: boolean;
    name: string;
    sampleType: string;
    tubeType: string;
    reportTime: string;
    category: string;
    partnerPrice: bigint;
}
export interface Session {
    token: string;
    userId: string;
    createdAt: bigint;
    role: Role;
}
export type LoginResult = {
    __kind__: "ok";
    ok: Session;
} | {
    __kind__: "err";
    err: string;
};
export interface BillingStats {
    totalTests: bigint;
    totalCommission: bigint;
    lastPayment?: PaymentPublic;
}
export enum CenterStatus {
    active = "active",
    inactive = "inactive"
}
export enum Gender {
    other = "other",
    female = "female",
    male = "male"
}
export enum PaymentStatus {
    pending = "pending",
    paid = "paid"
}
export enum Role {
    admin = "admin",
    collectionCenter = "collectionCenter"
}
export enum SampleStatus {
    sampleReceived = "sampleReceived",
    sampleCollected = "sampleCollected",
    reportReady = "reportReady",
    processing = "processing"
}
export interface backendInterface {
    addCenter(token: string, id: string, name: string, ownerName: string, phone: string, email: string, address: string, password: string): Promise<boolean>;
    addPayment(token: string, centerId: string, amount: bigint, invoiceNumber: string, notes: string): Promise<bigint>;
    addTest(token: string, name: string, category: string, sampleType: string, tubeType: string, fastingRequired: boolean, reportTime: string, mrpPrice: bigint, partnerPrice: bigint): Promise<bigint>;
    bookPatient(token: string, req: BookPatientRequest): Promise<string>;
    deleteTest(token: string, id: bigint): Promise<boolean>;
    getBillingStats(token: string, centerId: string): Promise<BillingStats>;
    getCenterById(token: string, id: string): Promise<CollectionCenterPublic | null>;
    getCenters(token: string): Promise<Array<CollectionCenterPublic>>;
    getMyCenter(token: string): Promise<CollectionCenterPublic | null>;
    getPatientByIdOrMobile(token: string, searchQuery: string): Promise<PatientPublic | null>;
    getPatientsByCenter(token: string): Promise<Array<PatientPublic>>;
    getPaymentsByCenter(token: string, centerId: string): Promise<Array<PaymentPublic>>;
    getReportsByCenter(token: string, centerId: string, dateFrom: bigint | null, dateTo: bigint | null): Promise<Array<Report>>;
    getReportsByPatient(token: string, patientId: string): Promise<Array<Report>>;
    getTestById(id: bigint): Promise<LabTest | null>;
    getTests(): Promise<Array<LabTest>>;
    login(userId: string, password: string): Promise<LoginResult>;
    logout(token: string): Promise<boolean>;
    markPaymentPaid(token: string, paymentId: bigint): Promise<boolean>;
    setCenterStatus(token: string, id: string, active: boolean): Promise<boolean>;
    updateCenter(token: string, id: string, name: string, ownerName: string, phone: string, email: string, address: string): Promise<boolean>;
    updateSampleStatus(token: string, patientId: string, status: SampleStatus): Promise<PatientPublic | null>;
    updateTest(token: string, test: LabTest): Promise<boolean>;
    uploadReport(token: string, patientId: string, filename: string, reportUrl: string): Promise<bigint>;
    validateSession(token: string): Promise<Session | null>;
}
