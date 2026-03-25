import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Option "mo:core/Option";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
actor {
  /// Types
  type Abstract = {
    id : Text;
    creativeProcess : Text;
    title : Text;
    mainFinding : Text;
    methods : Text;
    author : Text;
  };

  type Report = {
    id : Text;
    abstractId : Text;
    title : Text;
    methods : Text;
    results : Text;
    uploadDate : Int;
    findings : Text;
    imageIds : [Text];
    doi : Text;
    author : Text;
  };

  type Connection = {
    id : Text;
    sourceReportId : Text;
    targetReportId : Text;
    findingsId : Text;
    title : Text;
    insights : Text;
  };

  type Measurement = {
    id : Text;
    value : Float;
    unit : Text;
    standard : Text;
    findingId : Text;
    author : Text;
  };

  type TechReport = {
    id : Text;
    creativeProcess : Text;
    title : Text;
    findings : Text;
    toolsUsed : Text;
    author : Text;
  };

  type Fact = {
    id : Text;
    description : Text;
    validated : Bool;
    author : Text;
  };

  type MedicalFact = {
    id : Text;
    description : Text;
    validated : Bool;
    author : Text;
  };

  type Statistics = {
    id : Text;
    mean : Float;
    median : Float;
    standardDeviation : Float;
    measurementId : Text;
    author : Text;
  };

  type DataSet = {
    id : Text;
    description : Text;
    source : Text;
    author : Text;
  };

  type PatientGroup = {
    id : Text;
    name : Text;
    description : Text;
    objectCount : Nat;
    author : Text;
  };

  type ScientificResource = {
    id : Text;
    abstractId : Text;
    author : Text;
    title : Text;
    source : Text;
    doi : Text;
    relevance : Nat8;
  };

  type MedicalInnovation = {
    id : Text;
    abstractId : Text;
    kind : Text;
    title : Text;
    description : Text;
    author : Text;
  };

  type CatalogCode = {
    code : Text;
    findingsId : Text;
    reportId : Text;
    description : Text;
    author : Text;
  };

  type AbstractSearchTerm = {
    id : Text;
    term : Text;
    author : Text;
  };

  type ReportSection = {
    id : Text;
    reportId : Text;
    title : Text;
    content : Text;
    order : Nat;
    author : Text;
  };

  type Finding = {
    id : Text;
    reportId : Text;
    title : Text;
    description : Text;
    author : Text;
  };

  type Image = {
    id : Text;
    reportsId : Text;
    imageData : Storage.ExternalBlob;
    description : Text;
    author : Text;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  /// Internal Storage
  let abstracts = Map.empty<Text, Abstract>();
  let reports = Map.empty<Text, Report>();
  let connections = Map.empty<Text, Connection>();
  let measurements = Map.empty<Text, Measurement>();
  let techReports = Map.empty<Text, TechReport>();
  let facts = Map.empty<Text, Fact>();
  let medicalFacts = Map.empty<Text, MedicalFact>();
  let statistics = Map.empty<Text, Statistics>();
  let dataSets = Map.empty<Text, DataSet>();
  let patientGroups = Map.empty<Text, PatientGroup>();
  let scientificResources = Map.empty<Text, ScientificResource>();
  let medicalInnovations = Map.empty<Text, MedicalInnovation>();
  let catalogCodes = Map.empty<Text, CatalogCode>();
  let abstractSearchTerms = Map.empty<Text, AbstractSearchTerm>();
  let reportSections = Map.empty<Text, ReportSection>();
  let findings = Map.empty<Text, Finding>();
  let images = Map.empty<Text, Image>();

  /// Helper Functions
  func getAndCheckAuthor<T>(map : Map.Map<Text, T>, id : Text, caller : Principal, getAuthor : T -> Principal) : T {
    switch (map.get(id)) {
      case (?item) {
        if (getAuthor(item) != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Not the author");
        };
        item;
      };
      case (null) { Runtime.trap("Not found: " # id) };
    };
  };

  func tryGetAndCheckAuthor<T>(map : Map.Map<Text, T>, id : Text, caller : Principal, getAuthor : T -> Principal) : ?T {
    switch (map.get(id)) {
      case (null) { null };
      case (?item) {
        if (getAuthor(item) == caller or AccessControl.isAdmin(accessControlState, caller)) {
          ?item;
        } else {
          null;
        };
      };
    };
  };

  /// Actor Methods
  public shared ({ caller }) func saveAbstract(abstract : Abstract) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    abstracts.add(abstract.id, abstract);
  };

  public shared ({ caller }) func updateAbstract(id : Text, newAbstract : Abstract) : async () {
    ignore getAndCheckAuthor(abstracts, id, caller, func(_) { caller });
    abstracts.add(id, newAbstract);
  };

  public query ({ caller }) func getAbstract(id : Text) : async ?Abstract {
    tryGetAndCheckAuthor(abstracts, id, caller, func(_) { caller });
  };

  public shared ({ caller }) func deleteAbstract(id : Text) : async () {
    ignore getAndCheckAuthor(abstracts, id, caller, func(_) { caller });
    abstracts.remove(id);
  };

  public shared ({ caller }) func saveReport(report : Report) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    reports.add(report.id, report);
  };

  public shared ({ caller }) func updateReport(id : Text, newReport : Report) : async () {
    ignore getAndCheckAuthor(reports, id, caller, func(_) { caller });
    reports.add(id, newReport);
  };

  public query ({ caller }) func getReport(id : Text) : async ?Report {
    tryGetAndCheckAuthor(reports, id, caller, func(_) { caller });
  };

  public shared ({ caller }) func deleteReport(id : Text) : async () {
    ignore getAndCheckAuthor(reports, id, caller, func(_) { caller });
    reports.remove(id);
  };

  public shared ({ caller }) func saveConnection(connection : Connection) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    connections.add(connection.id, connection);
  };

  public shared ({ caller }) func updateConnection(id : Text, newConnection : Connection) : async () {
    ignore getAndCheckAuthor(connections, id, caller, func(_) { caller });
    connections.add(id, newConnection);
  };

  public query ({ caller }) func getConnection(id : Text) : async ?Connection {
    tryGetAndCheckAuthor(connections, id, caller, func(_) { caller });
  };

  public shared ({ caller }) func deleteConnection(id : Text) : async () {
    ignore getAndCheckAuthor(connections, id, caller, func(_) { caller });
    connections.remove(id);
  };

  public shared ({ caller }) func saveMeasurement(measurement : Measurement) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    measurements.add(measurement.id, measurement);
  };

  public shared ({ caller }) func updateMeasurement(id : Text, newMeasurement : Measurement) : async () {
    ignore getAndCheckAuthor(measurements, id, caller, func(_) { caller });
    measurements.add(id, newMeasurement);
  };

  public query ({ caller }) func getMeasurement(id : Text) : async ?Measurement {
    tryGetAndCheckAuthor(measurements, id, caller, func(_) { caller });
  };

  public shared ({ caller }) func deleteMeasurement(id : Text) : async () {
    ignore getAndCheckAuthor(measurements, id, caller, func(_) { caller });
    measurements.remove(id);
  };

  public shared ({ caller }) func saveTechReport(techReport : TechReport) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    techReports.add(techReport.id, techReport);
  };

  public shared ({ caller }) func updateTechReport(id : Text, newTechReport : TechReport) : async () {
    ignore getAndCheckAuthor(techReports, id, caller, func(_) { caller });
    techReports.add(id, newTechReport);
  };

  public query ({ caller }) func getTechReport(id : Text) : async ?TechReport {
    tryGetAndCheckAuthor(techReports, id, caller, func(_) { caller });
  };

  public shared ({ caller }) func deleteTechReport(id : Text) : async () {
    ignore getAndCheckAuthor(techReports, id, caller, func(_) { caller });
    techReports.remove(id);
  };

  public shared ({ caller }) func saveFact(fact : Fact) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    facts.add(fact.id, fact);
  };

  public shared ({ caller }) func updateFact(id : Text, newFact : Fact) : async () {
    ignore getAndCheckAuthor(facts, id, caller, func(_) { caller });
    facts.add(id, newFact);
  };

  public query ({ caller }) func getFact(id : Text) : async ?Fact {
    tryGetAndCheckAuthor(facts, id, caller, func(_) { caller });
  };

  public shared ({ caller }) func deleteFact(id : Text) : async () {
    ignore getAndCheckAuthor(facts, id, caller, func(_) { caller });
    facts.remove(id);
  };

  public shared ({ caller }) func saveMedicalFact(medicalFact : MedicalFact) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    medicalFacts.add(medicalFact.id, medicalFact);
  };

  public shared ({ caller }) func updateMedicalFact(id : Text, newMedicalFact : MedicalFact) : async () {
    ignore getAndCheckAuthor(medicalFacts, id, caller, func(_) { caller });
    medicalFacts.add(id, newMedicalFact);
  };

  public query ({ caller }) func getMedicalFact(id : Text) : async ?MedicalFact {
    tryGetAndCheckAuthor(medicalFacts, id, caller, func(_) { caller });
  };

  public shared ({ caller }) func deleteMedicalFact(id : Text) : async () {
    ignore getAndCheckAuthor(medicalFacts, id, caller, func(_) { caller });
    medicalFacts.remove(id);
  };

  public shared ({ caller }) func saveStatistics(statisticsRecord : Statistics) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    statistics.add(statisticsRecord.id, statisticsRecord);
  };

  public shared ({ caller }) func updateStatistics(id : Text, newStatistics : Statistics) : async () {
    ignore getAndCheckAuthor(statistics, id, caller, func(_) { caller });
    statistics.add(id, newStatistics);
  };

  public query ({ caller }) func getStatistics(id : Text) : async ?Statistics {
    tryGetAndCheckAuthor(statistics, id, caller, func(_) { caller });
  };

  public shared ({ caller }) func deleteStatistics(id : Text) : async () {
    ignore getAndCheckAuthor(statistics, id, caller, func(_) { caller });
    statistics.remove(id);
  };

  public shared ({ caller }) func saveDataSet(dataSet : DataSet) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    dataSets.add(dataSet.id, dataSet);
  };

  public shared ({ caller }) func updateDataSet(id : Text, newDataSet : DataSet) : async () {
    ignore getAndCheckAuthor(dataSets, id, caller, func(_) { caller });
    dataSets.add(id, newDataSet);
  };

  public query ({ caller }) func getDataSet(id : Text) : async ?DataSet {
    tryGetAndCheckAuthor(dataSets, id, caller, func(_) { caller });
  };

  public shared ({ caller }) func deleteDataSet(id : Text) : async () {
    ignore getAndCheckAuthor(dataSets, id, caller, func(_) { caller });
    dataSets.remove(id);
  };

  public shared ({ caller }) func savePatientGroup(patientGroup : PatientGroup) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    patientGroups.add(patientGroup.id, patientGroup);
  };

  public shared ({ caller }) func updatePatientGroup(id : Text, newPatientGroup : PatientGroup) : async () {
    ignore getAndCheckAuthor(patientGroups, id, caller, func(_) { caller });
    patientGroups.add(id, newPatientGroup);
  };

  public query ({ caller }) func getPatientGroup(id : Text) : async ?PatientGroup {
    tryGetAndCheckAuthor(patientGroups, id, caller, func(_) { caller });
  };

  public shared ({ caller }) func deletePatientGroup(id : Text) : async () {
    ignore getAndCheckAuthor(patientGroups, id, caller, func(_) { caller });
    patientGroups.remove(id);
  };

  public shared ({ caller }) func saveScientificResource(scientificResource : ScientificResource) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    scientificResources.add(scientificResource.id, scientificResource);
  };

  public shared ({ caller }) func updateScientificResource(id : Text, newScientificResource : ScientificResource) : async () {
    ignore getAndCheckAuthor(scientificResources, id, caller, func(_) { caller });
    scientificResources.add(id, newScientificResource);
  };

  public query ({ caller }) func getScientificResource(id : Text) : async ?ScientificResource {
    tryGetAndCheckAuthor(scientificResources, id, caller, func(_) { caller });
  };

  public shared ({ caller }) func deleteScientificResource(id : Text) : async () {
    ignore getAndCheckAuthor(scientificResources, id, caller, func(_) { caller });
    scientificResources.remove(id);
  };

  public shared ({ caller }) func saveMedicalInnovation(medicalInnovation : MedicalInnovation) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    medicalInnovations.add(medicalInnovation.id, medicalInnovation);
  };

  public shared ({ caller }) func updateMedicalInnovation(id : Text, newMedicalInnovation : MedicalInnovation) : async () {
    ignore getAndCheckAuthor(medicalInnovations, id, caller, func(_) { caller });
    medicalInnovations.add(id, newMedicalInnovation);
  };

  public query ({ caller }) func getMedicalInnovation(id : Text) : async ?MedicalInnovation {
    tryGetAndCheckAuthor(medicalInnovations, id, caller, func(_) { caller });
  };

  public shared ({ caller }) func deleteMedicalInnovation(id : Text) : async () {
    ignore getAndCheckAuthor(medicalInnovations, id, caller, func(_) { caller });
    medicalInnovations.remove(id);
  };

  public shared ({ caller }) func saveCatalogCode(catalogCode : CatalogCode) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    catalogCodes.add(catalogCode.code, catalogCode);
  };

  public shared ({ caller }) func updateCatalogCode(code : Text, newCatalogCode : CatalogCode) : async () {
    ignore getAndCheckAuthor(catalogCodes, code, caller, func(_) { caller });
    catalogCodes.add(code, newCatalogCode);
  };

  public query ({ caller }) func getCatalogCode(code : Text) : async ?CatalogCode {
    tryGetAndCheckAuthor(catalogCodes, code, caller, func(_) { caller });
  };

  public shared ({ caller }) func deleteCatalogCode(code : Text) : async () {
    ignore getAndCheckAuthor(catalogCodes, code, caller, func(_) { caller });
    catalogCodes.remove(code);
  };

  public shared ({ caller }) func saveAbstractSearchTerm(abstractSearchTerm : AbstractSearchTerm) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    abstractSearchTerms.add(abstractSearchTerm.id, abstractSearchTerm);
  };

  public shared ({ caller }) func updateAbstractSearchTerm(id : Text, newAbstractSearchTerm : AbstractSearchTerm) : async () {
    ignore getAndCheckAuthor(abstractSearchTerms, id, caller, func(_) { caller });
    abstractSearchTerms.add(id, newAbstractSearchTerm);
  };

  public query ({ caller }) func getAbstractSearchTerm(id : Text) : async ?AbstractSearchTerm {
    tryGetAndCheckAuthor(abstractSearchTerms, id, caller, func(_) { caller });
  };

  public shared ({ caller }) func deleteAbstractSearchTerm(id : Text) : async () {
    ignore getAndCheckAuthor(abstractSearchTerms, id, caller, func(_) { caller });
    abstractSearchTerms.remove(id);
  };

  public shared ({ caller }) func saveReportSection(reportSection : ReportSection) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    reportSections.add(reportSection.id, reportSection);
  };

  public shared ({ caller }) func updateReportSection(id : Text, newReportSection : ReportSection) : async () {
    ignore getAndCheckAuthor(reportSections, id, caller, func(_) { caller });
    reportSections.add(id, newReportSection);
  };

  public query ({ caller }) func getReportSection(id : Text) : async ?ReportSection {
    tryGetAndCheckAuthor(reportSections, id, caller, func(_) { caller });
  };

  public shared ({ caller }) func deleteReportSection(id : Text) : async () {
    ignore getAndCheckAuthor(reportSections, id, caller, func(_) { caller });
    reportSections.remove(id);
  };

  public shared ({ caller }) func saveFinding(finding : Finding) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    findings.add(finding.id, finding);
  };

  public shared ({ caller }) func updateFinding(id : Text, newFinding : Finding) : async () {
    ignore getAndCheckAuthor(findings, id, caller, func(_) { caller });
    findings.add(id, newFinding);
  };

  public query ({ caller }) func getFinding(id : Text) : async ?Finding {
    tryGetAndCheckAuthor(findings, id, caller, func(_) { caller });
  };

  public shared ({ caller }) func deleteFinding(id : Text) : async () {
    ignore getAndCheckAuthor(findings, id, caller, func(_) { caller });
    findings.remove(id);
  };

  public shared ({ caller }) func saveImage(image : Image) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    images.add(image.id, image);
  };

  public query ({ caller }) func getImage(id : Text) : async ?Image {
    images.get(id);
  };

  public shared ({ caller }) func deleteImage(id : Text) : async () {
    images.remove(id);
  };

  public query ({ caller }) func searchReports(term : Text) : async [Report] {
    reports.values().toArray().filter(func(report) { report.title.contains(#text term) });
  };

  public query ({ caller }) func searchAbstracts(term : Text) : async [Abstract] {
    abstracts.values().toArray().filter(func(abstract) { abstract.title.contains(#text term) });
  };

  public query ({ caller }) func searchTechReports(term : Text) : async [TechReport] {
    techReports.values().toArray().filter(func(techReport) { techReport.title.contains(#text term) });
  };

  public query ({ caller }) func complexSearch(term : Text) : async {
    reports : [Report];
    abstracts : [Abstract];
    techReports : [TechReport];
  } {
    {
      reports = reports.values().toArray().filter(func(report) { report.title.contains(#text term) });
      abstracts = abstracts.values().toArray().filter(func(abstract) { abstract.title.contains(#text term) });
      techReports = techReports.values().toArray().filter(func(techReport) { techReport.title.contains(#text term) });
    };
  };
};
