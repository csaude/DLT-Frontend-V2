import moment from 'moment';

export function calculateAge(value:any){
    var today = new Date();
    var bday = moment(value).format('YYYY-MM-DD')
    var birthDate = new Date(bday);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) 
    {
        age--;
    }

    return age;
}