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
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            const todos = findAllTodo();
            printTodos(todos);
            break;
        case 'important':
            const todosWithMark = printWithExclamatioMark();
            printTodos(todosWithMark);
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

function printTodos(todos){

    for (let i = 0; i < todos.length; i++) {
        console.log(todos[i]);
    }
}

function printWithExclamatioMark(){
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
