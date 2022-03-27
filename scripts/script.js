const mode_switch = () => {
    let img_switch = document.querySelector('.img-switch');
    let body = document.querySelector('body')
    img_switch.addEventListener('click', () => {
        if (!body.classList.contains('dark')){
            body.classList.toggle('dark');
            img_switch.setAttribute('src', './images/icon-sun.svg');
            return 
        };
        body.classList.toggle('dark');
        img_switch.setAttribute('src', './images/icon-moon.svg');
    })
}
mode_switch()


const add_todo = (text) => {
    let todos = document.querySelector('.todos')

    let todo = document.createElement('div');
    todo.classList.add('row');
    todo.classList.add('todo');
    todo.classList.add('draggables');
    todo.setAttribute('draggable','true')
    let btn = document.createElement('button');
    btn.classList.add('btn');
    let todo_details = document.createElement('p');
    todo_details.classList.add('todo-details');
    todo_details.textContent = text;

    let delete_icon = document.createElement('div');
    delete_icon.classList.add('delete-icon');
    let bar_left = document.createElement('div'), bar_right = document.createElement('div');
    
    bar_left.classList.add('bar-left');
    bar_right.classList.add('bar-right');

    delete_icon.appendChild(bar_left);
    delete_icon.appendChild(bar_right);

    todo.appendChild(btn);
    todo.appendChild(todo_details);
    todo.appendChild(delete_icon);

    todos.prepend(todo)
    return todo
}

const input_todo = () => {
    let add_form = document.querySelector('.add-form');
    let input = document.querySelector('.todo-input')
    add_form.addEventListener('submit',() => {
        if (input.value){
            let new_todo = add_todo(input.value);
            input.value = '';
            delete_btn([new_todo]);
            check_btn([new_todo]);
            todo_count()
            drag_functionality();
        }
        return false
    })
}
input_todo()



const delete_btn = (todos) => {
    todos.forEach(todo => {
        let delete_icon = todo.querySelector('.delete-icon')
        delete_icon.addEventListener('click',() => {
            todo.remove();
            todo_count()
        })
    })
}
delete_btn(document.querySelectorAll('.todo'))


const check_btn = (todos) => {
    todos.forEach(todo => {
        let btn = todo.querySelector('.btn');
        let todo_details = todo.querySelector('.todo-details')
        btn.addEventListener('click', () => {
            btn.classList.toggle('checked');
            todo_details.classList.toggle('done');
            todo_count()
        })
    })
} 

check_btn(document.querySelectorAll('.todo'));

const todo_count = () => {
    let count = Array.from(document.querySelectorAll('.todo-details')).filter(todo => !todo.classList.contains('done')).length;
    let span = document.querySelector('[data-items-left]');
    span.textContent = count
}

todo_count()

const clear_completed = () => {
    let clear_button = document.querySelector('[data-clear]');
    clear_button.addEventListener('click', () => {
        let todos = document.querySelectorAll('.todo');
        
        todos.forEach(todo => {
            let todo_details = todo.querySelector('.todo-details');
            if(todo_details.classList.contains('done')){
                todo.remove()
            }
        });
    })
}
clear_completed()

const undo_filter = () => {
    let todos = Array.from(document.querySelectorAll('.todo'));
    let cur_filter = document.querySelector('.filtered');
    todos.forEach(todo => {
        todo.style.display = null;
    })
    cur_filter.classList.remove('filtered');
}

const completed_filter = () => {
    let btn = document.querySelector('#completed');
    btn.addEventListener('click', () => {
        if (!btn.classList.contains('filtered')){
            undo_filter()
            let todos = Array.from(document.querySelectorAll('.todo')).filter(todo => {
                let todo_details = todo.querySelector('.todo-details');
                if (todo_details.classList.contains('done')) return false
                return true
            })
        
            todos.forEach(todo => {
                todo.style.display = 'none';
            })
            btn.classList.add('filtered')
        }
        else {
            undo_filter();
            btn.classList.remove('filtered')
            document.querySelector('.filter:first-child').classList.add('filtered')
        }
    })
}

completed_filter()

const active_filter = () => {
    let btn = document.querySelector('#active');
    btn.addEventListener('click', () => {
        if (!btn.classList.contains('filtered')){
            undo_filter()
            let todos = Array.from(document.querySelectorAll('.todo')).filter(todo => {
                let todo_details = todo.querySelector('.todo-details');
                if (todo_details.classList.contains('done')) return true
                return false
            })
        
            todos.forEach(todo => {
                todo.style.display = 'none';
            })
            btn.classList.add('filtered')
        }
        else {
            undo_filter();
            btn.classList.remove('filtered')
            document.querySelector('.filter:first-child').classList.add('filtered')
        }
    })
}

active_filter()

const no_filter = () => {
    let btn = document.querySelector('#all');
    btn.addEventListener('click', () => {
        if (btn.classList.contains('filtered')) return
        undo_filter()
        btn.classList.add('filtered')
    })
}

no_filter()









const drag_functionality = () => {
    let container = document.querySelector('.todos');
    let draggables = [...document.querySelectorAll('.todo')];
    
    draggables.forEach(item => {
        item.addEventListener('dragstart', () => {
            item.classList.add('dragging');
        })
        item.addEventListener('dragend', () => {
            item.classList.remove('dragging');
        })
    })

    container.addEventListener('dragover', e => {
        e.preventDefault();
        const afterElement = getDragAfterElement(container,e.clientY);
        let dragging = document.querySelector('.dragging');
        if (afterElement) {
            container.insertBefore(dragging,afterElement);
            return
        }
        container.appendChild(dragging)
        return 
    })
    
}
drag_functionality();





function getDragAfterElement(container, y) {
    let draggables = [...container.querySelectorAll('.draggables:not(.dragging)')];
    return draggables.reduce((closest,item) => {
        const box = item.getBoundingClientRect();
        const offset = y - box.top - box.height/2;
        if (offset < 0 && offset > closest['offset']){
            return {'offset': offset,element: item}
        }
        return closest
    },{'offset': Number.NEGATIVE_INFINITY}).element
}
