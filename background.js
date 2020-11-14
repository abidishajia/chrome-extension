//chrome.storage.local.get(console.log)

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.local.set({
    initialTasks: [],
    tasks: [],
    name: '', 
    registered: false,
    updateTask: true,
    bgImage: ''
  });
});


chrome.tabs.onCreated.addListener(function() {
  console.log('tab created')
})
