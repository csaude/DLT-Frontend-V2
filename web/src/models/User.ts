export interface UserModel {
  id?: string;
  surname?: string;
  name?: string;
  phoneNumber?: string;
  email?: string;
  username?: string;
  password?: string;
  entryPoint?: any;
  status?: any;
  createdBy?: string;
  dateCreated?: string;
  updatedBy?: string;
  dateUpdated?: string;
  locality?: any;
  partners?: any;
  profiles?: any;
}

export function getEntryPoint(value: any) {
  if (value == "1") {
    return "US";
  } else if (value == "2") {
    return "CM";
  }

  return "ES";
}
