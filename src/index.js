// const { argv }= require('./yargs');
const modeloIngresoCurso= require('./../Model/IngresarCursoModel')
const modelIngresoUsuario = require('./../Model/IngresarUsuarioModel')
const modelCursoXUsuario = require('./../Model/CursoXUsuarioModel')
const express = require('express')
const app = express()
const path= require('path')
const hbs = require('hbs')
const bodyParser = require("body-parser")
const mongoose = require('mongoose');
const helpers = require('./Helpers')
const session = require('express-session')
const port = process.env.PORT || 3000;
var MemoryStore = require('memorystore')(session)

const dirartials=path.join(__dirname,'../partials');
console.log(dirartials)
//console.log('C:/Users/Sebastian/Desktop/node/proyecto curso/partials')
hbs.registerPartials(dirartials);
app.set('view engine','hbs')
app.use(bodyParser.urlencoded({extended :false}))



const dirpublico = path.join(__dirname,'../public')
console.log(dirpublico)
app.use(express.static(dirpublico))
app.use(session({
  cookie: { maxAge: 86400000 },
  store: new MemoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
  secret: 'keyboard cat'
}))

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))


app.get('/', function (req, res) {  
  res.render("Login.hbs",{mensaje: ''})
})

app.post('/login',function (req,res) {
  let datos = req.body
    
  let consulta = modelIngresoUsuario.ConsultarUsuarios()

 
  //let  existe = consulta.find(C => (C.usuario == datos.user && C.password == datos.password));
  let existe
 modelIngresoUsuario.Usuario.findOne({usuario: datos.user, password : datos.password })
.exec((err,existe)=>{

  if (err){console.log(err)}
  else{

    if(existe){
      //console.log(existe)
      req.session.usuario = existe.documento
      req.session.nombre = existe.nombre
      req.session.rol = existe.rol
      if(existe.rol=='coordinador'){
        res.render('PaginaPrincipalCoordinador.hbs',{usuario :existe})
      }else if(existe.rol=='aspirante'){
        //console.log('documento del aspirante'+ existe.documento)
        res.render("PaginaPrincipalAspirante.hbs",{UsuarioID : existe.documento})
      }else if(existe.rol= 'Docente'){
        res.render("PaginaDocente.hbs",{UsuarioID : existe.documento})
      }
      }else{  
        res.render("Login.hbs",{mensaje: 'usuario invalido'})
      }


  }
})

 

})

app.get('/NuevoCurso', function (req, res) {
  res.render("NuevoCurso.hbs")
})

app.get('/NuevoUsuario', function (req, res) {
  res.render('NuevoUsuario.hbs')
})

app.get('/IngresarCurso', function (req, res) {
  console.log(req.query)
  let resp = modeloIngresoCurso.CrearCurso(req.query)
  let curso = new modeloIngresoCurso.curso(
    {
    id:req.query.id,
    nombre :req.query.nombre,
    descripcion: req.query.descripcion,
    valor : req.query.valor,
    modalidad : req.query.modalidad,
    Intensidad: req.query.Intensidad,
    estado:'disponible'
  })
  curso.save((err,resp)=>{

    if (err){
      console.log("Error de acceso a la base de datos")
      res.send("Error de insercion de curso")
    } else(
      modeloIngresoCurso.curso.find({}).exec((err,resp)=>{
        console.log(res)
        res.render('ListarCursos',{
          Cursos: resp
        })

      })

    )
  })
/*
  res.render('ListarCursos',{
    Cursos: modeloIngresoCurso.ConsultarCursos()
  })
*/
})

app.get('/IngresarUsuario', function (req, res) {
  console.log(req.query)
  let resp = modelIngresoUsuario.CrearUsuario(req.query)
  let estudiante = new modelIngresoUsuario.Usuario({
    documento:req.query.documento,
    nombre :req.query.nombre,
    usuario :req.query.usuario,
    correo: req.query.correo,
    password:req.query.password,
    telefono:req.query.telefono,
    rol:'aspirante'
     })
     estudiante.save((err,resul)=>{
       if (err){
         console.log("Error de insercion")
       }
       else{
        res.render("Login.hbs", {mensaje: 'Su Registro fue Exitoso ahora puede ingresar con su usuario y contraseña'})
       }
     });
  //res.send(resp)
 // res.render("Login.hbs", {mensaje: 'Su Registro fue Exitoso ahora puede ingresar con su usuario y contraseña'})
})

app.get('/ListaCursos', function (req, res) {
  modeloIngresoCurso.curso.find({}).exec((err,query)=>{
    if (err){
      res.send(err.message)
    }else{
      res.render('ListarCursos',{
        Cursos: query
      })
    }

  })
/*
  res.render('ListarCursos',{
    Cursos: modeloIngresoCurso.ConsultarCursos()
  })
  */
})

app.get('/ListaCursosDisponibles', function (req, res) {
  console.log(req.query)
  modeloIngresoCurso.curso.find({}).exec((err,query)=>{
    if (err){
      res.send(err.message)
    }else{
      res.render('ListarCursosDisponibles',{
        Cursos: query,
        UsuarioID: req.query.UsuarioID,
        mensaje:''
      })
    }

  })

/*

  res.render('ListarCursosDisponibles',{
    Cursos: modeloIngresoCurso.ConsultarCursos(),
    UsuarioID: req.query.UsuarioID,
    mensaje:''
  })*/
})

app.post('/InscribirCurso', function (req, res) {
  let datos = req.body
 // let resp = modelCursoXUsuario.inscribirCurso(datos.curso,datos.UsuarioID)
modeloIngresoCurso.curso.find({}).exec((err,query)=>{
  if(err){

    res.send("Error 404")
  }else{
    if(!(datos.curso) || !(datos.UsuarioID) ){
      res.render('ListarCursosDisponibles',{
        Cursos: query,
        UsuarioID: req.body.UsuarioID,
        mensaje:'Datos obligatorios faltantes'
      })
       }else{
        let cursoXusuario = new modelCursoXUsuario.cursoxusuario({
          idCuso:datos.curso,
          idUsuario :datos.UsuarioID,
        })
        cursoXusuario.save((err,resp)=>{
          if (err){
            res.render('ListarCursosDisponibles',{
              Cursos: query,
              UsuarioID: req.body.UsuarioID,
              mensaje:'El curso ya fue inscrito'
            })
          }else{
            console.log("aca "+query)
            res.render('ListarCursosDisponibles',{
              Cursos: query,
              UsuarioID: req.body.UsuarioID,
              mensaje:'Curso Inscrito con exito'
            })
          }
        })
       }
  }
})
/*
  
  res.render('ListarCursosDisponibles',{
    Cursos: modeloIngresoCurso.ConsultarCursos(),
    UsuarioID: req.body.UsuarioID,
    mensaje:resp
  })

  */
})

app.get('/ListaCursosInscritos', function (req, res) {
  //console.log(req.query)
  modelCursoXUsuario.cursoxusuario.find({}).exec((err,query)=>{
    if (err){

      res.send("Error 404")
    }else{

      modeloIngresoCurso.curso.find({}).exec((err,cursos)=>{
        if (err){
          res.send("Error 404")
        }else{

          res.render('ListarCursosInscritos',{
            CursosUsuario: query,
            UsuarioID: req.query.UsuarioID,
            listacursos:cursos,
            mensaje:''
          })
        }


      })
    }


    
  })
 /*
  res.render('ListarCursosInscritos',{
    CursosUsuario: modelCursoXUsuario.ConsultarCursosXususario(),
    UsuarioID: req.query.UsuarioID,
    mensaje:''
  })*/
})

app.get('/EliminaCursoInscrito', function (req, res) {
  //let lista = modelCursoXUsuario.eliminar(req.query.idCuso, req.query.UsuarioID)
  modelCursoXUsuario.cursoxusuario.findOneAndDelete({idCuso:req.query.idCuso,idUsuario:req.query.UsuarioID}).exec((err)=>{
    if (err){
      res.send("Error 404")
    }else{
      modelCursoXUsuario.cursoxusuario.find({}).exec((err,lista)=>{
          if(err){
            res.send("Error 404")
          }else{
            modeloIngresoCurso.curso.find({}).exec((err,cursos)=>{
              if (err){
                res.send("Error 404")
              }else{
                res.render('ListarCursosInscritos',{
                  CursosUsuario: lista,
                  UsuarioID: req.query.UsuarioID,
                  listacursos:cursos,
                  mensaje:''
                })
              }
            })
 
          }
      })
    }
  })

/*
  res.render('ListarCursosInscritos',{
    CursosUsuario: lista,
    UsuarioID: req.query.UsuarioID,
    mensaje:''
  })*/
})

app.get('/EliminaUsuarioCurso', function (req, res) {
  res.render('EliminarUsuarioxCurso')
})

app.get('/EliminaUsuarioDeCurso', function (req, res) {
// let lista = modelCursoXUsuario.eliminar(req.query.idCuso, req.query.UsuarioID)
  console.log ("curso :"+req.query.idCuso)
  console.log('-------')
  console.log("usuario :"+req.query.UsuarioID)
  modelCursoXUsuario.cursoxusuario.findOneAndDelete({idCuso:req.query.idCuso,idUsuario:req.query.UsuarioID}).exec((err)=>{
    if (err){
      res.send("Error 404")
    }else{
      modelCursoXUsuario.cursoxusuario.find({idCuso : '12'}).exec((err,lista)=>{
          if(err){
            res.send("Error 404")
          }else{
            modeloIngresoCurso.curso.findOne({id : '1'}).exec((err,cursos)=>{
              if (err){
                res.send("Error 404")
              }else{
                console.log(cursos)
                console.log(lista)
                res.render('ListarInscritosEnCurso',{
                  UsuariosxCurso: lista,
                  UsuarioID: req.query.UsuarioID,
                  curso : cursos,
                  mensaje:''
                })
              }
            })
            
          }
      })
    }
  })
  

  /*
  res.render('ListarInscritosEnCurso',{
    UsuariosxCurso: lista.filter(filtro => filtro.idCuso == req.query.idCuso),
    UsuarioID: req.query.UsuarioID,
    mensaje:''
  })*/

})

app.get('/ListaInscritosxCursos', function (req, res) {
modeloIngresoCurso.curso.find({}).exec((err,query)=>{
  if (err){
    res.send("Error")
  }else{
modelCursoXUsuario.cursoxusuario.find({}).exec((err,result)=>{
if (err){
  res.send ("error")
}else{
  res.render('ListarInscritosxCursos',{
    Cursos: query,
    cursosxUsuario: result
  })

}

})
/*
    res.render('ListarInscritosxCursos',{
      Cursos: query,
    })*/



  }
})
/*
  res.render('ListarInscritosxCursos',{
    Cursos: modeloIngresoCurso.ConsultarCursos(),
  })
  */
})
app.get('/EscogerDocenteCurso',function(req,res){
modelIngresoUsuario.Usuario.find({rol: 'docente'}).exec((err,docentes)=>{
  if (err){
    res.send("Error 404")
  }else{
    res.render('EscogerDocenteCerrar',{
      docentes:docentes,
      curso: req.query.id

    })

  }
})


})

app.get('/CierraCurso', function (req, res) {
  //let cerrar = modeloIngresoCurso.CerrarCurso(req.query.id)
  modeloIngresoCurso.curso.findOneAndUpdate({id:req.query.id},{$set:{estado : 'Cerrado',Docente: req.query.Docente}},{new:true} ).exec((err,result)=>{
    if(err){

      res.send("Error 404")
    }else{
      modeloIngresoCurso.curso.find({}).exec((err,query)=>{
        if(err){
          res.send("Error 404")
        }else{
          modelCursoXUsuario.cursoxusuario.find({}).exec((err,result)=>{
            if (err){
              res.send ("error")
            }else{
              res.render('ListarInscritosxCursos',{
                Cursos: query,
                cursosxUsuario: result
              })
            
            }
            
            })
         
        }

      })

    }


  })
  /*
  res.render('ListarInscritosxCursos',{
    Cursos: cerrar,
  })*/

})

app.get('/EditaUsuario', function (req, res) {
  modelIngresoUsuario.Usuario.find({rol:{$ne: 'coordinador'}}).exec((err,query)=>{
    if(err){
      res.send("Error 404")
    }else{

      res.render('EditarUsuario',{

        usuarios:query
      })
    }
    
  })   
  
})

app.get('/VistaActualizarUsuario', function (req, res) {    
  //let usuario = modelIngresoUsuario.ConsultarUsuarios().find(f => f.documento == req.query.UsuarioID)
//  console.log(req.query.UsuarioID)
//  console.log('.....')
//  
  modelIngresoUsuario.Usuario.findOne({documento:req.query.UsuarioID}).exec((err,usuario)=>{
    if(err){
      res.send("Error 404")
    }else{

    }
    console.log(usuario)
    res.render('ActualizarUsuario',{
      usuario: usuario
    })
  })
  

})

app.get('/ActualizarUser', function (req, res) {
  console.log(req.query)   
  //let resp = modelIngresoUsuario.actualizarUsuario(req.query)
  let usuario = {documento:req.query.documento,
    nombre:req.query.nombre,
    usuario:req.query.usuario,
    password:req.query.password,
    correo:req.query.correo,
    telefono:req.query.telefono,
    rol:req.query.rol,
  }
  modelIngresoUsuario.Usuario.findOneAndUpdate({documento:req.query.documento},usuario,{new:true}).exec((err,result)=>{

    if (err){
      res.render('ResultadoActualizacion', {
      resultado: "Error de actualizacion "
    })
  }else{
    console.log("datos de actualizacion" +result)
    res.render('ResultadoActualizacion', {
      resultado: "Actualizacion correcta"
    })
  }
  })
  /*
  res.render('ResultadoActualizacion', {
    resultado: resp
  })
  */
})

app.get('/CursosOfrecidos', function (req, res) {    

  modeloIngresoCurso.curso.find({}).exec((err,query)=>{
    if (err){
      res.send(err.message)
    }else{
      res.render('CursosOfrecidos', {
        Cursos : query
      })
    }

  })


  



/*
  res.render('CursosOfrecidos', {
    Cursos : modeloIngresoCurso.ConsultarCursos()
  }) */

})

app.get('/ListaCursosDocente', function (req, res) {    

  modeloIngresoCurso.curso.find({Docente:req.query.UsuarioID}).exec((err,query)=>{
    if (err){
      res.send(err.message)
    }else{
      res.render('ListarCursosDelDocente', {
        Cursos : query,
        UsuarioID: req.query.UsuarioID
      })
    }

  })

})


app.get('/ActualizarCursoformulario', function (req, res) {    
console.log("aca esta el curso id " + req.query.id)
  modeloIngresoCurso.curso.findOne({id:req.query.id}).exec((err,query)=>{
    if (err){
      res.send(err.message)
    }else{
      res.render('ActualizarCursoformulario', {
        Cursos : query,
        UsuarioID:req.query.UsuarioID
      })
    }

  })

})

app.get('/ActualizarCurso', function (req, res) {
  let cursoupdate ={id:req.query.id,
    nombre :req.query.nombre,
    descripcion:req.query.descripcion,
    valor :req.query.valor,
    Docente :req.query.Docente,
     modalidad :req.query.modalidad,
     Intensidad:req.query.Intensidad,
     estado:req.query.estado}    
  
    modeloIngresoCurso.curso.findOneAndUpdate({id:req.query.id},cursoupdate,{new:true}).exec((err,query)=>{
      if (err){
        res.send(err.message)
      }else{
        res.render('UpdateExitoso', {
          resultado:query.id,
          UsuarioID:req.query.UsuarioID
        })
      }
  
    })
  
  })






mongoose.connect('mongodb://localhost:27017/EducacionContinua', {useNewUrlParser: true},(err,resultado)=>{


if(err){

  console.log(err)
}else{

    console.log("Conectado a mongo")
}
});
app.listen(port, () => {
  console.log('servidor en el puerto ' + port)
});



/*
 let comando = argv._[0];

 switch (comando){
    case'crear':
    model.CrearCurso(argv)
        
    

    break
    default:
        console.log(comando);
        


 }*/
