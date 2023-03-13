import { Collapse } from "antd";
import { Fragment, useState } from "react";
import { useLocation } from "react-router-dom";
const { Panel } = Collapse;
import { agywPrevQuery } from "../../../utils/report";
import CompletedOnlyPrimaryPackage from "./container/CompletedOnlyPrimaryPackage";
import CompletedPrimaryPackageAndSecondaryService from "./container/CompletedPrimaryPackageAndSecondaryService";
import CompletedAtLeastOnePrimaryService from "./container/CompletedAtLeastOnePrimaryService";
import StartedServiceDidNotComplete from "./container/StartedServiceDidNotComplete";
import CompletedSocialEconomicApproaches from "./container/CompletedSocialEconomicApproaches";
import CompletedViolenceService from "./container/CompletedViolenceService";
import HadSchoolAllowance from "./container/HadSchoolAllowance";
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
                      responseData[district.id]["all-disaggregations-total"].total;
                      return (
                        <Panel header={district.name} key={district.id}>
                          <p>Distrito: {district.name}</p>
                          <p>RESUMO DISTRITAL</p>
                          <p>
                            Total de Adolescentes e Jovens Registados : 
                            under_contruction
                          </p>
                          <p>
                            Total de Adolescentes e Jovens do Sexo Feminino : 
                            under_contruction
                          </p>
                          <p>
                            Total de Adolescentes e Jovens do Sexo Masculino : 
                            under_contruction
                          </p>
                          <p>
                            Total de Beneficiárias no Indicador AGYW_PREV : 
                            {total}
                          </p>

                          <p />
                          <CompletedOnlyPrimaryPackage
                            districtId={district.id}
                          />
                          <p />
                          <CompletedPrimaryPackageAndSecondaryService
                            districtId={district.id}
                          />
                          <p />
                          <CompletedAtLeastOnePrimaryService
                            districtId={district.id}
                          />
                          <p />
                          <StartedServiceDidNotComplete
                            districtId={district.id}
                          />
                          <p />
                          <CompletedViolenceService districtId={district.id} />
                          <p />
                          <HadSchoolAllowance districtId={district.id} />
                          <p />
                          <CompletedSocialEconomicApproaches
                            districtId={district.id}
                          />
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
