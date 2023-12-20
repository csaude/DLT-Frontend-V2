import React, { useEffect, useState, useContext, useCallback, memo } from "react";
import {
  View,
  HStack,
  Text,
  VStack,
  FormControl,
  Input,
  Stack,
  InputGroup,
  InputLeftAddon,
  Center,
  Box,
  Button,
  Radio,
  Modal,
  ScrollView,
  Alert,
  Checkbox,
  useToast,
} from "native-base";
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";
import { Ionicons } from "@native-base/icons";
import { useFormik } from "formik";
import * as yup from "yup";
import { Picker, PickerProps } from "@react-native-picker/picker";
import { Q } from "@nozbe/watermelondb";
import { database } from "../../../database";
import withObservables from "@nozbe/with-observables";
import Spinner from "react-native-loading-spinner-overlay";
import { navigationRef } from "../../../routes/NavigationRef";
import moment from "moment";
import { getFormatedDate } from "react-native-modern-datepicker";
import { Context } from "../../../routes/DrawerNavigator";
import { calculateAge } from "../../../models/Utils";
import styles from "./styles";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { MENTOR } from "../../../utils/constants";
import MyDatePicker from "../../../components/DatePicker";
import { loadViewedBeneficiaryGender } from "../../../store/beneficiarySlice";

const BeneficiaryPartnerForm: React.FC = ({
  route,
  subServices,
  beneficiaries_interventions,
}: any) => {
  const loggedUser: any = useContext(Context);

  const idades = [
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "30",
    "31",
    "32",
    "33",
    "34",
    "35",
    "36",
    "37",
    "38",
    "39",
    "40",
  ];

  const { beneficiary } = route.params;
  const userDetailsCollection = database.get("user_details");
  const dispatch = useDispatch();

  const [value, setValue] = useState([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [items, setItems] = useState([
    { label: "Pais", value: "Pais" },
    { label: "Avos", value: "Avos" },
    { label: "Parceiro", value: "Parceiro" },
    { label: "Sozinho", value: "Sozinho" },
    { label: "Outros familiares", value: "Outros familiares" },
  ]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [errors, setErrors] = useState(false);
  const [beneficiarie, setBeneficairie] = useState(beneficiary);
  const [provinces, setProvinces] = useState<any>([]);
  const [districts, setDistricts] = useState<any>([]);
  const [localities, setLocalities] = useState<any>([]);
  const [uss, setUss] = useState<any>([]);
  const [neighborhoods, setNeighborhoods] = useState<any>([]);
  const [isEnable, setIsEnable] = useState(false);
  const [isDisEnable, setIsDisEnable] = useState(false);
  const [isProvEnable, setIsProvEnable] = useState(false);
  const [step, setStep] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [newNui, setNewNui] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [district, setDistrict] = useState<any>();
  const [isDateRequired, setIsDateRequired] = useState<any>(true);
  const [age, setAge] = useState<any>(undefined);
  const [schoolInfoEnabled, setSchoolInfoEnabled] = useState<any>(true);
  const [deficiencyTypeEnabled, setDeficiencyTypeEnabled] = useState<any>(true);
  const userDetail = useSelector((state: RootState) => state.auth.userDetails);
  const [partnerHasErrors, setPartnerHasErrors] = useState(false);
  const [isUsVisible, setUsVisible] = useState(false);

  const minBirthYear = new Date();
  minBirthYear.setFullYear(new Date().getFullYear() - 40);

  const maxBirthYear = new Date();
  maxBirthYear.setFullYear(new Date().getFullYear() - 9);

  const fetchMetaData = useCallback(async () => {
    const getProvsList = await database.get("provinces").query().fetch();
    const provSerialized = getProvsList.map((item) => item._raw);

    setProvinces(provSerialized);

    if (userDetail?.provinces[0]?.id != undefined) {
      const getDistList = await database
        .get("districts")
        .query(Q.where("province_id", userDetail?.provinces[0]?.id))
        .fetch();
      const distsSerialized = getDistList.map((item) => item._raw);
      setDistricts(distsSerialized);

      userDetail?.provinces?.length > 1
        ? setIsProvEnable(true)
        : setIsProvEnable(false);
    }

    if (userDetail?.districts[0]?.id != undefined) {
      userDetail?.districts?.length > 1
        ? setIsDisEnable(true)
        : setIsDisEnable(false);

      const getLocList = await database
        .get("localities")
        .query(Q.where("district_id", userDetail.districts[0].id))
        .fetch();
      const locsSerialized = getLocList.map((item) => item._raw);
      setLocalities(locsSerialized);

      if (userDetail?.localities[0]?.id != undefined) {
        const getNeiList = await database
          .get("neighborhoods")
          .query(Q.where("locality_id", Number(userDetail?.localities[0]?.id)))
          .fetch();
        const neiSerialized = getNeiList.map((item) => item._raw);
        setNeighborhoods(neiSerialized);

        userDetail?.districts?.length > 1
          ? setIsEnable(true)
          : userDetail?.localities?.length > 1
          ? setIsEnable(true)
          : setIsEnable(false);
      }
    }
  }, []);

  const fetchUpdateData = useCallback(async () => {
    const districtsList = await database
      .get("districts")
      .query(Q.where("province_id", Number(beneficiarie.province_id)))
      .fetch();
    const districts = districtsList.map((item) => item._raw);
    setDistricts(districts);

    const localitiesList = await database
      .get("localities")
      .query(Q.where("district_id", Number(beneficiarie.district_id)))
      .fetch();
    const localities = localitiesList.map((item) => item._raw);
    setLocalities(localities);

    const ussList = await database
      .get("us")
      .query(
        Q.where("locality_id", Number(beneficiarie?.locality_id)),
        Q.where("entry_point", Number(beneficiarie?.entry_point))
      )
      .fetch();
    const usSerialized = ussList.map((item) => item._raw);
    setUss(usSerialized);

    const neighborhoodsList = await database
      .get("neighborhoods")
      .query(Q.where("locality_id", Number(beneficiarie?.locality_id)))
      .fetch();
    const neighborhoodsSerialized = neighborhoodsList.map((item) => item._raw);
    setNeighborhoods(neighborhoodsSerialized);

    const partnersQ = await database
      .get("beneficiaries")
      .query(
        Q.where("gender", "2"),
        Q.where("online_id", beneficiarie.partner_id)
      )
      .fetch();
    const benefPartiner = partnersQ[0]?._raw;

    handleSearchPartner(benefPartiner?.["nui"]);
  }, []);

  useEffect(() => {
    fetchMetaData().catch((error) => console.log(error));

    if (beneficiarie) {
      fetchUpdateData().catch((error) => console.log(error));

      setValue(beneficiarie?.vblt_lives_with.split(","));
      setSchoolInfoEnabled(beneficiarie.vblt_is_student == 1);
      setDeficiencyTypeEnabled(beneficiarie.vblt_is_deficient == 1);

      const age = calculateAge(beneficiarie.date_of_birth);
      setAge(age + "");
      formik.setFieldValue("age", age + "");
    } else {
      const entryPoint =
        formik.values.entry_point !== undefined
          ? formik.values.entry_point
          : loggedUser.entryPoint !== undefined
          ? loggedUser.entryPoint
          : loggedUser.entry_point;
      formik.setFieldValue("entry_point", entryPoint);
      onChangeEntryPoint(entryPoint);
    }

    const validateLoggedUser = async () => {
      const userDetailsQ = await userDetailsCollection
        .query(Q.where("user_id", loggedUser.online_id))
        .fetch();
      const userDetailRaw = userDetailsQ[0]?._raw;
      const isUserAllowed =
        userDetailRaw?.["profile_id"] != MENTOR ? true : false;
      setUsVisible(isUserAllowed);
    };
    validateLoggedUser().catch((err) => console.error(err));
  }, []);

  const handleSearchPartner = async (e: any) => {
    if (e === undefined || e === "") {
      setPartnerHasErrors(false);
    } else if (e.length !== 7 && e.length !== 10) {
      setPartnerHasErrors(true);
    } else if (e.length === 7 || e.length === 10) {
      const partnersQ = isNaN(Number(beneficiarie.partner_id))
        ? await database
            .get("beneficiaries")
            .query(
              Q.where("gender", "2"),
              Q.where("id", beneficiarie.partner_id)
            )
            .fetch()
        : await database
            .get("beneficiaries")
            .query(
              Q.where("gender", "2"),
              Q.where("online_id", Number(beneficiarie.partner_id))
            )
            .fetch();
      const benefPartiner = partnersQ[0]?._raw;
      if (benefPartiner) {
        setPartnerHasErrors(false);
      } else {
        setPartnerHasErrors(true);
      }
      formik.setFieldValue("partner_id", benefPartiner?.["online_id"]);
    }

    setLoadingData(false);
  };

  const toast = useToast();

  const formik = useFormik({
    initialValues: {
      surname: beneficiarie?.surname,
      name: beneficiarie?.name,
      date_of_birth: beneficiarie?.date_of_birth,
      age: calculateAge(beneficiarie?.date_of_birth),
      gender: "1",
      nationality: "1",
      enrollment_date: beneficiarie?.enrollment_date,
      province:
        beneficiarie?.province_id === undefined
          ? userDetail?.provinces[0]?.id
          : beneficiarie?.province_id,
      district:
        beneficiarie?.district_id === undefined
          ? userDetail?.districts[0]?.id
          : beneficiarie?.district_id,
      locality:
        beneficiarie?.locality_id === undefined
          ? userDetail?.localities[0]?.id
          : beneficiarie?.locality_id,
      locality_name: beneficiarie?.locality_name,
      entry_point: beneficiarie?.entry_point,
      us_id: beneficiarie?.us_id,
      nick_name: beneficiarie?.nick_name,
      address: beneficiarie?.address,
      phone_number: beneficiarie?.phone_number,
      e_mail: beneficiarie?.e_mail,
      neighborhood_id: beneficiarie?.neighborhood_id,
      partner_id: beneficiarie?.partner_id,
      vblt_lives_with: beneficiarie?.vblt_lives_with,
      vblt_is_orphan: beneficiarie?.vblt_is_orphan,
      vblt_is_student: beneficiarie?.vblt_is_student,
      vblt_school_grade: beneficiarie?.vblt_school_grade,
      vblt_school_name: beneficiarie?.vblt_school_name,
      vblt_is_deficient: beneficiarie?.vblt_is_deficient,
      vblt_deficiency_type: beneficiarie?.vblt_deficiency_type,
      vblt_married_before: beneficiarie?.vblt_married_before,
      vblt_pregnant_before: beneficiarie?.vblt_pregnant_before,
      vblt_children: beneficiarie?.vblt_children,
      vblt_pregnant_or_breastfeeding:
        beneficiarie?.vblt_pregnant_or_breastfeeding,
      vblt_is_employed: beneficiarie?.vblt_is_employed,
      vblt_tested_hiv: beneficiarie?.vblt_tested_hiv,
      vblt_sexually_active: beneficiarie?.vblt_sexually_active,
      vblt_multiple_partners: beneficiarie?.vblt_multiple_partners,
      vblt_is_migrant: beneficiarie?.vblt_is_migrant,
      vblt_trafficking_victim: beneficiarie?.vblt_trafficking_victim,
      vblt_sexual_exploitation: beneficiarie?.vblt_sexual_exploitation,
      vblt_sexploitation_time: beneficiarie?.vblt_sexploitation_time,
      vblt_vbg_victim: beneficiarie?.vblt_vbg_victim,
      vblt_vbg_type: beneficiarie?.vblt_vbg_type,
      vblt_vbg_time: beneficiarie?.vblt_vbg_time,
      vblt_alcohol_drugs_use: beneficiarie?.vblt_alcohol_drugs_use,
      vblt_sti_history: beneficiarie?.vblt_sti_history,
      vblt_sex_worker: beneficiarie?.vblt_sex_worker,
      vblt_house_sustainer: beneficiarie?.vblt_house_sustainer,
      references_a: beneficiarie?.references_a,
    },
    validationSchema: () =>
      yup.object({
        e_mail: yup.string().email("E-mail invalido!!!"),
        phone_number: yup
          .number()
          .nullable(true)
          .positive("Apenas numeros!!!")
          .integer("Apenas numeros!!!"),
      }),
    onSubmit: (values) => console.log(values),
    validate: (values) => validate(values),
    validateOnBlur: false,
    validateOnChange: false,
  });

  const onNextStep = () => {
    const errorsList = validate(formik.values);
    const hasErrors = JSON.stringify(errorsList) !== "{}";

    if (hasErrors) {
      setErrors(true);
      formik.setErrors(errorsList);
    } else {
      setErrors(false);
      setStep(2);
    }

    if (partnerHasErrors) {
      setErrors(true);
    }
  };

  const onNextStep2 = async () => {
    const errorsList = validate(formik.values);
    const hasErrors = JSON.stringify(errorsList) !== "{}";

    if (hasErrors) {
      setErrors(true);
      formik.setErrors(errorsList);
    } else {
      // // save the Beneficiary locally
      setLoading(true);
      const ben: any = await handleSaveBeneficiary();
      dispatch(loadViewedBeneficiaryGender(ben.gender));

      setBeneficairie(ben?._raw);
      setNewNui(ben?._raw.nui);
      setLoading(false);
      setShowModal(true);

      toast.show({
        placement: "top",
        render: () => {
          return (
            <Alert
              w="100%"
              variant="left-accent"
              colorScheme="success"
              status="success"
            >
              <VStack space={2} flexShrink={1} w="100%">
                <HStack
                  flexShrink={1}
                  space={2}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <HStack space={2} flexShrink={1} alignItems="center">
                    <Alert.Icon />
                    <Text color="coolGray.800">
                      Beneficiário Registado com Sucesso!
                    </Text>
                  </HStack>
                </HStack>
              </VStack>
            </Alert>
          );
        },
      });

      setErrors(false);
    }

    if (partnerHasErrors) {
      setErrors(true);
    }
  };

  const onPreviousStep = () => {
    setStep(1);
  };

  const onChangeCheckbox = (e) => {
    setIsDateRequired(!e);
  };

  const validate = (values: any) => {
    const errors: any = {};
    const errorMessage = "Obrigatório";

    if (step == 1) {
      if (!values.surname) {
        errors.surname = errorMessage;
      }
      if (!values.name) {
        errors.name = errorMessage;
      }
      if (!values.date_of_birth) {
        errors.date_of_birth = errorMessage;
      }
      if (!values.nationality) {
        errors.nationality = errorMessage;
      }
      if (!values.enrollment_date) {
        errors.enrollment_date = errorMessage;
      }
      if (!values.province) {
        errors.province = errorMessage;
      }
      if (!values.district) {
        errors.district = errorMessage;
      }
      if (!values.locality) {
        errors.locality = errorMessage;
      }
      if (!values.entry_point) {
        errors.entry_point = errorMessage;
      }
      if (!values.us_id) {
        errors.us_id = errorMessage;
      }
      if (!values.neighborhood_id) {
        errors.neighborhood_id = errorMessage;
      }
    } else if (step == 2) {
      if (!values.vblt_lives_with) {
        errors.vblt_lives_with = errorMessage;
      }
      if (values.vblt_house_sustainer == null) {
        errors.vblt_house_sustainer = errorMessage;
      }
      if (values.vblt_is_orphan == null) {
        errors.vblt_is_orphan = errorMessage;
      }
      if (values.vblt_is_student == null) {
        errors.vblt_is_student = errorMessage;
      }
      if (schoolInfoEnabled && values.vblt_school_grade == null) {
        errors.vblt_school_grade = errorMessage;
      }
      if (schoolInfoEnabled && values.vblt_school_name == null) {
        errors.vblt_school_name = errorMessage;
      }
      if (values.vblt_is_deficient == null) {
        errors.vblt_is_deficient = errorMessage;
      }
      if (deficiencyTypeEnabled && values.vblt_deficiency_type == null) {
        errors.vblt_deficiency_type = errorMessage;
      }
    }

    return errors;
  };

  const handleSaveBeneficiary = async () => {
    const district = districts.filter(
      (d) => d.online_id === formik.values.district
    )[0];
    setDistrict(district);
    const isEdit = beneficiarie && beneficiarie?.id;
    setIsEdit(isEdit);

    const newObject = await database.write(async () => {
      const locality = localities.filter(
        (item) => item.online_id === formik.values.locality
      )[0];
      const organization_id =
        loggedUser.partner_id == undefined
          ? loggedUser.partners?.id
          : loggedUser.partner_id;

      if (isEdit) {
        const beneficiaryToUpdate = await database
          .get("beneficiaries")
          .find(beneficiarie?.id);
        const updateBeneficiary = await beneficiaryToUpdate.update(() => {
          (beneficiarie.surname = formik.values.surname),
            (beneficiarie.name = formik.values.name),
            (beneficiarie.nick_name = formik.values.nick_name),
            (beneficiarie.date_of_birth = formik.values.date_of_birth),
            (beneficiarie.gender = formik.values.gender),
            (beneficiarie.address = formik.values.address),
            (beneficiarie.phone_number = formik.values.phone_number),
            (beneficiarie.e_mail = formik.values.e_mail),
            (beneficiarie.partner_id = formik.values?.partner_id),
            (beneficiarie.entry_point = formik.values.entry_point),
            (beneficiarie.us_id = formik.values.us_id),
            (beneficiarie.neighborhood_id = formik.values.neighborhood_id),
            (beneficiarie.status = 1),
            (beneficiarie.locality_id = formik.values.locality),
            (beneficiarie.locality_name = locality.name),
            (beneficiarie.district_id = formik.values.district),
            (beneficiarie.district_code = district.code),
            (beneficiarie.province_id = formik.values.province),
            (beneficiarie.date_updated = moment(new Date()).format(
              "YYYY-MM-DD HH:mm:ss"
            )),
            (beneficiarie.nationality = 1),
            (beneficiarie.enrollment_date = formik.values.enrollment_date);
          (beneficiarie.vblt_lives_with = formik.values.vblt_lives_with),
            (beneficiarie.vblt_house_sustainer = Number(
              formik.values.vblt_house_sustainer
            )),
            (beneficiarie.vblt_is_orphan = Number(
              formik.values.vblt_is_orphan
            )),
            (beneficiarie.vblt_is_student = Number(
              formik.values.vblt_is_student
            )),
            (beneficiarie.vblt_school_grade = formik.values.vblt_school_grade),
            (beneficiarie.vblt_school_name = formik.values.vblt_school_name),
            (beneficiarie.vblt_is_deficient = Number(
              formik.values.vblt_is_deficient
            )),
            (beneficiarie.vblt_deficiency_type =
              formik.values.vblt_deficiency_type),
            (beneficiarie._status = "updated");
        });
        return updateBeneficiary;
      }

      // get prefix and nui
      const getPrefix: any = (
        await database.get("sequences").query().fetch()
      )[0]?._raw;
      const newNui = Number(getPrefix.last_nui) + 1;
      const fullNUI = `${getPrefix.prefix}${String(newNui).padStart(7, "0")}`;

      const newBeneficiary = await database.collections
        .get("beneficiaries")
        .create((beneficiary: any) => {
          (beneficiary.nui = fullNUI),
            (beneficiary.surname = formik.values.surname),
            (beneficiary.name = formik.values.name),
            (beneficiary.nick_name = formik.values.nick_name),
            (beneficiary.date_of_birth = formik.values.date_of_birth),
            (beneficiary.gender = "1"),
            (beneficiary.address = formik.values.address),
            (beneficiary.phone_number = formik.values.phone_number),
            (beneficiary.e_mail = formik.values.e_mail),
            (beneficiary.organization_id = organization_id),
            (beneficiary.partner_id = formik.values?.partner_id),
            (beneficiary.entry_point = formik.values.entry_point),
            (beneficiary.us_id = formik.values.us_id),
            (beneficiary.neighborhood_id = formik.values.neighborhood_id),
            (beneficiary.date_created = moment(new Date()).format(
              "YYYY-MM-DD HH:mm:ss"
            )),
            (beneficiary.status = 1),
            (beneficiary.locality_id = formik.values.locality),
            (beneficiary.locality_name = locality.name),
            (beneficiary.district_id = formik.values.district),
            (beneficiary.district_code = district.code),
            (beneficiary.province_id = formik.values.province),
            (beneficiary.nationality = 1),
            (beneficiary.enrollment_date = formik.values.enrollment_date);
          (beneficiary.vblt_lives_with = formik.values.vblt_lives_with),
            (beneficiary.vblt_house_sustainer = Number(
              formik.values.vblt_house_sustainer
            )),
            (beneficiary.vblt_is_orphan = Number(formik.values.vblt_is_orphan)),
            (beneficiary.vblt_is_student = Number(
              formik.values.vblt_is_student
            )),
            (beneficiary.vblt_school_grade = formik.values.vblt_school_grade),
            (beneficiary.vblt_school_name = formik.values.vblt_school_name),
            (beneficiary.vblt_is_deficient = Number(
              formik.values.vblt_is_deficient
            )),
            (beneficiary.vblt_deficiency_type =
              formik.values.vblt_deficiency_type);
        });

      const sequenceToUpdate = await database
        .get("sequences")
        .find(getPrefix.id);
      await sequenceToUpdate.update((sequence: any) => {
        sequence.last_nui = String(newNui);
      });
      return newBeneficiary;
    });

    return newObject;
  };

  const handleOk = async (beneficiarie?: any) => {
    const interventions = beneficiaries_interventions.filter((e) => {
      return e._raw.beneficiary_id == beneficiarie.online_id;
    });

    const interventionObjects = interventions.map((e) => {
      const subservice = subServices.filter((item) => {
        return item._raw.online_id == e._raw.sub_service_id;
      })[0];
      return {
        id: subservice._raw.online_id,
        name: subservice._raw.name,
        intervention: e._raw,
      };
    });

    const beneficiaryId = beneficiarie.online_id
      ? beneficiarie.online_id
      : beneficiarie.id;
    const references = await database
      .get("references")
      .query(Q.where("beneficiary_id", beneficiaryId))
      .fetch();

    const beneficiaryReferencesSerializable = references.map((e) => {
      return e._raw;
    });

    navigationRef.reset({
      index: 0,
      routes: [
        {
          name: "BeneficiariesView",
          params: {
            beneficiary: beneficiarie,
            interventions: interventionObjects,
            references: beneficiaryReferencesSerializable,
          },
        },
      ],
    });

    setShowModal(false);
  };

  const onChangeName = (name) => {
    const result = name.replace(
      /[^a-zA-Z_-àáâãèéêìíòóõúçÀÁÂÃÈÉÊÌÍÒÓÕÚÇ]/gi,
      ""
    );
    formik.setFieldValue("name", result);
  };

  const onChangeProvinces = useCallback(async (provId: any) => {
    const getDistList = await database
      .get("districts")
      .query(Q.where("province_id", provId))
      .fetch();
    const distsSerialized = getDistList.map((item) => item._raw);
    setDistricts(distsSerialized);
  }, []);

  const onChangeDistricts = useCallback(async (distId: any) => {
    const getLocList = await database
      .get("localities")
      .query(Q.where("district_id", distId))
      .fetch();
    const locsSerialized = getLocList.map((item) => item._raw);
    setLocalities(locsSerialized);
  }, []);

  const onChangeLocalities = useCallback(async (locId: any) => {
    const getNeiList = await database
      .get("neighborhoods")
      .query(Q.where("locality_id", Number(locId)))
      .fetch();
    const neiSerialized = getNeiList.map((item) => item._raw);
    setNeighborhoods(neiSerialized);

    const entryPoint = formik.values.entry_point;
    if (entryPoint) {
      const getUsList = await database
        .get("us")
        .query(
          Q.where("locality_id", Number(locId)),
          Q.where("entry_point", Number(entryPoint))
        )
        .fetch();
      const usSerialized = getUsList.map((item) => item._raw);
      setUss(usSerialized);
    }
  }, []);

  const onChangeEntryPoint = useCallback(async (entryPoint: any) => {
    const locality = formik.values.locality;
    if (locality) {
      const getUsList = await database
        .get("us")
        .query(
          Q.where("locality_id", Number(locality)),
          Q.where("entry_point", Number(entryPoint))
        )
        .fetch();
      const usSerialized = getUsList.map((item) => item._raw);
      setUss(usSerialized);
    }

    setLoadingData(false);
  }, []);

  const isStudentChange = async (value: any) => {
    setSchoolInfoEnabled(value == 1);
  };

  const onIsDeficientChange = async (value: any) => {
    setDeficiencyTypeEnabled(value == 1);
    formik.setFieldValue("vblt_deficiency_type", null);
  };

  const IdadePicker: React.FC<PickerProps> = () => {
    const onchangeAge = useCallback((value: any) => {
      const today = new Date();
      const birthYear = today.getFullYear() - value;
      const bDate = new Date(birthYear + "-01-01");
      setAge(value);

      formik.setFieldValue(
        "date_of_birth",
        getFormatedDate(bDate, "yyyy-MM-DD")
      );
      formik.setFieldValue("age", value);
    }, []);

    return (
      <Picker
        style={styles.textBlack}
        enabled={!isDateRequired}
        onValueChange={onchangeAge}
        selectedValue={age}
        placeholder="Seleccione a Idade"
      >
        <Picker.Item label="-- Seleccione a Idade --" value="0" />
        {idades.map((item) => (
          <Picker.Item key={item} value={item} label={item}></Picker.Item>
        ))}
      </Picker>
    );
  };

  useEffect(() => {
    formik.setFieldValue("vblt_lives_with", value?.toString());
  }, [value]);

  const handleDataFromDatePickerComponent = useCallback(
    (selectedDate, fieldName) => {
      const tempDate = new Date(selectedDate);
      formik.setFieldValue(fieldName, moment(tempDate).format("YYYY-MM-DD"));

      setAge(calculateAge(selectedDate) + "");
      formik.setFieldValue("age", calculateAge(selectedDate) + "");
    },
    []
  );

  return (
    <>
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <ProgressSteps>
          <ProgressStep
            label="Dados Pessoais"
            onNext={onNextStep}
            errors={errors}
            nextBtnStyle={styles.buttonStyle}
            nextBtnTextStyle={styles.buttonTextStyle}
            nextBtnText="Proximo >>"
          >
            <View style={{ alignItems: "center" }}>
              {loadingData ? (
                <Spinner
                  visible={true}
                  textContent={"Carregando dados..."}
                  textStyle={styles.spinnerTextStyle}
                />
              ) : (
                <VStack space={3} w="90%">
                  <FormControl
                    style={{
                      display: beneficiarie === undefined ? "none" : "flex",
                    }}
                  >
                    <FormControl.Label>NUI</FormControl.Label>
                    <Text style={styles.formNUI}>
                      {beneficiarie === undefined ? "" : beneficiarie.nui}
                    </Text>
                  </FormControl>
                  <FormControl
                    style={{
                      display: beneficiarie === undefined ? "none" : "flex",
                    }}
                  >
                    <FormControl.Label>Sexo</FormControl.Label>
                    <Radio.Group
                      value={formik.values.gender + ""}
                      onChange={(itemValue) => {
                        formik.setFieldValue("gender", itemValue);
                      }}
                      name="gender"
                      accessibilityLabel="pick a size"
                    >
                      <Stack
                        direction={{ base: "row", md: "row" }}
                        alignItems={{
                          base: "flex-start",
                          md: "center",
                        }}
                        space={4}
                        w="75%"
                        maxW="300px"
                      >
                        <Radio value="1" colorScheme="green" size="md" my={1}>
                          M
                        </Radio>
                        <Radio value="2" colorScheme="green" size="md" my={1}>
                          F
                        </Radio>
                      </Stack>
                    </Radio.Group>
                  </FormControl>
                  <FormControl
                    isRequired
                    isInvalid={"surname" in formik.errors}
                    style={{
                      display: beneficiarie === undefined ? "flex" : "none",
                    }}
                  >
                    <FormControl.Label>Apelido</FormControl.Label>
                    <Input
                      onBlur={formik.handleBlur("surname")}
                      placeholder="Insira o Apelido"
                      onChangeText={formik.handleChange("surname")}
                      value={formik.values.surname}
                    />
                    <FormControl.ErrorMessage>
                      {formik.errors.surname}
                    </FormControl.ErrorMessage>
                  </FormControl>
                  <FormControl
                    isRequired
                    isInvalid={"name" in formik.errors}
                    style={{
                      display: beneficiarie === undefined ? "flex" : "none",
                    }}
                  >
                    <FormControl.Label>Nome</FormControl.Label>
                    <Input
                      onBlur={formik.handleBlur("name")}
                      placeholder="Insira o Nome"
                      onChangeText={(name) => onChangeName(name)}
                      value={formik.values.name}
                    />
                    <FormControl.ErrorMessage>
                      {formik.errors.name}
                    </FormControl.ErrorMessage>
                  </FormControl>
                  <FormControl
                    isRequired={isDateRequired}
                    isInvalid={"date_of_birth" in formik.errors}
                  >
                    <FormControl.Label>Data Nascimento</FormControl.Label>

                    <HStack w="100%" flex={1} space={5} alignItems="center">
                      <InputGroup w={{ base: "70%", md: "285" }}>
                        <InputLeftAddon>
                          <MyDatePicker
                            onDateSelection={(e) =>
                              handleDataFromDatePickerComponent(
                                e,
                                "date_of_birth"
                              )
                            }
                            minDate={minBirthYear}
                            maxDate={maxBirthYear}
                            currentDate={
                              beneficiarie?.date_of_birth
                                ? new Date(beneficiarie?.date_of_birth)
                                : new Date()
                            }
                          />
                        </InputLeftAddon>
                        <Input
                          isDisabled
                          w={{ base: "70%", md: "100%" }}
                          onPressIn={() => {
                            /**None */
                          }}
                          onBlur={formik.handleBlur("name")}
                          value={formik.values.date_of_birth}
                          // onChangeText={formik.handleChange('date_of_birth')}
                          //value={moment(new Date(datePickerValue)).format('YYYY-MM-DD')}
                          placeholder="yyyy-MM-dd"
                        />
                      </InputGroup>
                    </HStack>

                    <FormControl.ErrorMessage>
                      {formik.errors.date_of_birth}
                    </FormControl.ErrorMessage>
                  </FormControl>
                  <FormControl>
                    <Checkbox
                      isInvalid
                      value="invalid"
                      onChange={onChangeCheckbox}
                    >
                      <Text>Não Conhece a Data de Nascimento</Text>
                    </Checkbox>
                  </FormControl>
                  <FormControl
                    isRequired={!isDateRequired}
                    isInvalid={"age" in formik.errors}
                  >
                    <FormControl.Label>Idade (em anos)</FormControl.Label>
                    <IdadePicker />
                    <FormControl.ErrorMessage>
                      {formik.errors.age}
                    </FormControl.ErrorMessage>
                  </FormControl>
                  <FormControl
                    isRequired
                    isInvalid={"nationality" in formik.errors}
                  >
                    <FormControl.Label>Nacionalidade</FormControl.Label>
                    <Picker
                      enabled={false}
                      style={styles.dropDownPickerDisabled}
                      selectedValue={formik.values.nationality}
                      onValueChange={(itemValue, itemIndex) => {
                        if (itemIndex !== 0) {
                          formik.setFieldValue("nationality", itemValue);
                        }
                      }}
                    >
                      <Picker.Item
                        label="-- Seleccione a nacionalidade --"
                        value="0"
                      />
                      <Picker.Item key="1" label="Moçambicana" value="1" />
                    </Picker>
                    <FormControl.ErrorMessage>
                      {formik.errors.nationality}
                    </FormControl.ErrorMessage>
                  </FormControl>
                  <FormControl
                    isRequired
                    isInvalid={"enrollment_date" in formik.errors}
                  >
                    <FormControl.Label>Data Inscrição</FormControl.Label>
                    <HStack w="100%" flex={1} space={5} alignItems="center">
                      <InputGroup w={{ base: "70%", md: "285" }}>
                        <InputLeftAddon>
                          <MyDatePicker
                            onDateSelection={(e) =>
                              handleDataFromDatePickerComponent(
                                e,
                                "enrollment_date"
                              )
                            }
                            minDate={new Date("2017-01-01")}
                            maxDate={new Date()}
                            currentDate={
                              beneficiarie?.enrollment_date
                                ? new Date(beneficiarie?.enrollment_date)
                                : new Date()
                            }
                          />
                        </InputLeftAddon>
                        <Input
                          isDisabled
                          w={{ base: "70%", md: "100%" }}
                          onPressIn={() => {
                            /**None */
                          }}
                          onBlur={formik.handleBlur("name")}
                          value={formik.values.enrollment_date}
                          onChangeText={formik.handleChange("enrollment_date")}
                          //value={moment(new Date(datePickerValue)).format('YYYY-MM-DD')}
                          placeholder="yyyy-MM-dd"
                        />
                      </InputGroup>
                    </HStack>

                    <FormControl.ErrorMessage>
                      {formik.errors.enrollment_date}
                    </FormControl.ErrorMessage>
                  </FormControl>
                  <FormControl
                    isRequired
                    isInvalid={"province" in formik.errors}
                    style={{ display: isProvEnable ? "flex" : "none" }}
                  >
                    <FormControl.Label>Provincia</FormControl.Label>
                    <Picker
                      enabled={isProvEnable}
                      style={styles.dropDownPickerDisabled}
                      selectedValue={formik.values.province}
                      onValueChange={(itemValue, itemIndex) => {
                        if (itemIndex !== 0) {
                          formik.setFieldValue("province", itemValue);
                          onChangeProvinces(itemValue);
                        }
                      }}
                    >
                      <Picker.Item
                        label="-- Seleccione a Província --"
                        value="0"
                      />
                      {provinces.map((item) => (
                        <Picker.Item
                          key={item.online_id}
                          label={item.name}
                          value={item.online_id}
                        />
                      ))}
                    </Picker>
                    <FormControl.ErrorMessage>
                      {formik.errors.province}
                    </FormControl.ErrorMessage>
                  </FormControl>
                  <FormControl
                    isRequired
                    isInvalid={"district" in formik.errors}
                    style={{ display: isDisEnable ? "flex" : "none" }}
                  >
                    <FormControl.Label>Distrito</FormControl.Label>
                    <Picker
                      enabled={isDisEnable}
                      style={styles.dropDownPickerDisabled}
                      selectedValue={formik.values.district}
                      onValueChange={(itemValue, itemIndex) => {
                        if (itemIndex !== 0) {
                          formik.setFieldValue("district", itemValue);
                          onChangeDistricts(itemValue);
                        }
                      }}
                    >
                      <Picker.Item
                        label="-- Seleccione o Distrito --"
                        value="0"
                      />
                      {districts.map((item) => (
                        <Picker.Item
                          key={item.online_id}
                          label={item.name}
                          value={item.online_id}
                        />
                      ))}
                    </Picker>
                    <FormControl.ErrorMessage>
                      {formik.errors.district}
                    </FormControl.ErrorMessage>
                  </FormControl>
                  <FormControl
                    isRequired
                    isInvalid={"locality" in formik.errors}
                    style={{ display: isEnable ? "flex" : "none" }}
                  >
                    <FormControl.Label>Posto Administrativo</FormControl.Label>
                    <Picker
                      enabled={isEnable}
                      style={styles.dropDownPickerDisabled}
                      selectedValue={formik.values.locality}
                      onValueChange={(itemValue, itemIndex) => {
                        if (itemIndex !== 0) {
                          formik.setFieldValue("locality", itemValue);
                          onChangeLocalities(itemValue);
                        }
                      }}
                    >
                      <Picker.Item
                        label="-- Seleccione o Posto Administrativo --"
                        value="0"
                      />
                      {localities.map((item) => (
                        <Picker.Item
                          key={item.online_id}
                          label={item.name}
                          value={item.online_id}
                        />
                      ))}
                    </Picker>
                    <FormControl.ErrorMessage>
                      {formik.errors.locality}
                    </FormControl.ErrorMessage>
                  </FormControl>
                  <FormControl
                    isRequired
                    isInvalid={"entry_point" in formik.errors}
                  >
                    <FormControl.Label>Ponto de Entrada</FormControl.Label>
                    <Picker
                      style={styles.textBlack}
                      selectedValue={
                        formik.values.entry_point
                          ? formik.values.entry_point
                          : loggedUser.entry_point !== undefined
                          ? loggedUser.entry_point
                          : loggedUser.entryPoint
                      }
                      onValueChange={(itemValue, itemIndex) => {
                        if (itemIndex !== 0) {
                          formik.setFieldValue("entry_point", itemValue);
                          onChangeEntryPoint(itemValue);
                        }
                      }}
                    >
                      <Picker.Item label="-- Seleccione o PE --" value="0" />
                      {isUsVisible && (
                        <Picker.Item key="1" label="US" value="1" />
                      )}
                      <Picker.Item key="2" label="CM" value="2" />
                      <Picker.Item key="3" label="ES" value="3" />
                    </Picker>
                    <FormControl.ErrorMessage>
                      {formik.errors.entry_point}
                    </FormControl.ErrorMessage>
                  </FormControl>
                  <FormControl isRequired isInvalid={"us_id" in formik.errors}>
                    <FormControl.Label>Local</FormControl.Label>
                    <Picker
                      style={styles.textBlack}
                      selectedValue={formik.values.us_id}
                      onValueChange={(itemValue, itemIndex) => {
                        if (itemIndex !== 0) {
                          formik.setFieldValue("us_id", itemValue);
                        }
                      }}
                    >
                      <Picker.Item label="-- Seleccione o Local --" value="0" />
                      {uss.map((item) => (
                        <Picker.Item
                          key={item.online_id}
                          label={item.name}
                          value={item.online_id}
                        />
                      ))}
                    </Picker>
                    <FormControl.ErrorMessage>
                      {formik.errors.us_id}
                    </FormControl.ErrorMessage>
                  </FormControl>
                  <FormControl
                    style={{
                      display: beneficiarie === undefined ? "flex" : "none",
                    }}
                  >
                    <FormControl.Label>Alcunha</FormControl.Label>
                    <Input
                      onBlur={formik.handleBlur("nick_name")}
                      placeholder="Insira a Alcunha"
                      onChangeText={formik.handleChange("nick_name")}
                      value={formik.values.nick_name}
                    />
                  </FormControl>
                  <FormControl>
                    <FormControl.Label>
                      Endereço (Ponto de Referência)
                    </FormControl.Label>
                    <Input
                      onBlur={formik.handleBlur("address")}
                      placeholder="Insira o Endereço"
                      onChangeText={formik.handleChange("address")}
                      value={formik.values.address}
                    />
                  </FormControl>
                  <FormControl isInvalid={"phone_number" in formik.errors}>
                    <FormControl.Label>Telemóvel</FormControl.Label>
                    <Input
                      onBlur={formik.handleBlur("phone_number")}
                      keyboardType="number-pad"
                      maxLength={9}
                      placeholder="Insira o Telemóvel"
                      onChangeText={formik.handleChange("phone_number")}
                      value={formik.values.phone_number}
                    />
                    <FormControl.ErrorMessage>
                      Apenas numeros!!!
                    </FormControl.ErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={"e_mail" in formik.errors}>
                    <FormControl.Label>E-mail</FormControl.Label>
                    <Input
                      onBlur={formik.handleBlur("e_mail")}
                      placeholder="Insira o E_mail"
                      onChangeText={formik.handleChange("e_mail")}
                      value={formik.values.e_mail}
                    />
                    <FormControl.ErrorMessage>
                      {formik.errors.e_mail}
                    </FormControl.ErrorMessage>
                  </FormControl>
                  <FormControl
                    isRequired
                    isInvalid={"neighborhood_id" in formik.errors}
                  >
                    <FormControl.Label>Bairro</FormControl.Label>
                    <Picker
                      style={styles.textBlack}
                      selectedValue={formik.values.neighborhood_id}
                      onValueChange={(itemValue, itemIndex) => {
                        if (itemIndex !== 0) {
                          formik.setFieldValue("neighborhood_id", itemValue);
                        }
                      }}
                    >
                      <Picker.Item
                        label="-- Seleccione o Bairro --"
                        value="0"
                      />
                      {neighborhoods.map((item) => (
                        <Picker.Item
                          key={item.online_id}
                          label={item.name}
                          value={item.online_id}
                        />
                      ))}
                    </Picker>
                    <FormControl.ErrorMessage>
                      {formik.errors.neighborhood_id}
                    </FormControl.ErrorMessage>
                  </FormControl>
                </VStack>
              )}
            </View>
          </ProgressStep>
          <ProgressStep
            label="Critérios de Eligibilidade Gerais"
            onPrevious={onPreviousStep}
            onSubmit={onNextStep2}
            errors={errors}
            previousBtnStyle={styles.buttonStyle}
            previousBtnTextStyle={styles.buttonTextStyle}
            nextBtnTextStyle={styles.buttonTextSaveStyle}
            nextBtnStyle={styles.buttonSaveStyle}
            finishBtnText="Salvar"
            previousBtnText="<< Anterior"
          >
            <View style={{ alignItems: "center" }}>
              <VStack space={3} w="90%">
                <FormControl
                  style={{
                    display: beneficiarie === undefined ? "none" : "flex",
                  }}
                >
                  <FormControl.Label>NUI</FormControl.Label>
                  <Text style={styles.formNUI}>
                    {beneficiarie === undefined ? "" : beneficiarie.nui}
                  </Text>
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={"vblt_lives_with" in formik.errors}
                >
                  <FormControl.Label>Com quem mora?</FormControl.Label>
                  <Checkbox.Group
                    onChange={setValue}
                    value={value}
                    accessibilityLabel="choose numbers"
                  >
                    {items.map((item) => {
                      return (
                        <Checkbox
                          key={item.value}
                          value={item.value}
                          colorScheme="green"
                        >
                          {item.label}
                        </Checkbox>
                      );
                    })}
                  </Checkbox.Group>

                  <FormControl.ErrorMessage>
                    {formik.errors.vblt_lives_with}
                  </FormControl.ErrorMessage>
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={"vblt_house_sustainer" in formik.errors}
                >
                  <FormControl.Label>Sustenta a Casa?</FormControl.Label>
                  <Radio.Group
                    value={formik.values.vblt_house_sustainer + ""}
                    onChange={(itemValue) => {
                      formik.setFieldValue("vblt_house_sustainer", itemValue);
                    }}
                    name="rg1"
                    accessibilityLabel="pick a size"
                  >
                    <Stack
                      direction={{ base: "row", md: "row" }}
                      alignItems={{
                        base: "flex-start",
                        md: "center",
                      }}
                      space={4}
                      w="75%"
                      maxW="300px"
                    >
                      <Radio
                        key="rd1"
                        value="1"
                        colorScheme="green"
                        size="md"
                        my={1}
                      >
                        Sim
                      </Radio>
                      <Radio
                        key="rd2"
                        value="0"
                        colorScheme="green"
                        size="md"
                        my={1}
                      >
                        Não
                      </Radio>
                    </Stack>
                  </Radio.Group>
                  <FormControl.ErrorMessage>
                    {formik.errors.vblt_house_sustainer}
                  </FormControl.ErrorMessage>
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={"vblt_is_orphan" in formik.errors}
                >
                  <FormControl.Label>É Orfã?</FormControl.Label>
                  <Radio.Group
                    value={formik.values.vblt_is_orphan + ""}
                    onChange={(itemValue) => {
                      formik.setFieldValue("vblt_is_orphan", itemValue);
                    }}
                    name="rg2"
                    accessibilityLabel="pick a size"
                  >
                    <Stack
                      direction={{ base: "row", md: "row" }}
                      alignItems={{
                        base: "flex-start",
                        md: "center",
                      }}
                      space={4}
                      w="75%"
                      maxW="300px"
                    >
                      <Radio value="1" colorScheme="green" size="md" my={1}>
                        Sim
                      </Radio>
                      <Radio value="0" colorScheme="green" size="md" my={1}>
                        Não
                      </Radio>
                    </Stack>
                  </Radio.Group>
                  <FormControl.ErrorMessage>
                    {formik.errors.vblt_is_orphan}
                  </FormControl.ErrorMessage>
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={"vblt_is_student" in formik.errors}
                >
                  <FormControl.Label>Vai a Escola?</FormControl.Label>
                  <Radio.Group
                    value={formik.values.vblt_is_student + ""}
                    onChange={(itemValue) => {
                      formik.setFieldValue("vblt_is_student", itemValue);
                      isStudentChange(itemValue);
                    }}
                    name="rg3"
                    accessibilityLabel="pick a size"
                  >
                    <Stack
                      direction={{ base: "row", md: "row" }}
                      alignItems={{
                        base: "flex-start",
                        md: "center",
                      }}
                      space={4}
                      w="75%"
                      maxW="300px"
                    >
                      <Radio value="1" colorScheme="green" size="md" my={1}>
                        Sim
                      </Radio>
                      <Radio value="0" colorScheme="green" size="md" my={1}>
                        Não
                      </Radio>
                    </Stack>
                  </Radio.Group>
                  <FormControl.ErrorMessage>
                    {formik.errors.vblt_is_student}
                  </FormControl.ErrorMessage>
                </FormControl>
                <FormControl
                  isRequired={schoolInfoEnabled}
                  isInvalid={"vblt_school_grade" in formik.errors}
                >
                  <FormControl.Label>Classe</FormControl.Label>
                  <Picker
                    style={styles.textBlack}
                    selectedValue={formik.values.vblt_school_grade}
                    onValueChange={(itemValue, itemIndex) => {
                      if (itemIndex !== 0) {
                        formik.setFieldValue("vblt_school_grade", itemValue);
                      }
                    }}
                  >
                    <Picker.Item label="-- Seleccione --" value="0" />
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
                      <Picker.Item key={item} label={"" + item} value={item} />
                    ))}
                  </Picker>
                  <FormControl.ErrorMessage>
                    {formik.errors.vblt_school_grade}
                  </FormControl.ErrorMessage>
                </FormControl>
                <FormControl
                  isRequired={schoolInfoEnabled}
                  isInvalid={"vblt_school_name" in formik.errors}
                >
                  <FormControl.Label>
                    Nome da Instituição de Ensino
                  </FormControl.Label>
                  <Input
                    onBlur={formik.handleBlur("vblt_school_name")}
                    placeholder="Insira o nome da Instituição"
                    onChangeText={formik.handleChange("vblt_school_name")}
                    value={formik.values.vblt_school_name}
                  />
                  <FormControl.ErrorMessage>
                    {formik.errors.vblt_school_name}
                  </FormControl.ErrorMessage>
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={"vblt_is_deficient" in formik.errors}
                >
                  <FormControl.Label>Tem Deficiência?</FormControl.Label>
                  <Radio.Group
                    value={formik.values.vblt_is_deficient + ""}
                    onChange={(itemValue) => {
                      formik.setFieldValue("vblt_is_deficient", itemValue);
                      onIsDeficientChange(itemValue);
                    }}
                    name="rg4"
                    accessibilityLabel="pick a size"
                  >
                    <Stack
                      direction={{ base: "row", md: "row" }}
                      alignItems={{
                        base: "flex-start",
                        md: "center",
                      }}
                      space={4}
                      w="75%"
                      maxW="300px"
                    >
                      <Radio value="1" colorScheme="green" size="md" my={1}>
                        Sim
                      </Radio>
                      <Radio value="0" colorScheme="green" size="md" my={1}>
                        Não
                      </Radio>
                    </Stack>
                  </Radio.Group>
                  <FormControl.ErrorMessage>
                    {formik.errors.vblt_is_deficient}
                  </FormControl.ErrorMessage>
                </FormControl>
                <FormControl
                  isRequired={deficiencyTypeEnabled}
                  isInvalid={"vblt_deficiency_type" in formik.errors}
                >
                  <FormControl.Label>Tipo de Deficiência</FormControl.Label>
                  <Picker
                    style={styles.textBlack}
                    selectedValue={formik.values.vblt_deficiency_type}
                    onValueChange={(itemValue, itemIndex) => {
                      if (itemIndex !== 0) {
                        formik.setFieldValue("vblt_deficiency_type", itemValue);
                      }
                    }}
                    enabled={deficiencyTypeEnabled}
                  >
                    <Picker.Item label="-- Seleccione --" value="0" />
                    {[
                      "Não Anda",
                      "Não Fala",
                      "Não Vê",
                      "Não Ouve",
                      "Membro Amputado ou Deformado",
                      "Tem Algum Atraso Mental",
                    ].map((item) => (
                      <Picker.Item key={item} label={"" + item} value={item} />
                    ))}
                  </Picker>
                  <FormControl.ErrorMessage>
                    {formik.errors.vblt_deficiency_type}
                  </FormControl.ErrorMessage>
                </FormControl>
              </VStack>
            </View>
          </ProgressStep>
        </ProgressSteps>
      </View>
      {loading ? (
        <Spinner
          visible={true}
          textContent={
            beneficiarie
              ? "Actualizando Beneficiário..."
              : "Registando Beneficiário..."
          }
          textStyle={styles.spinnerTextStyle}
        />
      ) : undefined}
      <Center>
        <Modal isOpen={showModal} onClose={() => handleOk(beneficiarie)}>
          <Modal.Content maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>
              {isEdit ? "Confirmação Actualização" : "Confirmação Registo"}
            </Modal.Header>
            <Modal.Body>
              <ScrollView>
                <Box alignItems="center">
                  <Ionicons
                    name="md-checkmark-circle"
                    size={100}
                    color="#0d9488"
                  />
                  <Alert w="100%" status="success">
                    <HStack space={2} flexShrink={1}>
                      <Alert.Icon mt="1" />
                      <Text fontSize="sm" color="coolGray.800">
                        {isEdit
                          ? "Beneficiário Actualizado com Sucesso!"
                          : "Beneficiário Registado com Sucesso!"}
                      </Text>
                    </HStack>
                  </Alert>

                  <Text marginTop={3} marginBottom={3}>
                    NUI do Beneficiário:
                    <Text fontWeight="bold" color="#008D4C">
                      {` ${district?.code}/` + `${newNui}`}
                    </Text>
                  </Text>
                </Box>
              </ScrollView>
            </Modal.Body>
            <Modal.Footer>
              <Button.Group space={2}>
                <Button
                  variant="ghost"
                  colorScheme="blueGray"
                  onPress={() => {
                    handleOk(beneficiarie);
                  }}
                >
                  Concluir
                </Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </Center>
    </>
  );
};
const enhance = withObservables([], () => ({
  beneficiaries_interventions: database.collections
    .get("beneficiaries_interventions")
    .query(),
  subServices: database.collections.get("sub_services").query(),
}));
export default memo(enhance(BeneficiaryPartnerForm));
