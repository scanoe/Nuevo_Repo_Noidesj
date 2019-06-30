const hbs = require('hbs');
const modeloIngresoCurso= require('./../Model/IngresarCursoModel')
const modelIngresoUsuario = require('./../Model/IngresarUsuarioModel')
const modelCursoXUsuario = require('./../Model/CursoXUsuarioModel')

hbs.registerHelper('ListarCursos', (Cursos) => {
 
  let texto = "<div class='accordion' id='accordionExample'>"
  let i = 1
    Cursos.forEach(curso => {

      texto = texto + `
    <div class="card">
    <div class="card-header" id="heading${i}">
      <h2 class="mb-0">
        <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">
        <div class="text-left">  
        ${curso.nombre} <br>
          valor: ${curso.valor} <br>
          Descripcion: ${curso.descripcion} 
          </div>
        </button>
      </h2>
    </div>

    <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">
      <div class="card-body">
      <p>ID: ${curso.id} </p>
      <p>Descripcion: ${curso.descripcion} </p>
      <p>valor: ${curso.valor} </p>
      <p>modalidad: ${curso.modalidad} </p>
      <p>Intensidad: ${curso.Intensidad} </p>
      <p>estado: ${curso.estado} </p>
      </div>
    </div>
  </div>
   `
      i++;
    })
   
  return texto
})

hbs.registerHelper('ListarCursosDisponibles', (Cursos) => {
  let i = 1
  let texto = "<div class='accordion' id='accordionExample'>"
  Cursos.forEach(curso => {
    if (curso.estado == 'disponible') {
      texto = texto + `
      <div class="card">
      <div class="card-header" id="heading${i}">
        <h2 class="mb-0">
          <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">
          <div class="text-left">  
          ${curso.nombre} <br>
            valor: ${curso.valor} <br>
            Descripcion: ${curso.descripcion} 
            </div>
          </button>
        </h2>
      </div>
  
      <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">
        <div class="card-body">
        <p>ID: ${curso.id} </p>
        <p>Descripcion: ${curso.descripcion} </p>
        <p>valor: ${curso.valor} </p>
        <p>modalidad: ${curso.modalidad} </p>
        <p>Intensidad: ${curso.Intensidad} </p>
        <p>estado: ${curso.estado} </p>
        </div>
      </div>
    </div>
     `
    }
    i++;
  })
  return texto
})

hbs.registerHelper('ListarCursosInscritos', (CursosUsuario, UsuarioID,listacursos) => {
  let i = 1
  let texto = "<div class='accordion' id='accordionExample'>"
  CursosUsuario.forEach((cursoUsuario) => {
    if (cursoUsuario.idUsuario == UsuarioID) {  
      let Cursos =listacursos;
      let curso = Cursos.find(c => c.id == cursoUsuario.idCuso);
      texto = texto + `
      <div class="card">
        <div class="card-header" id="heading${i}">
          <h2 class="mb-0">
            <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">
              <div class="text-left">  
                <p>Curso:<p>${curso.nombre}<br>  
                <a href="/EliminaCursoInscrito?idCuso=${cursoUsuario.idCuso}&UsuarioID=${UsuarioID}"c>Eliminar</a>           
              </div>
            </button>
          </h2>
       </div> 
      </div> 
    </div>  `
    }  
    i++;
  })
  return texto
})


hbs.registerHelper('NavbarAspirante', (UsuarioID) => {

  texto =`            <nav class="navbar navbar-expand-lg navbar-light bg-light">
  <a class="navbar-brand" href="#">Opciones</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
      aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
          <li class="nav-item active">
              <a class="nav-link" href="/?UsuarioID=${UsuarioID}">Home <span class="sr-only">(current)</span></a>
          </li>
          <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Cursos
              </a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                  <a class="dropdown-item" href="/ListaCursosDisponibles?UsuarioID=${UsuarioID}"c>Cursos Disponibles</a>
                  <a class="dropdown-item" href="/ListaCursosInscritos?UsuarioID=${UsuarioID}"c>Mis Cursos</a>
              </div>
          </li>
          
      </ul>
  </div>
</nav>`
return texto

})

hbs.registerHelper('NavbarDocente', (UsuarioID) => {

  texto =`            <nav class="navbar navbar-expand-lg navbar-light bg-light">
  <a class="navbar-brand" href="#">Opciones</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
      aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
          <li class="nav-item active">
              <a class="nav-link" href="/?UsuarioID=${UsuarioID}">Home <span class="sr-only">(current)</span></a>
          </li>
          <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Cursos
              </a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                  <a class="dropdown-item" href="/ListaCursosDocente?UsuarioID=${UsuarioID}"c>Mis cursos asignados </a>
      
              </div>
          </li>
          
      </ul>
  </div>
</nav>`
return texto

})




hbs.registerHelper('SelectCursos', (cursos,UsuarioID) => {
  texto =` <form action="/InscribirCurso" method="post">`+
  '<div class="form-group">'+
  '<label for="curso">ID del curso </label>' +
  ' <select class="form-control" id="curso" name ="curso">'

  cursos.forEach((curso)=> {

    if (curso.estado =='disponible'){

    texto = texto +`<option>${curso.id}</option>`
  }
  })
  texto= texto+`</select>
  <input type = "text" name = "UsuarioID" value = '${UsuarioID}' />
  <input type="submit" class="form-group" value="Registrar" name="submit" id="submit">
  </div>
  </form>`
  return texto
})

hbs.registerHelper('ListarInscritosxCursos', (Cursos,cursosusuario) => {
 
  let texto = "<div class='accordion' id='accordionExample'>"
 
  let i = 1
    Cursos.forEach(curso => {
      let usuariosXCurso = modelCursoXUsuario.inscritos(curso.id,cursosusuario);
      
        texto = texto + `
        <div class="card">
          <div class="card-header" id="heading${i}">
            <h2 class="mb-0">
              <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">
                <div class="text-left">
                ${curso.nombre} <br>
                id: ${curso.id}<br>  
                  valor: ${curso.valor} <br>
                  Descripcion: ${curso.descripcion} 
                </div>
              </button>
            </h2>
          </div> |

           <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">
            <div class="card-body">
              <p>Id de Usuarios: ${usuariosXCurso} </p>
              <p>Estado del curso: ${curso.estado} </p>`
              if(curso.estado=='disponible'){
                texto=texto+`<a href="/EscogerDocenteCurso?id=${curso.id}">Cerrar Curso</a>`
              }           
            texto=texto+ `
             </div>
        </div>
      </div>
       `
      
          i++;
    })
  return texto
})


hbs.registerHelper('ListarInscritosEnCurso', (Usuarios,curso) => {

 // let nombreCurso = modeloIngresoCurso.ConsultarCursos().find(f => f.id == Usuarios[0].idCuso).nombre;
 console.log("aca esto el error"+curso)
 let nombreCurso = curso.nombre
  let texto = "<h3>" + nombreCurso + "</h3><br> <div class='accordion' id='accordionExample'>"
  let i = 1
  Usuarios.forEach(usuario => {

     // let usuariosXCurso = modelCursoXUsuario.inscritos(usuario.id);
      texto = texto + `
        <div class="card">
          <div class="card-header" id="heading${i}">
            <h2 class="mb-0">
              <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">
                <div class="text-left">  
                <p>Id De Usuario: </p>${usuario.idUsuario} <br>
                </div>
              </button>
            </h2>
          </div> 
         </div> `
      i++;
    })  
    
    return texto
})

hbs.registerHelper('FormularioActualizarUsuario', (Usuario) => {
  texto = `<div  class="container">
            <h1> Actualizar datos de usuario</h1>
            <form action="/ActualizarUser">
              <div class="form-group">
                  Documento <br>
                  <input type="hidden" class="form-group" name="documento" id="documento" value="${Usuario.documento}" required><br>
                  Nombre <br>
                  <input type="text" class="form-group" name="nombre" id="nombre" value="${Usuario.nombre}" required><br>
                  Usuario <br>
                  <input type="text" class="form-group" name="usuario" id="usuario" value="${Usuario.usuario}" required><br>
                   contaseña <br>
                  <input type="password" class="form-group" name="password" id="password" value="${Usuario.password}" required><br>
                  Correo <br>
                  <input type="text" class="form-group" name="correo" id="correo" value="${Usuario.correo}" required><br>
                  Teléfono <br>
                  <input type="tel" class= "form-group" name="telefono" id="telefono" value="${Usuario.telefono}" required><br><br>
                  <select class="form-control" id="rol" name ="rol">'`
                  if(Usuario.rol== 'aspirante'){
                    texto=texto+`<option value="aspirante">aspirante</option>
                  <option value="docente">docente</option>`
                  }else{texto=texto+`<option value="docente">docente</option>
                  <option value="aspirante">aspirante</option>`}
                 texto=texto+ ` </select>
                 
                  <input type="submit" class="form-group" value="Enviar" name="sunbmit" id="submit">

              </div>
            </form>
            </div>`
    return texto;        
})

hbs.registerHelper('SelectUsuarios', (Usuarios) => {
  texto=' <select class="form-control" id="UsuarioID" name ="UsuarioID">'
  Usuarios.forEach((usuario)=> {

  texto = texto +`<option>${usuario.documento}</option>`

})
texto= texto+`</select>`
return texto
})

hbs.registerHelper('SelectDocente', (Usuarios,curso) => {
  texto=' <select class="form-control" id="Docente" name ="Docente">'
  Usuarios.forEach((usuario)=> {

  texto = texto +`<option>${usuario.documento}</option>`

})
texto= texto+`</select>
<input type="hidden" id="id" name="id" value="${curso}">
`
return texto
})

hbs.registerHelper('ListarCursosXDocente', (Cursos,UsuarioID) => {
 
  let texto = "<div class='accordion' id='accordionExample'>"
  let i = 1
    Cursos.forEach(curso => {

      texto = texto + `
    <div class="card">
    <div class="card-header" id="heading${i}">
      <h2 class="mb-0">
        <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">
        <div class="text-left">  
        ${curso.nombre} <br>
          valor: ${curso.valor} <br>
          Descripcion: ${curso.descripcion} 
          </div>
        </button>
      </h2>
    </div>

    <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">
      <div class="card-body">
      <p>ID: ${curso.id} </p>
      <p>Descripcion: ${curso.descripcion} </p>
      <p>valor: ${curso.valor} </p>
      <p>modalidad: ${curso.modalidad} </p>
      <p>Intensidad: ${curso.Intensidad} </p>
      <p>estado: ${curso.estado} </p>
      <a href="/ActualizarCursoformulario?id=${curso.id}&UsuarioID=${UsuarioID}">Actualizar Datos del Curso </a>
      
      </div>
    </div>
  </div>
   `
      i++;
    })
   
  return texto
})

hbs.registerHelper('FormularioActualizarCurso', (curso,UsuarioID) => {
  console.log(curso)
 
  let texto = `<div  class="container">
  <h1>Ingreso de nuevo curso</h1>
  <form action="/ActualizarCurso">
  <div class="form-group">
      <input type="hidden" class="form-group" name="id" id="id" value="${curso.id}" ><br>
      Nombre <br>
      <input type="text"class="form-group" name="nombre" id="nombre" value="${curso.nombre}" ><br>
      Descripción <br>
      <input type="text"class="form-group" name="descripcion" id="descripcion"  value="${curso.descripcion}"><br>
      valor <br>
      <input type="number"class="form-group" name="valor" id="valor" value="${curso.valor}"><br>
      modalidad <br>
      <select name="modalidad" class="form-group" id="modalidad" >`
      if(curso.valor=='virtual'){
        texto =texto+  `<option value="virtual">virtual</option>
          <option value="presencial">presencial</option>`
      }else{
        texto =texto+  `<option value="presencial">presencial</option>
        <option value="virtual">virtual</option>`
      }
          texto =texto+  `</select><br>  
      Intensidad horaria <br>
      <input type="number" class="form-group" name= "Intensidad" id="Intensidad" value="${curso.Intensidad}"><br>
      estado <br>
      <select name="estado" class="form-group" id="estado" >`
      if(curso.estado=='disponible'){
        texto =texto+  `<option value="disponible">disponible</option>
          <option value="Cerrado">Cerrado</option>`
      }else{
        texto =texto+  `<option value="Cerrado">Cerrado</option>
        <option value="disponible">disponible</option>`
      }
      texto =texto+  `</select>
      <input type="hidden" class="form-group" name="Docente" id="Docente" value="${UsuarioID}" >
      <input type="hidden" class="form-group" name="UsuarioID" id="UsuarioID" value="${UsuarioID}" ><br>
      <input type="submit" class="form-group" value="Enviar" name="sunbmit" id="submit">
  </div>
  </form>
  </div>`

   
  return texto
})