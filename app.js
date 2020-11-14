//* time
let updateTask = true;

//random selector

// background image
const body = document.querySelector('body').classList.add('pinkGradient')


const userRegistered = (result) => {
  const name = result.name;
  document.getElementsByTagName("h1")[0].innerHTML = `Hello, ${name}`;


  chrome.storage.local.get("registered", function (result) {
    if(result.registered){
      chrome.storage.local.get("initialTasks", function (result) {
        if (result.initialTasks && updateTask) {
          const tasks = result.initialTasks;
          const ul = document.getElementById("list");
          tasks.map(task => {
            console.log(task)
            const li = document.createElement("li");
            li.classList.add("list-group-item");
            task.complete ? li.classList.add('complete') : ''
            li.innerHTML = task.task;
            li.dataset.id = task.id 
            ul.appendChild(li);


            const deleteBtn = document.createElement('button')
            deleteBtn.innerHTML = 'X'
            li.append(deleteBtn)
            deleteBtn.addEventListener('click', () => removeItem(li))
          })
        }
      });
    }
  })

}

const removeItem = e => {

  console.log({e})
  // console.log({e})

  // const data = e.target.parentElement.dataset
  // const dataId = JSON.parse(JSON.stringify(data))['id']

  // e.target.parentElement.remove()
  e.parentNode.removeChild(e);

  // chrome.storage.local.get({initialTasks: []}, function(items) {
  //   const a = items.initialTasks.filter(item => item.id != parseInt(dataId))
  //   chrome.storage.local.set({ initialTasks: a});
  // });

  // let index = todos.indexOf(name);
  // todos.splice(index, 1);
  // window.localStorage.setItem("todos", JSON.stringify(todos));


}

// Add a "checked" symbol when clicking on a list item
// const list = document.querySelector('#list');
// list.addEventListener('click', function(e) {
//   if (e.target.tagName === 'LI') {
//       e.target.classList.toggle('complete');
//       const taskContent = e.target.textContent;

//       chrome.storage.local.get("initialTasks", function (result) {
//         let tasks = result.initialTasks;

//         tasks.find(task => {
//           const result = task.task === taskContent;
//           if(result){
//             task['complete'] = !task['complete']
//           }
//         })
//         chrome.storage.local.set({ initialTasks: tasks});
//         updateTask = false 
//       });

//   }
// }, false);


const randomNumberGenarator = (Math.random() * (200 - 0 + 1) ) << 0


//* If name doesn't exist
const userNotRegistered = (result) => {
  document.getElementsByTagName("h1")[0].innerHTML = `Hello!`;
  document.getElementById("form").style.display = "block";
  const button = document.querySelector("button");

  button.addEventListener("click", function (e) {
    e.preventDefault();
    let input = document.querySelector("input").value;
    chrome.storage.local.set({ name: input });

    document.getElementById("form").style.display = "none";
    document.getElementById("tasksForm").style.display = "block";

    //* tasks to keep track of everyday

    const initialTaskBtn = document.getElementById("initialTaskBtn");
    initialTaskBtn.addEventListener("click", (e) => {
      e.preventDefault();

      let task = document.querySelector("#initialTasks").value;

      //* save it in the storage
      chrome.storage.local.get("initialTasks", function (result) {
        let tasks = result.initialTasks;
        tasks.push({task: task, complete: false, id: `${Math.floor(Math.random() * 100)}${Math.floor(Math.random() * 100)}`
        });

        chrome.storage.local.set({ initialTasks: tasks });
      });

      //* add it to the ui
      if (task) {
        const ul = document.getElementById("initialList");

        const li = document.createElement("li");
        li.classList.add("list-group-item");
        li.innerHTML = task;
        ul.appendChild(li);
      }

      //* clear the input field
      document.querySelector("#initialTasks").value = "";
    });
  });

  const doneBtn = document.querySelector("#done");
  doneBtn.addEventListener("click", function (e) {
    e.preventDefault();

    document.getElementById("tasksForm").style.display = "none";
    document.getElementById("initialList").style.display = "none";
    document.getElementById("listContainer").style.display = "block";
    // document.getElementById("addTask").style.display = "block";


    chrome.storage.local.set({ registered: true });
  });
};

//* Tab opens
chrome.storage.local.get("name", function (result) {
  //* if name exist

  if (result.name) {
    userRegistered(result);
    document.getElementById("listContainer").style.display = "block";
  } 
  //* If name doesn't exist
  else {
    userNotRegistered(result);
  }
});

//* listen for change
chrome.storage.onChanged.addListener(function (changes, namespace) {
  chrome.storage.local.get("name", function (result) {
    //* if name exist
    if (result.name) {
      
          userRegistered(result);

   
    }
  });
});
