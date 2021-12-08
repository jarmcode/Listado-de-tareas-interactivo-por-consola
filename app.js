require("colors");
const { guardarDB, leerDB } = require("./helpers/guardarArchivo");
//const { mostrarMenu, pausa } = require("./helpers/mensajes");
const {
  inquirerMenu,
  pausa,
  leerInput,
  listadoTareasBorrar,
  confirmar,
  mostrarListadoChecklist,
} = require("./helpers/inquire");
const Tareas = require("./models/tareas");

console.clear();

const main = async () => {
  let opt = "";
  const tareas = new Tareas();

  const tareasDB = leerDB();

  if (tareasDB) {
    //Cargar las tareas
    tareas.cargarTareasFromArray(tareasDB);
  }
  //await pausa();
  do {
    // Imprimir el menu
    opt = await inquirerMenu();

    switch (opt) {
      case "1":
        // crear op
        const desc = await leerInput("Descripción: ");
        tareas.crearTarea(desc);
        break;

      case "2":
        tareas.listadoCompleto();
        //console.log(tareas.listadoArr);
        break;
      case "3": //Mostrar completadas
        tareas.listarPendientesCompletadas();
        //console.log(tareas.listadoArr);
        break;
      case "4": //Mostrar pendientes
        tareas.listarPendientesCompletadas(false);
        //console.log(tareas.listadoArr);
        break;
      case "5": //Mostrar pendientes
        const ids = await mostrarListadoChecklist(tareas.listadoArr);
        tareas.toggleCompletadas(ids);
        break;

      case "6":
        const id = await listadoTareasBorrar(tareas.listadoArr);
        if (id !== "0") {
          const ok = await confirmar("¿Está seguro?");
          if (ok) {
            tareas.borrarTarea(id);
            console.log("Tarea borrada");
          }
          break;
        }
    }

    guardarDB(tareas.listadoArr);

    if (opt !== "0") await pausa();

    //opt = await mostrarMenu();
    //console.log({ opt });
  } while (opt !== "0");

  await pausa();
};

main();
