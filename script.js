const board = {
  columns: [
    {
      id: "todo",
      title: "To Do",
      cards: [
        {
          id: 1,
          title: "Learn JS",
          description: "Practice DOM manipulation",
        },
      ],
    },
    {
      id: "in-progress",
      title: "In Progress",
      cards: [],
    },
    {
      id: "done",
      title: "Done",
      cards: [],
    },
  ],
};

const createCard = (cards, columnContainer) => {
  cards.forEach((card) => {
    const task = document.createElement("div");
    task.classList.add("card");

    const taskTitle = document.createElement("h3");
    taskTitle.classList.add("task-title");
    taskTitle.textContent = card.title;
    task.appendChild(taskTitle);

    const taskDesc = document.createElement("p");
    taskDesc.classList.add("task-description");
    taskDesc.textContent = card.description;
    task.appendChild(taskDesc);

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    task.appendChild(editButton);

    editButton.addEventListener("click", () => {
      const newTitle = prompt("enter new title:");
      if (!newTitle) return;

      const newDescription = prompt("enter new description");

      card.title = newTitle;
      card.description = newDescription;
      renderBoard();
    });

    columnContainer.appendChild(task);
  });
};

const renderBoard = () => {
  board.columns.forEach((column) => {
    const columnContainer = document.getElementById(column.id);
    columnContainer.innerHTML = ""; // clear old cards

    // Create and append column title
    const columnTitle = document.createElement("h2");
    columnTitle.textContent = column.title;
    columnTitle.classList.add("column-title");
    columnContainer.appendChild(columnTitle);

    // Append cards
    createCard(column.cards, columnContainer);
    addCard(columnContainer, column.id);
  });
};

const addCard = (columnContainer, columnId) => {
  console.log(columnContainer);
  const addButton = document.createElement("button");
  addButton.textContent = "Add";
  addButton.dataset.columnId = columnId;
  columnContainer.appendChild(addButton);
  addButton.addEventListener("click", () => {
    const columnId = addButton.dataset.columnId;
    const title = prompt("Enter a card title:");
    if (!title) return;
    const description = prompt("enter a card description");

    const newCard = {
      id: Date.now(), //simple unique ID
      title,
      description,
    };

    const column = board.columns.find((col) => col.id === columnId);

    column.cards.push(newCard);
    renderBoard();
  });
};

renderBoard();
