export const getVulnerabilitiesCounter = (beneficiary) => {
  let counter = 0;

  if (
    beneficiary.vbltAlcoholDrugsUse &&
    beneficiary.vbltAlcoholDrugsUse !== 0
  ) {
    counter++;
  }
  if (beneficiary.vbltChildren !== 0) {
    counter++;
  }
  if (
    beneficiary.vbltDeficiencyType &&
    beneficiary.vbltDeficiencyType != null
  ) {
    counter++;
  }
  if (beneficiary.vbltHouseSustainer && beneficiary.vbltHouseSustainer != 0) {
    counter++;
  }
  if (beneficiary.vbltIsDeficient && beneficiary.vbltIsDeficient != 0) {
    counter++;
  }
  if (beneficiary.vbltIsEmployed && beneficiary.vbltIsEmployed != "0") {
    counter++;
  }
  if (beneficiary.vbltIsMigrant && beneficiary.vbltIsMigrant != 0) {
    counter++;
  }
  if (beneficiary.vbltIsOrphan && beneficiary.vbltIsOrphan != 0) {
    counter++;
  }
  if (beneficiary.vbltIsStudent && beneficiary.vbltIsStudent != 0) {
    counter++;
  }
  if (beneficiary.vbltLivesWith && beneficiary.vbltLivesWith != "") {
    counter++;
  }
  if (beneficiary.vbltMarriedBefore && beneficiary.vbltMarriedBefore != 0) {
    counter++;
  }
  if (
    beneficiary.vbltMultiplePartners &&
    beneficiary.vbltMultiplePartners != 0
  ) {
    counter++;
  }
  if (beneficiary.vbltPregnantBefore && beneficiary.vbltPregnantBefore != 0) {
    counter++;
  }
  if (
    beneficiary.vbltPregnantOrBreastfeeding &&
    beneficiary.vbltPregnantOrBreastfeeding != 0
  ) {
    counter++;
  }
  if (beneficiary.vbltSchoolGrade && beneficiary.vbltSchoolGrade != null) {
    counter++;
  }
  if (beneficiary.vbltSchoolName && beneficiary.vbltSchoolName != null) {
    counter++;
  }
  if (beneficiary.vbltSexWorker && beneficiary.vbltSexWorker != null) {
    counter++;
  }
  if (
    beneficiary.vbltSexploitationTime &&
    beneficiary.vbltSexploitationTime != null
  ) {
    counter++;
  }
  if (
    beneficiary.vbltSexualExploitation &&
    beneficiary.vbltSexualExploitation != 0
  ) {
    counter++;
  }
  if (beneficiary.vbltSexuallyActive && beneficiary.vbltSexuallyActive != 0) {
    counter++;
  }
  if (beneficiary.vbltStiHistory && beneficiary.vbltStiHistory != 0) {
    counter++;
  }
  if (beneficiary.vbltTestedHiv && beneficiary.vbltTestedHiv != "") {
    counter++;
  }
  if (
    beneficiary.vbltTraffickingVictim &&
    beneficiary.vbltTraffickingVictim != 0
  ) {
    counter++;
  }
  if (beneficiary.vbltVbgTime && beneficiary.vbltVbgTime != "0") {
    counter++;
  }
  if (beneficiary.vbltVbgType && beneficiary.vbltVbgType != "") {
    counter++;
  }
  if (beneficiary.vbltVbgVictim && beneficiary.vbltVbgVictim != 0) {
    counter++;
  }

  return counter;
};
