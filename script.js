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

const renderBoard = () => {
  board.columns.forEach((column) => {
    console.log(column);
    const columnContainer = document.getElementById(column.id);
    console.log(columnContainer);
    column.cards.forEach((card) => {
      console.log(card);
      const task = document.createElement("div");
      task.classList.add("card");
      const taskTitle = document.createElement("h3");
      taskTitle.textContent = `${card.title}`;
      taskTitle.classList.add("task-title");
      task.appendChild(taskTitle);

      const taskDesc = document.createElement("p");
      taskDesc.classList.add("task-description");
      taskDesc.textContent = `${card.description}`;
      task.appendChild(taskDesc);

      columnContainer.appendChild(task);
    });
  });
};

renderBoard();
