

module.exports = {
    age: function (timestamp) {
        const today = new Date();
        const birthDate = new Date(timestamp);
    
        let age = today.getFullYear() - birthDate.getFullYear();
        const month = today.getMonth() - birthDate.getMonth();
    
        if (month < 0 || 
            month == 0 && 
            today.getDate() <= birthDate.getDate()) {
                age = age -1;
        }
    
        return age;
    },

    date: function (timestamp) {
        const date = new Date(timestamp);

        const year = date.getUTCFullYear();
        const month = `0${date.getUTCMonth() + 1}`.slice(-2); //mês é de 0 a 11, entao adiciona-se 1
        const day = `0${date.getUTCDate()}`.slice(-2);          //slice retorna os 2 ultimos caracteres caso o mes tenha 2 (12 = 012 / 1 = 01)

        return {
            day,
            month,
            year,
            iso: `${year}-${month}-${day}`,
            birthDay: `${day}-${month}-${year}`
        };
    }
}


