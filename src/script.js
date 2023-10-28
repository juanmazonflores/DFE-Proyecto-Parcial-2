//#region 1. MODELO DE DATOS (MODELS)
// Clase Tarea
class Task {
    constructor(id, title, description, completed, priority, tag, dueDate) {
      this.id = id; 
      this.title = title; 
      this.description = description; 
      this.completed = completed; 
      this.priority = priority; 
      this.tag = tag; 
      this.dueDate = dueDate; 
    }
}

function mapAPIToTasks(data) {
    return data.map(item => {
      return new Task(
        item.id,
        item.title,
        item.description,
        item.completed, 
        item.priority,
        item.tag, 
        new Date(item.dueDate),
      );
    });
}

function APIToTask(data) {
    return new Task(
      data.id,
      data.title,
      data.description,
      data.completed,
      data.priority,
      data.tag,
      new Date(data.dueDate),
    );
}



//#endregion

//#region 2. TAREAS (VIEW)

function displayTasksView(tasks) {

    clearTable();
  
    showLoadingMessage();
  
    if (tasks.length === 0) {
  
      showNotFoundMessage();
  
    } else {
  
      hideMessage();
  
      displayTasksTable(tasks);
    }
  
}

function displayTasksTable(tasks) {

    const tablaBody = document.getElementById('data-table-body');
  
    tasks.forEach(task => {
  
      const row = document.createElement('tr');
      console.log(task.completed);
      
      if (task.completed) {
        row.style.textDecoration='line-through';

      }
      row.innerHTML = `
        <td><input class="status-checkbox" type='checkbox' data-task-id="${task.id}" ${checked(task.completed)} >${checked2(task.completed)}</input></td>
        <td>${task.title}</td>
        <td>${task.description}</td>
        <td>${formatDate(task.dueDate)}</td>
        <td>${task.priority}</td>
        <td>${task.tag}</td>
        <td>
          <button class="btn-update fa-solid fa-pen" data-task-id="${task.id}"></button>
        </td>
        <td>
          <button class="btn-delete fa-solid fa-trash" data-task-id="${task.id}"></button>
        </td>
      `;
  
      tablaBody.appendChild(row);
  
    });
  
    //initCheckboxTaskButtonHandler();
    initDeleteTaskButtonHandler();
    initUpdateTaskButtonHandler();
}

function clearTable() {
    const tableBody = document.getElementById('data-table-body');
  
    tableBody.innerHTML = '';
}

function showLoadingMessage() {
    const message = document.getElementById('message');
  
    message.innerHTML = 'Cargando...';
  
    message.style.display = 'block';
}

function showInitialMessage() {
  const message = document.getElementById('message');

  message.innerHTML = 'No se ha realizado una consulta de ventas.';

  message.style.display = 'block';
}

function showNotFoundMessage() {
    const message = document.getElementById('message');
  
    message.innerHTML = 'No se encontraron tareas con el filtro proporcionado.';
  
    message.style.display = 'block';
}

function hideMessage() {
    const message = document.getElementById('message');
  
    message.style.display = 'none';
}

//#endregion

//#region 4. FILTROS (VIEW)

function initFilterButtonsHandler() {

    document.getElementById('filter-form').addEventListener('submit', event => {
      console.log('entre');
      event.preventDefault();
      searchTasks();
    });
  
    document.getElementById('open-filters').addEventListener('click', event => {
      openCloseFilters();
    });
    
    document.getElementById('reset-filters').addEventListener('click', () => resetTasks());
  
}

function openCloseFilters(){
  let show= document.getElementById('tag-filter').style.display;
  show=showHide(show);
  document.getElementById('tag-filter').style.display=show;
  document.getElementById('status-filter').style.display=show;
  document.getElementById('apply-filters').style.display=show;
  document.getElementById('status-label-field').style.display=show;
  if (show=='none') {
    resetTasks();
  }
}

function showHide(show){
  console.log(show)
  
  if (show=='none' || show=='') {
    return 'initial';
  }else{
    return 'none';
  }
}

function resetTasks() {
  
    document.querySelectorAll('input.filter-field').forEach(input => input.value = '');
    document.querySelectorAll('input.filter-field').forEach(input => input.checked = false);
    document.querySelectorAll('select.filter-field').forEach(select => select.value = '');
    document.getElementById('tag-filter').style.display='none';
    document.getElementById('status-filter').style.display='none';
    document.getElementById('apply-filters').style.display='none';
    document.getElementById('status-label-field').style.display='none';
    searchTasks();
}

function searchTasks() {
    
    const tag = document.getElementById('tag-filter').value;
    const completed = document.getElementById('status-filter').checked;
    console.log(completed);
    getTasksData(tag,completed);
}
  
//#endregion

//#region 4. VALIDACION DE CAMPOS

function validarCampos() {
  const title = document.getElementById('title-field');
  const description = document.getElementById('description-field');
  const priority = document.getElementById('priority-field');
  const tag = document.getElementById('tag-field');
  const dueDate = document.getElementById('date-field');
  console.log(dueDate);

  

  if (title.value=='' ) {
    alert("Porfavor, llena todos los campos :) ")
    title.focus();
    return false;
  } 

  if (description.value=='' ) {
    alert("Porfavor, llena todos los campos :) ")
    description.focus();
    return false;
  } 

  if (priority.value=='' ) {
    alert("Porfavor, llena todos los campos :) ")
    priority.focus();
    return false;
  }

  if (tag.value=='' ) {
    alert("Porfavor, llena todos los campos :) ")
    tag.focus();
    return false;
  } 

  if (dueDate.value=='' ) {
    alert("Porfavor, llena todos los campos :) ")
    dueDate.focus();
    return false;
  } 

}


//#endregion

//#region 4. BOTONES PARA AGREGAR, ACTUALIZAR Y ELIMINAR TAREAS (VIEW)

function initTaskButtonsHandler() {

    document.getElementById('process-task').addEventListener('click', () => {
      //quitar despues
      closeTaskModal()
      openTaskModal()
    });
  
    document.getElementById('modal-background').addEventListener('click', () => {
      closeTaskModal();
    });
  
    document.getElementById('sale-form').addEventListener('submit', event => {
 
      event.preventDefault();
      validarCampos();
      processTask();
    });
  
}

function openTaskModal(data) {
  document.getElementById('sale-form').reset();
  document.getElementById('modal-background').style.display = 'block';
  document.getElementById('modal').style.display = 'block';

  if (data) {
    document.getElementById('id-field').value=data.id;
    document.getElementById('modal-title').textContent='Actualizar Tarea';
    document.getElementById('title-field').value=data.title;
    document.getElementById('description-field').value=data.description;
    document.getElementById('status-field-label').style.display='initial';
    document.getElementById('status-field').style.display='initial';
    document.getElementById('status-field').checked=data.completed;
    document.getElementById('priority-field').value=data.priority;
    document.getElementById('tag-field').value=data.tag;
    const dueDate2 = new Date(data.dueDate);
    const formattedDueDate = dueDate2.toISOString().substring(0, 10);
    document.getElementById('date-field').value=formattedDueDate
    document.getElementById('botonModal').textContent='Guardar Cambios';
  }
}

function closeTaskModal() {
    document.getElementById('modal-title').textContent='Nueva Tarea';
    document.getElementById('status-field-label').style.display='none';
    document.getElementById('status-field').style.display='none';
    document.getElementById('sale-form').reset();
    document.getElementById('modal-background').style.display = 'none';
    document.getElementById('modal').style.display = 'none';
    document.getElementById('botonModal').textContent='Guardar Tarea';
}

//Funcion para procesar la creacion o actualizacion de una tarea
function processTask() {
    const title = document.getElementById('title-field').value;
    const description = document.getElementById('description-field').value;
    const priority = document.getElementById('priority-field').value;
    const tag = document.getElementById('tag-field').value;
    const dueDate = document.getElementById('date-field').value;

    // Verificamos si se quiere Actualizar o Crear una tarea verificando el contenido del boton del modal
    const bandera=document.getElementById('botonModal').textContent;
    let id;
    let completed;

    // Si se quiere actualizar obtenemos el id del campo id-field, en caso contrario es igual a nulo
    if (bandera=='Guardar Cambios') {
      id = document.getElementById('id-field').value; 
      completed = document.getElementById('status-field').checked;
    }else {
      id = null;
      completed = false;
    }

    // Creamos la tarea 
    const taskToSave = new Task(
      id,
      title,
      description,
      completed, 
      priority,
      tag, 
      dueDate
    );

    // Enviamos los datos 
    if (bandera=='Guardar Cambios') {
      updateTask(taskToSave);
    }else {
      createTask(taskToSave);
    }
    
}

function initDeleteTaskButtonHandler() {

  document.querySelectorAll('.btn-delete').forEach(button => {

    button.addEventListener('click', () => {

      const taskId = button.getAttribute('data-task-id'); 
      deleteTask(taskId); 

    });

  });

}

function initUpdateTaskButtonHandler() {
  document.querySelectorAll('.btn-update').forEach(button => {

    button.addEventListener('click', () => {

      const taskId = button.getAttribute('data-task-id'); 
      getTask(taskId); 
    });

  });

  document.querySelectorAll('.status-checkbox').forEach(checkbox => {

    checkbox.addEventListener('change', () => {

      const taskId = checkbox.getAttribute('data-task-id'); 
      getTaskCheckbox(taskId,checkbox.checked); 
    });

  });

}


//#endregion

//#region 5. CONSUMO DE DATOS DESDE API

function getTasksData(tag,completed) {

  const url = buildGetTasksDataUrl(tag,completed);

  fetchAPI(url, 'GET')
    .then(data => {
      
      const tasksList = mapAPIToTasks(data);
      displayTasksView(tasksList);
    });
}

function getTask(id) {
  fetchAPI(`${apiURL}/users/219230126/tasks/${id}`, 'GET')
    .then(data => {
      openTaskModal(data)
    });
  
}

function getTaskCheckbox(id,checked) {
  fetchAPI(`${apiURL}/users/219230126/tasks/${id}`, 'GET')
    .then(data => {
      const task=APIToTask(data)
      task.completed=checked;
      console.log(task.completed)
      updateTask(task);
    });
  
}


function createTask(task) {

  fetchAPI(`${apiURL}/users/219230126/tasks`, 'POST', task)
    .then(task => {
      closeTaskModal();
      resetTasks();
      window.alert(`Tarea ${task.id} creada correctamente.`);
    });

}

function updateTask(task) {

  fetchAPI(`${apiURL}/users/219230126/tasks/${task.id}`, 'PUT',task)
    .then(task => {
      closeTaskModal();
      resetTasks();
      window.alert(`Tarea ${task.id} actualizada correctamente.`);
    });

}

function deleteTask(taskId) {

  const confirm = window.confirm(`¿Estás seguro de que deseas eliminar la tarea ${taskId}?`);

  if (confirm) {

    fetchAPI(`${apiURL}/users/219230126/tasks/${taskId}`, 'DELETE')
      .then(() => {
        resetTasks();
        window.alert("Tarea eliminada.");
      });

  }
}

function buildGetTasksDataUrl(tag,completed) {

  const url = new URL(`${apiURL}/users/219230126/tasks`);
  if (tag) {
    url.searchParams.append('tag', tag);
  }

  if (completed) {
    url.searchParams.append('completed', completed);
  }

  return url;
}



//#endregion

//#region 6. INICIALIZAR CONTROLADORES

initTaskButtonsHandler();

initFilterButtonsHandler();

getTasksData();

//#endregion