const fs = require('fs')
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
let listaCursos=[];

const CrearCurso =(curso)=>{
    preparar();
    let  existeid =listaCursos.find(C => C.id ==curso.id);
    if(existeid){console.log('El id existe')
    return 'El id existe'
    }
     curs ={
    id:curso.id,
    nombre :curso.nombre,
    descripcion: curso.descripcion,
    valor : curso.valor,
    modalidad : curso.modalidad,
    Intensidad: curso.Intensidad,
    estado:'disponible'
     }
     if(!(curso.id) || !(curso.nombre)|| !(curso.descripcion)|| !(curso.valor) ){


    return 'Datos obligatorios faltantes';
     }

     listaCursos.push(curs)
    guardar();
    return 'ingreso exitoso'
}

const preparar=()=>{
    try{
    listaCursos=JSON.parse(fs.readFileSync('cursos.json'))
    }catch(error){
 
        listaCursos=[];
    }
}

const guardar =()=>
{
    let datos = JSON.stringify(listaCursos)
    fs.writeFile('cursos.json',datos,(err)=>{
        if(err) throw (err);
        console.log('creacion exitosa')
    })
}

const ConsultarCursos =() =>{
preparar();

return listaCursos

}

const CerrarCurso = (idCurso) => {
   preparar();
   let cursoCerrado = listaCursos.find(buscar => buscar.id == idCurso);
   cursoCerrado.estado = 'Cerrado';
   guardar()
   return  listaCursos;
}



/// nuevo

const schema = mongoose.Schema;
const cursoSchema = new schema({
    id:{

        type :"String",
        require:true,
        unique:true
    },
    nombre :{

        type :"String",
        require:true
    },
    descripcion:{

        type :"String",
        require:true
    },
    valor : {

        type :"Number",
        require:true
    },
    Docente : {
        type :"String",
        require:false
    },
    modalidad : "String",
    Intensidad: "String",
    estado: {

        type :"String",
        require:true
    }
     })
     cursoSchema.plugin(uniqueValidator)
const curso = mongoose.model("curso",cursoSchema)

module.exports={CrearCurso,ConsultarCursos,CerrarCurso,curso};