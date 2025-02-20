// TODO Add task button
// TODO Edit task button
// TODO Change status of task when dropped.
// TODO Make sure whole column is droppable area (currently only notes list area)


function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
  const notes = document.getElementsByClassName("note");
  for (let n of notes){
    if (n !== ev.target){
      n.classList.add('disabled')
    }
  }
}

function drop(ev) {
  ev.preventDefault();
  const data = ev.dataTransfer.getData("text");
  ev.target.prepend(document.getElementById(data));
  const notes = document.getElementsByClassName("note");
  //remove old status, add new. Update in json file?
  // ev.target.classList.remove()
  // ev.target.classList.add()
  for (let n of notes) {
    if (n !== ev.target) {
      n.classList.remove('disabled')
    }
  }
}

function load (url) {
  return new Promise(async function (resolve, reject) {
    // do async thing
    const res = await fetch(url)
    // resolve
    resolve(res.json()) // see note below!
  })
}

function createTasks(tasklist, container){
  let list = document.getElementById(container)
  for (let x of tasklist[0]) {
    let div = document.createElement('div')
    div.classList.add('note')
    div.id = x.ID
    div.setAttribute("draggable", "true")
    list.appendChild(div)
    let heading = document.createElement('p')
    heading.innerText = x.Title
    div.appendChild(heading)

    let newdiv = document.getElementById(x.ID)
    newdiv.addEventListener("dragstart", drag)

  }
}

function addTask(e){
  e.preventDefault()
  console.log(e.target.id)
}

load('./tasks.json').then((jsonfile) => jsonfile.tasks).then((tasks) => {
  const todo = [tasks.filter(t => t.Status === "todo")]
  const doing = [tasks.filter(t => t.Status === "doing")]
  const done = [tasks.filter(t => t.Status === "done")]
  createTasks(todo, 'todo-list')
  createTasks(doing, 'doing')
  createTasks(done, 'done-list')
                        })
