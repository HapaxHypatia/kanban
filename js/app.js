// TODO Add task button
// TODO Edit task button
// TODO save changes back to jsonfile


function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
  const notes = document.getElementsByClassName("note");
  // disable pointer events on other notes, so they are not affected when dragged over
  for (let n of notes){
    if (n !== ev.target){
      n.classList.add('disabled')
    }
  }
}

function drop(ev) {
  ev.preventDefault();
  const data = ev.dataTransfer.getData("text");
  let note = document.getElementById(data)
  ev.target.prepend(note);
  const notes = document.getElementsByClassName("note");
  //remove old status, add new. Update in json file?
  let classes = note.classList
  switch(true){
    case classes.contains("todo"):
      note.classList.remove("todo")
      break;
    case classes.contains("doing"):
      note.classList.remove("doing")
      break;
    case classes.contains("done"):
      note.classList.remove("done")
      break;
  }
  let str = ev.target.id
  let newClass = str.slice(0,str.length-5)
  note.classList.add(newClass)

  //Restore pointer events to all notes
  for (let n of notes) {
    if (n !== ev.target) {
      n.classList.remove('disabled')
    }
  }
}

function load (url) {
  // Get promise for file load
  return new Promise(async function (resolve, reject) {
    const res = await fetch(url)
    resolve(res.json())
  })
}


function createTask(container, taskdata){
  // Save new task to json
  let parent = document.getElementById(container)
  let div = document.createElement('div')
  div.classList.add('note')
  div.classList.add(taskdata.Status)
  div.id = taskdata.ID
  div.setAttribute("draggable", "true")
  div.innerText = taskdata.Title
  parent.appendChild(div)
  // Get the newly created div from the DOM & assign handler
  let newdiv = document.getElementById(taskdata.ID)
  newdiv.addEventListener("dragstart", drag)
}

function addTask(e){
  e.preventDefault()
  // Pop up window to get new task data.
  // Set target container from status.
  // Call create task with task data and container name.
  console.log(e.target.id)
}

function editTask(){}

// Everything processed in then statement so that all functions have access to tasks
load('./tasks.json').then((jsonfile) => jsonfile.tasks).then((tasks) => {
  for (let x of tasks){
    switch (x.Status){
      case "todo":
        createTask('todo-list', x)
        break;
      case "doing":
        createTask("doing", x)
        break;
      case "done":
        createTask("done-list", x)
        break;
    }
  }

  // Do not delete these very important closing brackets
  // Do not delete these very important closing brackets
  // Do not delete these very important closing brackets
                        })
