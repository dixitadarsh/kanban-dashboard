const draggables = document.querySelectorAll('.kanban-card'); // cards that  need to be dragged
const droppables = document.querySelectorAll('.kanban-column'); // kanbarn board columns in which cards will come

draggables.forEach((tasks) => {
    tasks.addEventListener('dragstart', (e) => {
        tasks.classList.add('is-draggable')
    });
    tasks.addEventListener('dragend', (e) => {
        tasks.classList.remove('is-draggable')
    });
})

droppables.forEach((column) => { 
    column.addEventListener('dragover', (e) => {
        e.preventDefault();
        const closestTask = insertAboveTask(column,e.clientY);
        const currTask = document.querySelector(".is-draggable");

        if(!closestTask){
            column.appendChild(currTask);
        } else {
            column.insertBefore(currTask,closestTask);
        }
    })
});


const insertAboveTask = (column,mouseY) => { 
    const els = column.querySelectorAll(".tasks:not(.is-draggable)");
    let closestTask = null;
    let closestTaskOffset = Number.NEGATIVE_INFINITY;
    els.forEach((task) => {
        const { top } = task.getBoundingClientRect();

        const offset = mouseY - top;

        if(offset < 0 && offset > closestTaskOffset){
            closestTask = task;
            closestTaskOffset = offset;
        }
    });
    return closestTask;
}
