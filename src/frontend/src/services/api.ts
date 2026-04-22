import { useActor } from "@caffeineai/core-infrastructure";
import { createActor } from "../backend";
import type {
  BillingStats,
  BookPatientRequest,
  CollectionCenterPublic,
  DashboardStats,
  LabTest,
  LoginResult,
  PatientPublic,
  PaymentPublic,
  Report,
  SampleStatus,
  Session,
} from "../types";

export function useApiService() {
  const { actor } = useActor(createActor);

  const login = async (
    userId: string,
    password: string,
  ): Promise<LoginResult> => {
    if (!actor) throw new Error("Actor not ready");
    return actor.login(userId, password);
  };

  const logout = async (token: string): Promise<boolean> => {
    if (!actor) return false;
    return actor.logout(token);
  };

  const validateSession = async (token: string): Promise<Session | null> => {
    if (!actor) return null;
    return actor.validateSession(token);
  };

  const getTests = async (): Promise<LabTest[]> => {
    if (!actor) return [];
    return actor.getTests();
  };

  const getTestById = async (id: bigint): Promise<LabTest | null> => {
    if (!actor) return null;
    return actor.getTestById(id);
  };

  const getCenters = async (
    token: string,
  ): Promise<CollectionCenterPublic[]> => {
    if (!actor) return [];
    return actor.getCenters(token);
  };

  const getMyCenter = async (
    token: string,
  ): Promise<CollectionCenterPublic | null> => {
    if (!actor) return null;
    return actor.getMyCenter(token);
  };

  const bookPatient = async (
    token: string,
    req: BookPatientRequest,
  ): Promise<string> => {
    if (!actor) throw new Error("Actor not ready");
    return actor.bookPatient(token, req);
  };

  const trackSample = async (
    token: string,
    searchQuery: string,
  ): Promise<PatientPublic | null> => {
    if (!actor) return null;
    return actor.getPatientByIdOrMobile(token, searchQuery);
  };

  const getPatientsByCenter = async (
    token: string,
  ): Promise<PatientPublic[]> => {
    if (!actor) return [];
    return actor.getPatientsByCenter(token);
  };

  const getAllPatients = async (token: string): Promise<PatientPublic[]> => {
    // Placeholder: will be wired once backend exposes getAllPatients
    if (!actor) return [];
    try {
      const centers = await actor.getCenters(token);
      const results = await Promise.all(
        centers.map(() =>
          actor.getPatientsByCenter(token).catch(() => [] as PatientPublic[]),
        ),
      );
      return results.flat();
    } catch {
      return [];
    }
  };

  const getReportsByCenter = async (
    token: string,
    centerId: string,
    dateFrom: bigint | null,
    dateTo: bigint | null,
  ): Promise<Report[]> => {
    if (!actor) return [];
    return actor.getReportsByCenter(token, centerId, dateFrom, dateTo);
  };

  const getReportsByPatient = async (
    token: string,
    patientId: string,
  ): Promise<Report[]> => {
    if (!actor) return [];
    return actor.getReportsByPatient(token, patientId);
  };

  const getBillingStats = async (
    token: string,
    centerId: string,
  ): Promise<BillingStats> => {
    if (!actor)
      return {
        totalTests: BigInt(0),
        totalCommission: BigInt(0),
        lastPayment: undefined,
      };
    return actor.getBillingStats(token, centerId);
  };

  const getPaymentsByCenter = async (
    token: string,
    centerId: string,
  ): Promise<PaymentPublic[]> => {
    if (!actor) return [];
    return actor.getPaymentsByCenter(token, centerId);
  };

  const updateSampleStatus = async (
    token: string,
    patientId: string,
    status: SampleStatus,
  ): Promise<PatientPublic | null> => {
    if (!actor) return null;
    return actor.updateSampleStatus(token, patientId, status);
  };

  const addCenter = async (
    token: string,
    id: string,
    name: string,
    ownerName: string,
    phone: string,
    email: string,
    address: string,
    password: string,
  ): Promise<boolean> => {
    if (!actor) throw new Error("Actor not ready");
    return actor.addCenter(
      token,
      id,
      name,
      ownerName,
      phone,
      email,
      address,
      password,
    );
  };

  const updateCenter = async (
    token: string,
    id: string,
    name: string,
    ownerName: string,
    phone: string,
    email: string,
    address: string,
  ): Promise<boolean> => {
    if (!actor) throw new Error("Actor not ready");
    return actor.updateCenter(
      token,
      id,
      name,
      ownerName,
      phone,
      email,
      address,
    );
  };

  const setCenterStatus = async (
    token: string,
    id: string,
    active: boolean,
  ): Promise<boolean> => {
    if (!actor) throw new Error("Actor not ready");
    return actor.setCenterStatus(token, id, active);
  };

  const addTest = async (
    token: string,
    name: string,
    category: string,
    sampleType: string,
    tubeType: string,
    fastingRequired: boolean,
    reportTime: string,
    mrpPrice: bigint,
    partnerPrice: bigint,
  ): Promise<bigint> => {
    if (!actor) throw new Error("Actor not ready");
    return actor.addTest(
      token,
      name,
      category,
      sampleType,
      tubeType,
      fastingRequired,
      reportTime,
      mrpPrice,
      partnerPrice,
    );
  };

  const updateTest = async (
    token: string,
    test: import("../types").LabTest,
  ): Promise<boolean> => {
    if (!actor) throw new Error("Actor not ready");
    return actor.updateTest(token, test);
  };

  const deleteTest = async (token: string, id: bigint): Promise<boolean> => {
    if (!actor) throw new Error("Actor not ready");
    return actor.deleteTest(token, id);
  };

  const addPayment = async (
    token: string,
    centerId: string,
    amount: bigint,
    invoiceNumber: string,
    notes: string,
  ): Promise<bigint> => {
    if (!actor) throw new Error("Actor not ready");
    return actor.addPayment(token, centerId, amount, invoiceNumber, notes);
  };

  const markPaymentPaid = async (
    token: string,
    paymentId: bigint,
  ): Promise<boolean> => {
    if (!actor) throw new Error("Actor not ready");
    return actor.markPaymentPaid(token, paymentId);
  };

  const uploadReport = async (
    token: string,
    patientId: string,
    filename: string,
    reportUrl: string,
  ): Promise<bigint> => {
    if (!actor) throw new Error("Actor not ready");
    return actor.uploadReport(token, patientId, filename, reportUrl);
  };

  const getDashboardStats = async (_token: string): Promise<DashboardStats> => {
    // Returns placeholder stats — backend getDashboardStats not yet implemented
    return {
      totalBookings: 0,
      todaysSamples: 0,
      pendingReports: 0,
      thisMonthRevenue: 0,
    };
  };

  return {
    login,
    logout,
    validateSession,
    getTests,
    getTestById,
    getCenters,
    getMyCenter,
    bookPatient,
    trackSample,
    getPatientsByCenter,
    getAllPatients,
    getReportsByCenter,
    getReportsByPatient,
    getBillingStats,
    getPaymentsByCenter,
    updateSampleStatus,
    addCenter,
    updateCenter,
    setCenterStatus,
    addTest,
    updateTest,
    deleteTest,
    addPayment,
    markPaymentPaid,
    uploadReport,
    getDashboardStats,
  };
}
