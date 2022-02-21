

const task = document.getElementById('task');
const prior = document.getElementById('prior');
const desc = document.getElementById('desc');
const div = document.getElementById('lecture-ul')


const urlTodo = 'https://infodev-server.herokuapp.com/api/todos' ;

const renderTodo = function (data, className = '') {
    const cN = data.completed ? 'text-decoration:line-through;' : '';
    const opc = data.completed ? 'opacity:0;' : '';
    const badge = data.priority == 2 ? 'ml-2 badge badge-info' : data.priority == 1 ? 'ml-2 badge badge-warning': 'ml-2 badge badge-danger' ;

    const html = `
    <li  >
         <div>
            <h6 class="title" id="name" style='${cN}'> ${data.name} 
            <span class="${badge}" id="priority">
            ${data.priority === 0 ? 'low': data.priority === 1 ? 'medium' : 'high' }
            </span></h6>
            <p class="description" id="description">${data.description}</p>
        </div>
        <div>
            <button class="btn btn-success" style='${opc}' onclick="taskCompleted('${data._id}','${data.name}','${data.priority}','${data.description}' )"><i class="fas fa-check"></i></i></button>
            <button class="btn btn-warning" style='${opc}' onclick="putTodo('${data._id}')"><i class="fas fa-pencil"></i></i></button>
            <button class="btn btn-danger" onclick="deleteTodo('${data._id}')"><i class="far fa-trash-alt"></i></button>
        </div>
     </li>`;
  
    div.insertAdjacentHTML('beforeend', html);
  };

function addTodo(e){
    e.preventDefault();
    fetch(urlTodo,
    {
    method: 'POST',
    headers:{
        'Accept': 'application/json, text/plain',
        'Content-type' : 'application/json',
    },
    body:JSON.stringify({name:task.value,priority:prior.value,description:desc.value})
    }
    ).then((res)=> res.json())
    .then((data)=> {
        renderTodo(data);
        task.value='';
        desc.value='';
    })
    .catch((err)=> console.log(err))
}

const getTodo = async function () {

    const res = await fetch(urlTodo, {
    method: 'GET',
    headers:{
        'Accept': 'application/json, text/plain',
        'Content-type' : 'application/json',
    },
    // body:JSON.stringify({name:task,priority:prior,description:desc})   
});
const data = await res.json();
data.forEach(element => {
    renderTodo(element)
});

// task.value(data.name)
}

getTodo()

const deleteTodo = async function (id) {

    const res = await fetch('https://infodev-server.herokuapp.com/api/todos/'+id, {
    method: 'DELETE',
    });
    const data = await res.json();
    alert(data.message)
    location.reload()
   
}
const putTodo = async function (id) {
    const res = await fetch('https://infodev-server.herokuapp.com/api/todos/'+id, {
    method: 'PUT',
    headers:{
        'Accept': 'application/json, text/plain',
        'Content-type' : 'application/json',
    },
    body:JSON.stringify({name:task.value,priority:prior.value,description:desc.value})   
    });
    const data = await res.json();
    location.reload();
}


const taskCompleted = async function(id,name,priority,description){
    const res = await fetch('https://infodev-server.herokuapp.com/api/todos/'+id, {
    method: 'PUT',
    headers:{
        'Accept': 'application/json, text/plain',
        'Content-type' : 'application/json',
    },
    body:JSON.stringify({name:name,priority:priority,description:description,completed:true})   
    });
    const data = await res.json();
    location.reload()
}