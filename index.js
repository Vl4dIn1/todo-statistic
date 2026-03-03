const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    const parts = command.split(' ')
    const action = parts[0]
    const arg = parts[1]
    switch (action) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            const todos = findAllTodo();
            printTodos(todos);
            break;
        case 'important':
            const todosWithMark = printWithExclamationMark();
            printTodos(todosWithMark);
            break;
        case 'user':
            const todoWithUser = printWithUser(arg);
            printTodos(todoWithUser);
            break;
        case 'sort':
            const argum = parts[1]
            let sortedTodos = []
            switch (argum) {
                case 'important':
                    const todos = findAllTodo();
                    sortedTodos = sortByImportance(todos);
                    printTodos(sortedTodos);
                    break;
                default:
                    console.log('Unknown command ');
                    break;
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function getTodoFromLine(line) {
    if (line.trim().startsWith('// TODO')) {
        return line;
    }
    return null;
}

function findAllTodo() {
    const todos = []
    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        const strings = file.split('\n');
        for (let j = 0; j < strings.length; j++) {
            const line = strings[j];
            if (getTodoFromLine(line)) {
                todos.push(line);
            }
        }
    }
    return todos;
}

function printTodos(todos) {

    for (let i = 0; i < todos.length; i++) {
        console.log(todos[i]);
    }
}

function printWithExclamationMark() {
    const todos = []
    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        const strings = file.split('\n');
        for (let j = 0; j < strings.length; j++) {
            const line = strings[j];
            if (getTodoFromLine(line) && line.includes("!")) {
                todos.push(line);
            }
        }
    }
    return todos;
}

function printWithUser(arg) {
    const todos = []
    const searchUser = arg.toLowerCase()
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const strings = file.split('\n');

        for (let j = 0; j < strings.length; j++) {
            const line = strings[j];
            const todoLine = getTodoFromLine(line);

            if (todoLine) {
                const lowerLine = line.toLowerCase()
                const afterTodo = lowerLine.substring(lowerLine.indexOf('todo') + 4).trim();

                if (afterTodo.startsWith(searchUser + ';')) {
                    todos.push(line);
                }
            }
        }
    }
    return todos;
}

function findExclamationMarkInLine(line) {
    let count = 0;
    for (let i = 0; i < line.length; i++) {
        if (line[i] === 'i') {
            count++;
        }
    }
    return count;
}

function getAuthor(line) {
    const withoutTodo = line.substring(line.indexOf('TODO') + 5).trim();
    const semicolonPos = withoutTodo.indexOf(';');
    if (semicolonPos > 0) {
        return withoutTodo.substring(0, semicolonPos).trim();
    }
    return null
}

function getDate(line) {
    const withoutTodo = line.substring(line.indexOf('TODO') + 5).trim();
    const semicolonPos = withoutTodo.indexOf(';');
    if (semicolonPos > 0) {
        const afterAuthor = withoutTodo.substring(semicolonPos + 1).trim();
        const secondSemicolonPos = withoutTodo.indexOf(';');
        if (secondSemicolonPos) {
            return afterAuthor.substring(0, secondSemicolonPos).trim();
        }
    }
    return null
}

function sortByImportance() {

    const todos = findAllTodo()
    for (let i = 0; i < todos.length - 1; i++) {
        for (let j = 0; j < todos.length - i - 1; j++) {
            const count1 = findExclamationMarkInLine(todos[j]);
            const count2 = findExclamationMarkInLine(todos[j + 1]);

            if (count1 < count2) {
                let temp = todos[j];
                todos[j] = todos[j + 1];
                todos[j + 1] = temp;
            }
        }
    }
    return todos;
}

function groupByUser() {
    const todos = findAllTodo()
    const groups = {}
    const notAuthor = []
    for (let i = 0; i < todos.length; i++) {
        const todo = todos[i]
        const author = getAuthor(todo)
        if (author) {
            if (!groups[author]) {
                groups[author] = [];
            }
            groups[author].push(todo)
        } else {
            notAuthor.push(todo)
        }
    }

    const result = []
    const sortedAuthors = Object.keys(groups).sort((a, b) =>
        a.toLowerCase().localeCompare(b.toLowerCase())
    );

    for (let i = 0; i < sortedAuthors.length; i++) {
        const author = sortedAuthors[i];
        const authorTodos = groups[author];
        result.push(`${author}`)
        for (let j = 0; j < authorTodos.length; j++) {
            result.push(`${authorTodos[j]}`);
        }
    }

    if (notAuthor.length > 0) {
        result.push('Безымянные')
        for (let j = 0; j < notAuthor.length; j++) {
            result.push(notAuthor[j]);
        }
    }
    return result;
}