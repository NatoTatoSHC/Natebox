addCategory("Developers", "DEV");

elements.commands = {
    color: `rgb(35, 176, 0)`,
    category: "DEV",
}

toolElements.commands = function (x, y) {
    let command = prompt("Yes Master");
    switch (command) {
        case 'toggleShowDarkMatter':
            showDarkMatter = !showDarkMatter;
            break;
    }
    return true;
}