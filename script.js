const board = {
  columns: [
    { id: "todo", title: "To Do", cards: [] },
    { id: "in-progress", title: "In Progress", cards: [] },
    { id: "done", title: "Done", cards: [] },
  ],
};

// ========== CREATE CARD ==========
const createCard = (cards, columnContainer) => {
  cards.forEach((card) => {
    const task = document.createElement("div");
    task.classList.add("card");
    task.dataset.cardId = card.id;
    task.dataset.columnId = columnContainer.id;
    const cardId = Number(task.dataset.cardId);
    const columnId = task.dataset.columnId;

    // Title
    const taskTitle = document.createElement("h3");
    taskTitle.classList.add("task-title");
    taskTitle.textContent = card.title;
    taskTitle.contentEditable = true;
    task.appendChild(taskTitle);

    taskTitle.addEventListener("blur", () => {
      card.title = taskTitle.textContent;
    });

    // Description
    const taskDesc = document.createElement("p");
    taskDesc.classList.add("task-description");
    taskDesc.textContent = card.description;
    taskDesc.contentEditable = true;
    task.appendChild(taskDesc);

    taskDesc.addEventListener("blur", () => {
      card.description = taskDesc.textContent;
    });

    // Delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    task.appendChild(deleteButton);

    deleteButton.addEventListener("click", () => {
      const pendingDeleteCardId = card.id;
      const pendingDeleteColumnId = columnContainer.id;

      const modal = document.querySelector(".modal");
      modal.classList.remove("hidden");

      const modalText = document.querySelector(".modalText");
      modalText.textContent = `You are about to delete the "${card.title}" task`;

      const cancelButton = document.querySelector(".cancel");
      cancelButton.onclick = () => modal.classList.add("hidden");

      const confirmButton = document.querySelector(".confirm");
      confirmButton.onclick = () => {
        const column = board.columns.find(
          (col) => col.id === pendingDeleteColumnId
        );
        column.cards = column.cards.filter((c) => c.id !== pendingDeleteCardId);
        modal.classList.add("hidden");
        renderBoard();
      };
    });

    // Drag & Drop
    task.setAttribute("draggable", "true");
    task.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", `${cardId}|${columnId}`);
    });

    columnContainer.appendChild(task);
  });
};

// ========== RENDER BOARD ==========
const renderBoard = () => {
  board.columns.forEach((column) => {
    const columnContainer = document.getElementById(column.id);
    columnContainer.innerHTML = "";

    // Column title
    const columnTitle = document.createElement("h2");
    columnTitle.textContent = column.title;
    columnTitle.classList.add("column-title");
    columnContainer.appendChild(columnTitle);

    // Cards
    createCard(column.cards, columnContainer);
    addCard(columnContainer, column.id);
  });
};

// ========== ADD CARD ==========
const addCard = (columnContainer, columnId) => {
  const addButton = document.createElement("button");
  addButton.classList.add("add-button");
  addButton.textContent = "Add";
  addButton.dataset.columnId = columnId;
  columnContainer.appendChild(addButton);

  addButton.addEventListener("click", () => {
    addButton.classList.add("hidden");
    const form = document.createElement("form");

    const titleInput = document.createElement("input");
    titleInput.setAttribute("type", "text");
    titleInput.setAttribute("placeholder", "Task title...");
    titleInput.setAttribute("name", "taskData");

    const descriptionInput = document.createElement("textarea");
    descriptionInput.setAttribute("placeholder", "Task description..");

    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.setAttribute("type", "submit");

    form.appendChild(titleInput);
    form.appendChild(descriptionInput);
    form.appendChild(saveButton);
    columnContainer.appendChild(form);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = titleInput.value.trim();
      const description = descriptionInput.value.trim();
      if (!title) return;

      const newCard = {
        id: Date.now(),
        title,
        description,
      };

      const column = board.columns.find((col) => col.id === columnId);
      column.cards.push(newCard);
      renderBoard();
    });
  });
};

// ========== DRAG & DROP DELEGATION ==========
const boardContainer = document.querySelector(".columns");

boardContainer.addEventListener("dragover", (e) => {
  e.preventDefault();
});

boardContainer.addEventListener("drop", (e) => {
  e.preventDefault();
  const targetColumn = e.target.closest(".column");
  if (!targetColumn) return;

  const [draggedCardId, fromColumnId] = e.dataTransfer
    .getData("text/plain")
    .split("|");
  const draggedCardIdNum = Number(draggedCardId);

  const fromColumn = board.columns.find((col) => col.id === fromColumnId);
  const cardIndex = fromColumn.cards.findIndex(
    (c) => c.id === draggedCardIdNum
  );
  const [draggedCard] = fromColumn.cards.splice(cardIndex, 1);

  const toColumnId = targetColumn.id;
  const toColumn = board.columns.find((col) => col.id === toColumnId);

  // Determine insert position
  const afterCard = e.target.closest(".card");
  if (afterCard && afterCard.dataset.cardId) {
    const toIndex = toColumn.cards.findIndex(
      (c) => c.id === Number(afterCard.dataset.cardId)
    );
    const rect = afterCard.getBoundingClientRect();
    const offset = e.clientY - rect.top;
    const insertIndex = offset > rect.height / 2 ? toIndex + 1 : toIndex;
    toColumn.cards.splice(insertIndex, 0, draggedCard);
  } else {
    toColumn.cards.push(draggedCard);
  }

  renderBoard();
});

// ========== INITIALIZE ==========
renderBoard();
