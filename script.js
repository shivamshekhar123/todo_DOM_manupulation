// Function to load todos from localStorage
function loadTodos() {
    // Retrieve 'todos' from localStorage, or create an empty object if nothing exists
    const todos = JSON.parse(localStorage.getItem("todos")) || { "todoList": [] };
    return todos;
}

// Function to update the localStorage with the current state of todos
function refreshTodos(todos) {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Function to add a new todo item to localStorage
function addTodoToLocalStorage(todo) {
    const todos = loadTodos(); // Load the current todos
    todos.todoList.push({ ...todo }); // Add the new todo to the todo list
    localStorage.setItem("todos", JSON.stringify(todos)); // Save updated todos to localStorage
}

// Function to filter todos based on their status (all, pending, completed)
function executeFilterAction(event) {
    const todoList = document.getElementById("todoList");
    const element = event.target;
    const value = element.getAttribute("data-filter"); // Get the filter value from the button
    todoList.innerHTML = ''; // Clear the current displayed todos

    const todos = loadTodos(); // Load current todos from localStorage

    // Filter logic based on button clicked
    if (value == "all") {
        todos.todoList.forEach(todo => {
            appendTodoInHtml(todo); // Display all todos
        });
    } else if (value == "pending") {
        todos.todoList.forEach(todo => {
            if (todo.isCompleted !== true)
                appendTodoInHtml(todo); // Display only pending todos
        });
    } else {
        todos.todoList.forEach(todo => {
            if (todo.isCompleted === true)
                appendTodoInHtml(todo); // Display only completed todos
        });
    }
}

// Function to append a todo item in the HTML (UI)
function appendTodoInHtml(todo) {
    const todoList = document.getElementById("todoList");
    const todoItem = document.createElement("li");

    todoItem.setAttribute("data-id", todo.id); // Set unique id for each todo item

    const textDiv = document.createElement("div");

    // If todo is completed, add the 'completed' class for styling
    if (todo.isCompleted) {
        textDiv.classList.add("completed");
    }

    textDiv.textContent = todo.text; // Set the text content of the todo item
    todoItem.classList.add("todoItem");

    // Create wrapper for buttons
    const wrapper = document.createElement("div");
    wrapper.classList.add("todoButtons");

    // Create Edit, Delete, and Complete buttons
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("editBtn");
    editBtn.addEventListener("click",editTodo)

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("deleteBtn");
    deleteBtn.addEventListener("click",deleteTodo)

    const completeBtn = document.createElement("button");
    completeBtn.textContent = (todo.isCompleted) ? "Reset" : "Completed";
    completeBtn.classList.add("completeBtn");

    // Attach toggle functionality to the Complete button
    completeBtn.addEventListener("click", toggleTodo);

    // Append buttons to wrapper
    wrapper.appendChild(editBtn);
    wrapper.appendChild(deleteBtn);
    wrapper.appendChild(completeBtn);

    // Append text and wrapper to the todo item
    todoItem.appendChild(textDiv);
    todoItem.appendChild(wrapper);

    // Add the complete todo item to the todo list in the UI
    todoList.appendChild(todoItem);
}

function resetHtmlTodos(todos){
    // Refresh the UI by clearing and reloading the todos
    const todoList = document.getElementById("todoList");
    todoList.innerHTML = '';
    todos.todoList.forEach(todo => {
        appendTodoInHtml(todo); // Re-render the updated todo items
    });
}

// Function to toggle the completion status of a todo item
function toggleTodo(event) {
    console.log('toggling ')
    const todoItem = event.target.parentElement.parentElement; // Get the clicked todo item
    const todoId = todoItem.getAttribute("data-id"); // Get the ID of the todo item

    const todos = loadTodos(); // Load current todos

    // Find and toggle the completion status of the todo item
    todos.todoList.forEach(todo => {
        if (todo.id == todoId) {
            todo.isCompleted = !todo.isCompleted;
        }
    });
    console.log(todos)
    refreshTodos(todos); // Update the todos in localStorage
    resetHtmlTodos(todos)

   
}

//Function edit todo
function editTodo(event){
    const todoItem = event.target.parentElement.parentElement; // Get the clicked todo item
    const todoId = todoItem.getAttribute("data-id"); // Get the ID of the todo item
    let todos = loadTodos(); // Load current todos
    const response = prompt("what is the new todo value you want to set ?")
    todos.todoList.forEach(todo => {
        if (todo.id == todoId) {
            todo.text = response;
        }
    });
    refreshTodos(todos); // Update the todos in localStorage
    resetHtmlTodos(todos)
}

//Function Delete todo
function deleteTodo(event){
    const todoItem = event.target.parentElement.parentElement; // Get the clicked todo item
    const todoId = todoItem.getAttribute("data-id"); // Get the ID of the todo item

    let todos = loadTodos(); // Load current todos
    // Find and toggle the completion status of the todo item
    todos.todoList = todos.todoList.filter(todo => todo.id != todoId);
    refreshTodos(todos)
    resetHtmlTodos(todos)

}

function addNewTodo(){
    const todoText = todoInput.value;
    if (todoText === '') {
        alert("Please write something for the todo");
    } else {
        todos = loadTodos(); // Reload todos before adding a new one
        const id = todos.todoList.length; // Assign a new ID based on the length of the todo list
        addTodoToLocalStorage({ text: todoText, isCompleted: false, id }); // Add new todo
        appendTodoInHtml({ text: todoText, isCompleted: false, id }); // Display the new todo in the UI
        todoInput.value = ''; // Clear the input field
    }
}

// Event listener for when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    const todoInput = document.getElementById("todoInput");
    const submitButton = document.getElementById("addTodo");

    let todos = loadTodos(); // Load current todos

    const todoList = document.getElementById("todoList");
    const filterBtn = document.getElementsByClassName("filterBtn");

    // Add event listeners for filter buttons
    for (const btn of filterBtn) {
        btn.addEventListener("click", executeFilterAction);
    }



    // Event listener for todo input change
    todoInput.addEventListener("change", (event) => {
        const todoText = event.target.value.trim(); // Get the input value and trim whitespace
        event.target.value = todoText; // Set the trimmed value back in the input field
        console.log(event.target.value);
    });

    // Event listener for the submit button (adding new todo)
    submitButton.addEventListener("click", addNewTodo);

    // Render the todos on page load
    todos.todoList.forEach(todo => {
        appendTodoInHtml(todo); // Display each todo in the UI
    });

    //add todo on enter press
    document.addEventListener("keypress" , (event) => {
        if(event.code == "Enter"){
            addNewTodo()
        }
    })


});


//adding dom prompts