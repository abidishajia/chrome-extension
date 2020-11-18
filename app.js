registerUser = () => {
  $("#registerUser").css("display", "block");
  $("#submitName").click((e) => {
    e.preventDefault();
    const name = $("#userName").val();
    $("#registerUser").css("display", "none");
    displayName(name);
    displayTaskForm();

    chrome.storage.sync.set({
      name: name,
    });
  });
};

displayTaskForm = () => {
  $("#tasksForm").css("display", "block");
};

displayName = (name) => {
  $("#greeting").append(`, ${name}!`);
};

// If the user is registered

addTasktoTheList = (task) => {
  const ul = $("#tasksList");
  const li = document.createElement("li");
  li.classList.add("list-group-item");

  li.innerHTML = task.task;
  task.complete ? li.classList.add("complete") : "";
  li.dataset.id = task.id;

  var span = document.createElement("span");
  span.setAttribute("id", "remove");
  span.innerHTML = "X";

  li.append(span);

  li.addEventListener("click", () => updateComplete(li), "false");

  $(span).click(() => removeItem(li));

  ul.append(li);
};

const removeItem = (e) => {
  e.parentNode.removeChild(e);

  const dataId = { ...e.dataset }["id"];

  chrome.storage.sync.get({ tasks: [] }, function (items) {
    const updatedList = items.tasks.filter((item) => item.id != dataId);
    chrome.storage.sync.set({ tasks: updatedList });
  });
};

const updateComplete = (e) => {
  if (e.tagName === "LI") {
    e.classList.toggle("complete");
    const dataId = { ...e.dataset }["id"];

    chrome.storage.sync.get("tasks", function (items) {
      const updatedList = items.tasks.map((item) => {
        if (item.id === dataId) {
          item["complete"] = !item["complete"];
        }
        return item;
      });

      chrome.storage.sync.set({ tasks: updatedList });
    });
  }
};

userRegistered = () => {
  $("#addTask").click((e) => {
    e.preventDefault();

    let task = $("#tasks").val();

    if (!task.length) {
      alert("Please add a task to add");

      //! add a UI element
    } else {
      $("#tasks").val("");
      const obj = {
        task: task,
        complete: false,
        id: `${Math.floor(Math.random() * 100)}${Math.floor(
          Math.random() * 100
        )}`,
      };

      chrome.storage.sync.get("tasks", function (result) {
        if(result.tasks){
          console.log({result})
          let list = result.tasks;
          list.push(obj);
          chrome.storage.sync.set({ tasks: list });
        }
        if(!result.tasks){
          console.log('not result.task')
          let list = [];
          list.push(obj)
          chrome.storage.sync.set({ tasks: list });
        }
      });

      addTasktoTheList(obj);
    }
  });
};

chrome.storage.sync.get("name", function (result) {
  //* if name exist
  if (result.name) {
    displayName(result.name);
    displayTaskForm();
    userRegistered(result);
  }
  //* If name doesn't exist
  else {
    registerUser(result);
  }
});

//if list exists
chrome.storage.sync.get("tasks", function (result) {
  if (result.tasks) {
    console.log('here goes ')
    result.tasks.map((task) => {
      addTasktoTheList(task);
    });
  }

  if (!result.tasks) {
    chrome.storage.sync.set({ tasks: [] });
    console.log('border none')
    $("#listContainer").css("border", "none");
  }
});






