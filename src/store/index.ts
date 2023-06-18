import { combineReducers, configureStore } from "@reduxjs/toolkit";

import authSlice from "./authSlice";
import beneficiarySlice from "./beneficiarySlice";
import referenceSlice from "./referenceSlice";
import beneficiaryInterventionSlice from "./beneficiaryInterventionSlice";
import provinceSlice from "./provinceSlice";
import districtSlice from "./districtSlice ";
import localitySlice from "./localitySlice";
import neighborhoodsSlice from "./neighborhoodsSlice";

const rootReducer = combineReducers({
  auth: authSlice,
  beneficiary: beneficiarySlice,
  reference: referenceSlice,
  beneficiaryIntervention: beneficiaryInterventionSlice,
  province: provinceSlice,
  district: districtSlice,
  locality: localitySlice,
  neighborhood: neighborhoodsSlice,
});

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
  reducer: rootReducer,
});

export default store;
