import { configureStore } from "@reduxjs/toolkit";

import { authSlice } from "@app/store/reducers/auth";
import { uiSlice } from "@app/store/reducers/ui";
import { createLogger } from "redux-logger";
import referenceReducer from "./reducers/reference";
import beneficiaryReducer from "./reducers/beneficiary";
import interventionReducer from "./reducers/interventions";
import userReducer from "./reducers/user";
import { reportSlice } from "./reducers/report";
import { referenceInterventionSlice } from "./reducers/referenceIntervention";
import profileReducer from "./reducers/profile";
import partnerReducer from "./reducers/partner";
import provinceReducer from "./reducers/province";
import districtReducer from "./reducers/district";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    ui: uiSlice.reducer,
    beneficiary: beneficiaryReducer,
    reference: referenceReducer,
    intervention: interventionReducer,
    user: userReducer,
    profile: profileReducer,
    partner: partnerReducer,
    province: provinceReducer,
    district: districtReducer,
    report: reportSlice.reducer,
    referenceIntervention: referenceInterventionSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware().concat(createLogger()),
  ],
});

export default store;
