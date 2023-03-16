import { Collapse } from "antd";
import { Fragment, useState } from "react";
import { useLocation } from "react-router-dom";
const { Panel } = Collapse;
import { agywPrevQuery } from "../../../utils/report";
import CompletedOnlyPrimaryPackage from "./containers/CompletedOnlyPrimaryPackage";
import CompletedPrimaryPackageAndSecondaryService from "./containers/CompletedPrimaryPackageAndSecondaryService";
import CompletedAtLeastOnePrimaryService from "./containers/CompletedAtLeastOnePrimaryService";
import StartedServiceDidNotComplete from "./containers/StartedServiceDidNotComplete";
import CompletedSocialEconomicApproaches from "./containers/CompletedSocialEconomicApproaches";
import CompletedViolenceService from "./containers/CompletedViolenceService";
import HadSchoolAllowance from "./containers/HadSchoolAllowance";
import { useSelector } from "react-redux";

const ReportPreview = () => {
  const { state }: any = useLocation();
  const { provinces, districts, initialDate, finalDate } = state; // Read values passed on state

  const responseData = useSelector((state: any) => state.report.agyw);
  let currentProvinceId: any;

  const onChange = (key) => {
    //console.log(key);
  };

  return (
    <>
      <p>Data Inicial: {initialDate}</p>
      <p>Data final: {finalDate}</p>
      <Collapse onChange={onChange}>
        {provinces.map((province) => {
          currentProvinceId = province.id;
          return (
            <Panel header={province.name} key={province.id}>
              {(responseData == undefined && (
                <Fragment>Loading...</Fragment>
              )) || (
                <Collapse defaultActiveKey={province.id}>
                  {districts.map((district) => {
                    if (district.province.id === currentProvinceId) {
                      const total =
                        responseData[district.id]["all-disaggregations-total"]
                          .total;
                      const maleTotal =
                        responseData[district.id]["male-beneficiaries"].total;
                      const femaleTotal =
                        responseData[district.id]["female-beneficiaries"].total;
                      const beneficiariesTotal =
                        responseData[district.id]["total-beneficiaries"].total;
                      return (
                        <Panel header={district.name} key={district.id}>
                          <p>Distrito: {" " + district.name}</p>
                          <p>RESUMO DISTRITAL</p>
                          <p>
                            Total de Adolescentes e Jovens Registados:
                            {" " + beneficiariesTotal}
                          </p>
                          <p>
                            Total de Adolescentes e Jovens do Sexo Feminino:
                            {" " + femaleTotal}
                          </p>
                          <p>
                            Total de Adolescentes e Jovens do Sexo Masculino:
                            {" " + maleTotal}
                          </p>
                          <p>
                            Total de Beneficiárias no Indicador AGYW_PREV:
                            {" " + total}
                          </p>

                          <p>
                            <CompletedOnlyPrimaryPackage
                              districtId={district.id}
                            />
                          </p>
                          <p>
                            <CompletedPrimaryPackageAndSecondaryService
                              districtId={district.id}
                            />
                          </p>
                          <p>
                            <CompletedAtLeastOnePrimaryService
                              districtId={district.id}
                            />
                          </p>
                          <p>
                            <StartedServiceDidNotComplete
                              districtId={district.id}
                            />
                          </p>
                          <p>
                            <CompletedViolenceService
                              districtId={district.id}
                            />
                          </p>
                          <p>
                            <HadSchoolAllowance districtId={district.id} />
                          </p>
                          <p>
                            <CompletedSocialEconomicApproaches
                              districtId={district.id}
                            />
                          </p>                                                                                                  
                        
                        </Panel>
                      );
                    }
                  })}
                </Collapse>
              )}
            </Panel>
          );
        })}
      </Collapse>
    </>
  );
};

export default ReportPreview;
