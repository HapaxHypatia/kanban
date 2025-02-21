// TODO login
// TODO settings
// TODO Complete edit task button
// TODO Save changes back to jsonfile
// TODO Recurring tasks
// TODO Categories, types
// TODO sort and filter
// TODO split into today and this week

// Problems
// TODO task list with few notes displays with big vertical gap because of min height


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

function updateDB(taskdata){
    let task = {
      "ID": taskdata.ID,
      "Title": taskdata.Title,
      "Description/Notes": "",
      "Type": "contact",
      "Type__1": "",
      "Category": "home",
      "Deadline": "FALSE",
      "Time estimate": "",
      "Recurring?": "FALSE",
      "Schedule": "",
      "Subtasks": "",
      "Prerequisites": "",
      "Status": taskdata.Status,
      "Resources": ""
    }
    load('./sampleTasks.json').then((jsonfile) => jsonfile.tasks)
    .then((tasks) => {
        tasks.push(task)
        // TODO returns success code but doesn't alter tasks file
        let promise = new Promise(async function (resolve, reject) {
        const res = await fetch(
          './sampleTasks.json', {
          method: 'POST',
          body: tasks
        }
        )
        resolve(console.log(res))
        }).then((result) => {
            console.log('Success:', result);
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      }
    )
}


function createTask(containerID, taskdata){
  //Create the task div
  let div = document.createElement('div')
  div.id = taskdata.ID
  div.setAttribute("draggable", "true")
  div.classList.add('note')

  div.classList.add(taskdata.Status)
  div.innerText = taskdata.Title

  //Place in container
  let parent = document.getElementById(containerID)
  parent.appendChild(div)

  // Get the newly created div from the DOM & assign handler
  let newdiv = document.getElementById(taskdata.ID)
  newdiv.addEventListener("dragstart", drag)
  newdiv.addEventListener("click", editTask)
}

function openPopup(id){
  // Pop up window to get new task data.
  let popup = document.getElementById(id)
  popup.style.visibility = "visible"
}

function closePopup(id){
  let popup = document.getElementById(id)
  popup.style.visibility = "hidden"
}

function addTask(e){
  e.preventDefault()
  const data = Object.fromEntries(new FormData(e.target).entries());
  console.log(data)
  //get ids of all task divs
  const ids = [...document.getElementsByClassName('note')]
  .map(element => Number(element.id));
  //find highest id, add 1
  const taskID = Math.max( ...ids )+1
  data.ID = taskID
  updateDB(data)
  // Create task using data
  let containerID = data.Status + "-list"
  createTask(containerID, data)
  closePopup('add-task-popup')
}

function editTask(e){
  console.log("Editing " + e.target.id)
  openPopup("edit-dialog")
}



// Everything processed in then statement so that all functions have access to tasks
load('./sampleTasks.json').then((jsonfile) => jsonfile.tasks).then((tasks) => {
  for (let x of tasks){
    switch (x.Status){
      case "todo":
        createTask('todo-list', x)
        break;
      case "doing":
        createTask("doing-list", x)
        break;
      case "done":
        createTask("done-list", x)
        break;
    }
const d = new Date().toLocaleDateString('en-uk', { weekday:"long", month:"long", day:"numeric"})
document.getElementById("date").innerHTML = d;
  }

  // Do not delete these very important closing brackets
  // Do not delete these very important closing brackets
  // Do not delete these very important closing brackets
                        })
