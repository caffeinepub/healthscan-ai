import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Abstract {
    id: string;
    title: string;
    methods: string;
    author: string;
    creativeProcess: string;
    mainFinding: string;
}
export interface ScientificResource {
    id: string;
    doi: string;
    title: string;
    source: string;
    author: string;
    relevance: number;
    abstractId: string;
}
export interface Statistics {
    id: string;
    measurementId: string;
    mean: number;
    author: string;
    standardDeviation: number;
    median: number;
}
export interface Report {
    id: string;
    doi: string;
    title: string;
    methods: string;
    results: string;
    author: string;
    imageIds: Array<string>;
    findings: string;
    abstractId: string;
    uploadDate: bigint;
}
export interface PatientGroup {
    id: string;
    name: string;
    description: string;
    author: string;
    objectCount: bigint;
}
export interface Fact {
    id: string;
    validated: boolean;
    description: string;
    author: string;
}
export interface MedicalInnovation {
    id: string;
    title: string;
    kind: string;
    description: string;
    author: string;
    abstractId: string;
}
export interface Measurement {
    id: string;
    findingId: string;
    value: number;
    unit: string;
    author: string;
    standard: string;
}
export interface MedicalFact {
    id: string;
    validated: boolean;
    description: string;
    author: string;
}
export interface Image {
    id: string;
    reportsId: string;
    imageData: ExternalBlob;
    description: string;
    author: string;
}
export interface CatalogCode {
    code: string;
    description: string;
    author: string;
    findingsId: string;
    reportId: string;
}
export interface TechReport {
    id: string;
    toolsUsed: string;
    title: string;
    author: string;
    creativeProcess: string;
    findings: string;
}
export interface Finding {
    id: string;
    title: string;
    description: string;
    author: string;
    reportId: string;
}
export interface AbstractSearchTerm {
    id: string;
    term: string;
    author: string;
}
export interface ReportSection {
    id: string;
    title: string;
    content: string;
    order: bigint;
    author: string;
    reportId: string;
}
export interface DataSet {
    id: string;
    source: string;
    description: string;
    author: string;
}
export interface Connection {
    id: string;
    insights: string;
    title: string;
    sourceReportId: string;
    findingsId: string;
    targetReportId: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    complexSearch(term: string): Promise<{
        techReports: Array<TechReport>;
        reports: Array<Report>;
        abstracts: Array<Abstract>;
    }>;
    deleteAbstract(id: string): Promise<void>;
    deleteAbstractSearchTerm(id: string): Promise<void>;
    deleteCatalogCode(code: string): Promise<void>;
    deleteConnection(id: string): Promise<void>;
    deleteDataSet(id: string): Promise<void>;
    deleteFact(id: string): Promise<void>;
    deleteFinding(id: string): Promise<void>;
    deleteImage(id: string): Promise<void>;
    deleteMeasurement(id: string): Promise<void>;
    deleteMedicalFact(id: string): Promise<void>;
    deleteMedicalInnovation(id: string): Promise<void>;
    deletePatientGroup(id: string): Promise<void>;
    deleteReport(id: string): Promise<void>;
    deleteReportSection(id: string): Promise<void>;
    deleteScientificResource(id: string): Promise<void>;
    deleteStatistics(id: string): Promise<void>;
    deleteTechReport(id: string): Promise<void>;
    getAbstract(id: string): Promise<Abstract | null>;
    getAbstractSearchTerm(id: string): Promise<AbstractSearchTerm | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCatalogCode(code: string): Promise<CatalogCode | null>;
    getConnection(id: string): Promise<Connection | null>;
    getDataSet(id: string): Promise<DataSet | null>;
    getFact(id: string): Promise<Fact | null>;
    getFinding(id: string): Promise<Finding | null>;
    getImage(id: string): Promise<Image | null>;
    getMeasurement(id: string): Promise<Measurement | null>;
    getMedicalFact(id: string): Promise<MedicalFact | null>;
    getMedicalInnovation(id: string): Promise<MedicalInnovation | null>;
    getPatientGroup(id: string): Promise<PatientGroup | null>;
    getReport(id: string): Promise<Report | null>;
    getReportSection(id: string): Promise<ReportSection | null>;
    getScientificResource(id: string): Promise<ScientificResource | null>;
    getStatistics(id: string): Promise<Statistics | null>;
    getTechReport(id: string): Promise<TechReport | null>;
    isCallerAdmin(): Promise<boolean>;
    /**
     * / Actor Methods
     */
    saveAbstract(abstract: Abstract): Promise<void>;
    saveAbstractSearchTerm(abstractSearchTerm: AbstractSearchTerm): Promise<void>;
    saveCatalogCode(catalogCode: CatalogCode): Promise<void>;
    saveConnection(connection: Connection): Promise<void>;
    saveDataSet(dataSet: DataSet): Promise<void>;
    saveFact(fact: Fact): Promise<void>;
    saveFinding(finding: Finding): Promise<void>;
    saveImage(image: Image): Promise<void>;
    saveMeasurement(measurement: Measurement): Promise<void>;
    saveMedicalFact(medicalFact: MedicalFact): Promise<void>;
    saveMedicalInnovation(medicalInnovation: MedicalInnovation): Promise<void>;
    savePatientGroup(patientGroup: PatientGroup): Promise<void>;
    saveReport(report: Report): Promise<void>;
    saveReportSection(reportSection: ReportSection): Promise<void>;
    saveScientificResource(scientificResource: ScientificResource): Promise<void>;
    saveStatistics(statisticsRecord: Statistics): Promise<void>;
    saveTechReport(techReport: TechReport): Promise<void>;
    searchAbstracts(term: string): Promise<Array<Abstract>>;
    searchReports(term: string): Promise<Array<Report>>;
    searchTechReports(term: string): Promise<Array<TechReport>>;
    updateAbstract(id: string, newAbstract: Abstract): Promise<void>;
    updateAbstractSearchTerm(id: string, newAbstractSearchTerm: AbstractSearchTerm): Promise<void>;
    updateCatalogCode(code: string, newCatalogCode: CatalogCode): Promise<void>;
    updateConnection(id: string, newConnection: Connection): Promise<void>;
    updateDataSet(id: string, newDataSet: DataSet): Promise<void>;
    updateFact(id: string, newFact: Fact): Promise<void>;
    updateFinding(id: string, newFinding: Finding): Promise<void>;
    updateMeasurement(id: string, newMeasurement: Measurement): Promise<void>;
    updateMedicalFact(id: string, newMedicalFact: MedicalFact): Promise<void>;
    updateMedicalInnovation(id: string, newMedicalInnovation: MedicalInnovation): Promise<void>;
    updatePatientGroup(id: string, newPatientGroup: PatientGroup): Promise<void>;
    updateReport(id: string, newReport: Report): Promise<void>;
    updateReportSection(id: string, newReportSection: ReportSection): Promise<void>;
    updateScientificResource(id: string, newScientificResource: ScientificResource): Promise<void>;
    updateStatistics(id: string, newStatistics: Statistics): Promise<void>;
    updateTechReport(id: string, newTechReport: TechReport): Promise<void>;
}
