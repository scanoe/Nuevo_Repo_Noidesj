const fs = require('fs')

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let listaCursosXusuario=[];

const inscribirCurso =(curso,usuario)=>{
    preparar();

    console.log(curso)
    console.log(usuario)
    let  existeid =listaCursosXusuario.find(C => (C.idCuso ==curso && C.idUsuario == usuario  ));
    if(existeid){console.log('El id existe')
    return 'El curso ya fue registrado para este usuario'
    }
     cursoXusuario ={
    idCuso:curso,
    idUsuario :usuario,

     }
     if(!(curso) || !(usuario) ){


    return 'Datos obligatorios faltantes';
     }

     listaCursosXusuario.push(cursoXusuario)
    guardar();
    return 'ingreso exitoso'
}

const preparar=()=>{
    try{
    listaCursosXusuario=JSON.parse(fs.readFileSync('CursosXusuario.json'))
    }catch(error){

        listaCursosXusuario=[];
    }
 
}


const guardar =()=>
{
    let datos = JSON.stringify(listaCursosXusuario)
    fs.writeFile('CursosXusuario.json',datos,(err)=>{
        if(err) throw (err);
        console.log('creacion exitosa')
    })
}

const ConsultarCursosXususario =() =>{
preparar();

return listaCursosXusuario

}

const eliminar = (id, usuario) =>{
    preparar();   
    let indice =listaCursosXusuario.findIndex(buscar => buscar.idCuso==id && buscar.idUsuario==usuario);
    listaCursosXusuario.splice(indice,1);
    guardar();
    console.log('*******')
    console.log(listaCursosXusuario)
    return listaCursosXusuario; 

} 
 /*
const inscritos = (idCurso) =>{
    preparar();
    let inscritos = '';
    listaCursosXusuario.forEach(i => { 
       if (i.idCuso == idCurso){
        inscritos = inscritos + i.idUsuario + ',';
        }
    })
    return inscritos;
}*/



//nuevo

const schema = mongoose.Schema;
const cursoXusuarioschema = new schema(
    {
        idCuso:{

            type :"String",
            require:true,
          
        },
        idUsuario :{

            type :"String",
            require:true,
           
        },
    
         }

)
cursoXusuarioschema.plugin(uniqueValidator)
cursoXusuarioschema.index({idCuso:1,idUsuario:1},{unique: true})

const cursoxusuario = mongoose.model("cursoxusuario",cursoXusuarioschema)
        
const inscritos = (idCurso,cursosusuario) =>{
  
    let inscritos = '';
    cursosusuario.forEach(i => { 
       if (i.idCuso == idCurso){
        inscritos = inscritos + i.idUsuario + ',';
        }
    })
    return inscritos;
}



module.exports={inscribirCurso,ConsultarCursosXususario,eliminar,inscritos,cursoxusuario}; 