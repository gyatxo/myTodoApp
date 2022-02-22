//creating variables to retrieve the data from input
const task = document.getElementById('task');
const prior = document.getElementById('prior');
const desc = document.getElementById('desc');
const add = document.getElementById('add');
const editBtn = document.getElementById('editBtn');
const div = document.getElementById('lecture-ul')
const urlTodo = 'https://infodev-server.herokuapp.com/api/todos' ;

//function that render the html elements
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
            <button class="btn btn-warning" style='${opc}' onclick="editTodo('${data._id}')"><i class="fas fa-pencil"></i></i></button>
            <button class="btn btn-danger" onclick="deleteTodo('${data._id}')"><i class="far fa-trash-alt"></i></button>
        </div>
     </li>`;
  
    div.insertAdjacentHTML('beforeend', html);
};


  //function to get all the data from api to render on browser at the begining
(async function () {
  
      const res = await fetch(urlTodo, {
      method: 'GET',
      headers:{
          'Accept': 'application/json, text/plain',
          'Content-type' : 'application/json',
      },  
  });
  const data = await res.json();
  data.forEach(element => {
      renderTodo(element)
  });
})()




//post method 
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

//delete method
const deleteTodo = async function (id) {
    const res = await fetch('https://infodev-server.herokuapp.com/api/todos/'+id, {
    method: 'DELETE',
    });
    const data = await res.json();
    alert(data.message)
    location.reload()
   
}

// edit button to redirect data from id to the form
// using this did not work something. the data inputed in the form did not get updated in the api so i did not use this
// please check what i did wrong. to implement this call function in the edit button in li tag instead of the editTodo function.
const renderEditForm = function (id,name,priority,description){
    add.style.backgroundColor = 'black';
    console.log(id)
    task.value= name;
    prior.value= priority;
    desc.value = description;
    const edit = `<button class="primary" type="submit" onclick="editTodo('${id}')" >Edit</button>`;
    editBtn.insertAdjacentHTML('beforeend', edit);

}

//edit list by id but we need to provide the info in the input section
// 1. go to the input form and type what needs to be updated 
// 2. click the edit button instead of the add button.
const editTodo = async function (id) {
    console.log(id)
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

//change status to completed
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
    console.log(data)
    // location.reload()
}