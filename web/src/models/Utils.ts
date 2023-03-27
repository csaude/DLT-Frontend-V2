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

export function getUserParams(user: any) {

    var params;
    var level;
    if (user.provinces.length === 0 && user.districts.length === 0) {
        level = "CENTRAL";
        params = [];
    } else if (user.districts.length === 0) {
        level = "PROVINCIAL";
        params = user.provinces.map(p => p.id);
    } else if (user.localities.length === 0) {
        level = "DISTRITAL";
        params = user.districts.map(d => d.id);
    } else {
        level = "LOCAL";
        params = user.localities.map(l => l.id);
    }

    return {
        userId: user.id,
        level: level,
        params: params.join(',')
    }
}