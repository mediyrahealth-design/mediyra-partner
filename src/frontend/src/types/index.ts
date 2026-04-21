import type {
  BillingStats,
  BookPatientRequest,
  CenterStatus,
  CollectionCenterPublic,
  Gender,
  LabTest,
  LoginResult,
  PatientPublic,
  PaymentPublic,
  PaymentStatus,
  Report,
  Role,
  SampleStatus,
  Session,
} from "../backend.d";

export type {
  LabTest,
  CollectionCenterPublic,
  PatientPublic,
  Report,
  PaymentPublic,
  BillingStats,
  Session,
  BookPatientRequest,
  LoginResult,
  Gender,
  Role,
  SampleStatus,
  CenterStatus,
  PaymentStatus,
};

export interface AuthUser {
  token: string;
  userId: string;
  role: Role;
  centerName?: string;
}

export interface NavItem {
  label: string;
  path: string;
  icon: string;
}
