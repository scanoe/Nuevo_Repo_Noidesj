const nombre  ={
demand: true,
alias :'n'
}

const id ={
demand: true,
alias:'i'
}

const descripcion ={
demand :true,
alias:'d'
}
const valor ={
demand :true,
alias: 'v'
}
const modalidad={
demand: false,
alias:'m'
}
const Intensidad ={
demand:false,
alias:'in'
}
const Creacion ={
    id,
    nombre,
    descripcion,
    valor,
    modalidad,
    Intensidad
}




const argv= require('yargs').command('crear','crea un curso',Creacion).argv
module.exports={argv}