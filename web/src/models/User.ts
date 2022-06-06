export interface UserModel {
    id?: string,
    surname?: string,
    name?: string,
    phoneNumber?: string,
    email?: string,
    username?: string,
    password?: string,
    entryPoint?: any,
    status?: any,
    createdBy?: string,
    dateCreated?: string,
    updatedBy?: string,
    dateUpdated?: string,
    locality?: any,
    partners?: any,
    profiles?: any,
    us?: any
}

export function getEntryPoint(value:any){
//console.log(value);
  if(value == '1'){
    return "Unidade Sanitaria";
  } else if(value == '2') {
    return "Escola";
  } 

  return "Comunidade";
}