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
    task.dataset.cardId = card.id;
    task.dataset.columnId = columnContainer.id;
    const cardId = Number(task.dataset.cardId);
    const columnId = task.dataset.columnId;

    // const editButton = document.createElement("button");
    // editButton.textContent = "Edit";
    // task.appendChild(editButton);

    // editButton.addEventListener("click", () => {
    //   // const newTitle = prompt("enter new title:");
    //   // if (!newTitle) return;
    //   // const newDescription = prompt("enter new description");
    //   // card.title = newTitle;
    //   // card.description = newDescription;
    //   // renderBoard();
    // });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    task.appendChild(deleteButton);

    deleteButton.addEventListener("click", () => {
      const pendingDeleteCardId = card.id;
      const pendingDeleteColumnId = columnContainer.id;
      console.log(pendingDeleteCardId);
      console.log(pendingDeleteColumnId);
      const modal = document.querySelector(".modal");
      modal.classList.remove("hidden");
      const modalText = document.querySelector(".modalText");
      modalText.textContent = `You are about to delete the ${card.title} task`;

      const cancelButton = document.querySelector(".cancel");
      cancelButton.addEventListener("click", () => {
        modal.classList.add("hidden");
      });

      const confirm = document.querySelector(".confirm");
      confirm.addEventListener("click", () => {
        const column = board.columns.find(
          (col) => col.id === pendingDeleteColumnId
        );
        column.cards = column.cards.filter((c) => c.id !== cardId);
        modal.classList.add("hidden");
        renderBoard();
      });
      // const confirmation = confirm("are u sure u want to delete this card?");

      // if (confirmation === true) {
      //   console.log(columnContainer.id);
      //   console.log(card.id);
      //   const column = board.columns.find((col) => col.id === columnId);
      //   column.cards = column.cards.filter((c) => c.id !== cardId);
      //   renderBoard();
      // }
    });

    taskTitle.contentEditable = true;
    taskDesc.contentEditable = true;
    taskTitle.addEventListener("blur", () => {
      console.log("hello", cardId);
      const newTitle = taskTitle.textContent;
      card.title = newTitle;
    });

    taskDesc.addEventListener("blur", () => {
      console.log("hellodescription", cardId);
      const newDescription = taskDesc.textContent;
      card.description = newDescription;
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
  addButton.classList.add("add-button");
  addButton.textContent = "Add";
  addButton.dataset.columnId = columnId;
  columnContainer.appendChild(addButton);

  addButton.addEventListener("click", () => {
    addButton.classList.add("hidden");
    const columnId = addButton.dataset.columnId;
    const form = document.createElement("form");
    form.setAttribute("id", "taskForm");

    const titleInput = document.createElement("input");
    titleInput.setAttribute("type", "text");
    titleInput.setAttribute("id", "titleInput");
    titleInput.setAttribute("placeholder", "Task title...");
    titleInput.setAttribute("name", "taskData");

    const descriptionInput = document.createElement("textarea");
    descriptionInput.setAttribute("id", "descriptionInput");
    descriptionInput.setAttribute("placeholder", "Task description..");

    const saveButton = document.createElement("button");
    saveButton.classList.add("save-button");
    saveButton.textContent = "save";
    saveButton.setAttribute("type", "submit");

    form.appendChild(titleInput);
    form.appendChild(descriptionInput);
    form.appendChild(saveButton);
    columnContainer.appendChild(form);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      console.log(titleInput.value);
      const title = titleInput.value;
      const description = descriptionInput.value;
      const newCard = {
        id: Date.now(), //simple unique ID
        title,
        description,
      };
      const column = board.columns.find((col) => col.id === columnId);
      column.cards.push(newCard);
      renderBoard();
    });
  });
};

renderBoard();
