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

$("#addTask").click((e) => {
  e.preventDefault();

  let task = $("#tasks").val();

  if (!task.length) {
    alert("Please add a task to add");

    //! add a UI element
  } else {
    const obj = {
      task: task,
      complete: false,
      id: `${Math.floor(Math.random() * 100)}${Math.floor(
        Math.random() * 100
      )}`,
    };

    chrome.storage.sync.get("tasks", function (result) {
      if (result.tasks) {
        let list = result.tasks;
        list.push(obj);
        chrome.storage.sync.set({ tasks: list });
      }
    });

    addTasktoTheList(obj);
    $("#tasks").val("");
  }
});

//if list exists
chrome.storage.sync.get("tasks", function (result) {
  if (result.tasks) {
    result.tasks.map((task) => {
      addTasktoTheList(task);
    });
  }

  if (!result.tasks) {
    chrome.storage.sync.set({ tasks: [] });
  }
});

getDate = () => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const date = new Date();
  const weekday = date.getDay();
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  return `${days[weekday]} - ${day} ${months[month]}, ${year}`;
};

$("#date").html(getDate());
