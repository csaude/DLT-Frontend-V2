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

export function getMinDate() {
    var today = new Date();
    var day = today.getDate();
    var month = today.getMonth() + 1;
    var year = today.getFullYear();

    return new Date(year-24 + "/" + month + "/" + day);
}

export function getMaxDate() {
    var today = new Date();
    var day = today.getDate();
    var month = today.getMonth() + 1;
    var year = today.getFullYear();

    return new Date(year-9 + "/" + month + "/" + day);
}