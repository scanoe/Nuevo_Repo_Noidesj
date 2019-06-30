const fs = require('fs')

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
let listaUsuarios=[];

const CrearUsuario =(usuario)=>{
    preparar();
    let  existeid =listaUsuarios.find(C => C.documento ==usuario.documento);
    if(existeid){console.log('El Documento de identidad ya existe')
    return 'El id existe'
    }
     user ={
    documento:usuario.documento,
    nombre :usuario.nombre,
    usuario :usuario.usuario,
    correo: usuario.correo,
    password:usuario.password,
    telefono:usuario.telefono,
    rol:'aspirante'
     }
     if(!(usuario.documento) || !(usuario.nombre)|| !(usuario.correo)|| !(usuario.telefono) || !(usuario.usuario)|| !(usuario.password) ){


    return 'Datos obligatorios faltantes';
     }

     listaUsuarios.push(user)
    guardar();
    return 'ingreso exitoso'
}

const preparar=()=>{
    try{
        listaUsuarios=JSON.parse(fs.readFileSync('usuarios.json'))
    }catch(error){

        listaUsuarios=[];
    }
 
}


const guardar =()=>
{
    let datos = JSON.stringify(listaUsuarios)
    fs.writeFile('usuarios.json',datos,(err)=>{
        if(err) throw (err);
        console.log('creacion exitosa')
    })
}

const ConsultarUsuarios =() =>{
preparar();

return listaUsuarios

}

const actualizarUsuario = (usuario) =>{
    preparar()
    let encontrado = listaUsuarios.find(f => f.documento == usuario.documento);
    if (!encontrado){
        
        return 'El usuario no ha sido encontrado'
    }else{
        encontrado['nombre'] = usuario.nombre;
        encontrado['usuario'] = usuario.usuario;
        encontrado['correo'] = usuario.correo;
        encontrado['password'] = usuario.password;
        encontrado['telefono'] = usuario.telefono;
        encontrado['rol'] = usuario.rol;
        guardar()
        console.log(listaUsuarios)
        return 'El usuario ha sido Actualizado'
    }
    
}


// desde aca

const schema = mongoose.Schema;
const usuarioSchema = new schema({
    documento: {
        type :"String",
        require:true,
        unique:true
    },
    nombre :{
        type :"String",
        require:true
    },
    usuario :{
        type :"String",
        require:true,
        unique:true
    },
    correo:{
        type :"String",
        require:true
    },
    password:{
        type :"String",
        require:true
    },
    telefono:{
        type :"String",
        require:true
    },
    rol:{
        type :"String",
        require:true

    }
     

})

usuarioSchema.plugin(uniqueValidator)
const Usuario = mongoose.model("Usuario",usuarioSchema);

module.exports={CrearUsuario,ConsultarUsuarios,actualizarUsuario , Usuario};