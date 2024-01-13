document.addEventListener("DOMContentLoaded", function () {
  // CALL API TO LOAD BOARDS AND CARDS
  const kanbanBoard = document.getElementById("kanbanBoard");
  const randomData = createRandomData(2, 3); // Adjust the number of lists and cards per list as needed
  randomData.Lists.forEach((list) => {
    const column = createColumn(list);
    kanbanBoard.appendChild(column);
  });

  function createCard(cardData) {
    const card = document.createElement("div");
    card.className = "kanban-card";
    card.draggable = true;
    card.setAttribute("data-position", cardData.position);

    const cardHeader = document.createElement("div");
    cardHeader.className = "kanban-card-header";
    const label = document.createElement("label");
    label.textContent = cardData.title;
    cardHeader.appendChild(label);

    const cardBody = document.createElement("div");
    cardBody.className = "kanban-card-body";
    const paragraph = document.createElement("p");
    paragraph.textContent = cardData.description;
    cardBody.appendChild(paragraph);

    card.appendChild(cardHeader);
    card.appendChild(cardBody);

    return card;
  }

  function createColumn(listData) {
    const column = document.createElement("div");
    column.className = "kanban-column";

    const columnTitle = document.createElement("div");
    columnTitle.className = "kanban__column-title";
    const h1 = document.createElement("h1");
    h1.textContent = listData.name;
    columnTitle.appendChild(h1);

    const cardsContainer = document.createElement("div");
    cardsContainer.className = "cards-container";

    listData.cards.forEach((cardData) => {
      const card = createCard(cardData);
      cardsContainer.appendChild(card);
    });

    column.appendChild(columnTitle);
    column.appendChild(cardsContainer);

    return column;
  }

  function createRandomData(listCount, cardCountPerList) {
    const randomData = { Lists: [] };

    for (let i = 1; i <= listCount; i++) {
      const listData = {
        id: i,
        name: `Random List ${i}`,
        cards: Array.from({ length: cardCountPerList }, (_, index) => ({
          id: index + i + 1,
          listid: `${i}`,
          title: `Random Task ${index + 1}`,
          description: getRandomDescription(),
          position: index + i + 1,
        })),
      };

      randomData.Lists.push(listData);
    }

    return randomData;
  }

  function getRandomDescription() {
    const descriptions = [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }
  setTimeout(() => {
    const draggables = document.querySelectorAll(".kanban-card"); // cards that  need to be dragged
    const droppables = document.querySelectorAll(".kanban-column"); // kanbarn board columns in which cards will come

    console.log(draggables.length);
    draggables.forEach((task) => {
      task.addEventListener("dragstart", () => {
        task.classList.add("is-draggable");
      });
      task.addEventListener("dragend", () => {
        task.classList.remove("is-draggable");
        updateCardPositions();
      });
    });

    droppables.forEach((column) => {
      column.addEventListener("dragover", (e) => {
        e.preventDefault();
        const closestTask = insertAboveTask(column, e.clientY);
        const currTask = document.querySelector(".is-draggable");
        console.log(closestTask)
        console.log(currTask)
        if (!closestTask) {
          column.appendChild(currTask);
        } else {
          column.insertBefore(currTask, closestTask);
        }
      });
    });

    const insertAboveTask = (column, mouseY) => {
      const els = column.querySelectorAll(".kanban-card:not(.is-draggable)");
      console.log(els);
      let closestTask = null;
      let closestTaskOffset = Number.NEGATIVE_INFINITY;
      els.forEach((task) => {
        const { top } = task.getBoundingClientRect();

        const offset = mouseY - top;

        if (offset < 0 && offset > closestTaskOffset) {
          closestTask = task;
          closestTaskOffset = offset;
        }
      });
      return closestTask;
    };

    const updateCardPositions = () => {
      const columns = document.querySelectorAll(".kanban-column");

      columns.forEach((column) => {
        const cards = column.querySelectorAll(".kanban-card");

        cards.forEach((card, index) => {
          card.dataset.position = index + 1;
        });
      });
    };
  }, 1000);
});
