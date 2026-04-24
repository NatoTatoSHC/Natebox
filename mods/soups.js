addCategory("Soup", "SOUP");

elements.creamy_water = {
    state: "liquid",
    movement: behaviors.LIQUID,
    category: "SOUP",
    density: 1.10,
    color: "rgb(173, 214, 219)",
    reactions: [
    ]
};
elements.chicken_broth = {
    state: "liquid",
    movement: behaviors.LIQUID,
    category: "SOUP",
    density: 1.15,
    color: "rgb(255, 212, 112)",
    reactions: [
        {
            is: "creamy_water",
            replaceWith: "cream_of_chicken_soup",
            replaceSelf: "air"
        }
    ]
};
elements.cream_of_chicken_soup = {
    state: "liquid",
    movement: behaviors.LIQUID,
    category: "SOUP",
    density: 1.70,
    color: "rgb(254, 255, 186)"
};

//Add Reactions
//raw_chicken
if (!elements.raw_chicken.reactions) {
    elements.raw_chicken.reactions = [];
}
elements.raw_chicken.reactions.push({
    is: "water",
    replaceWith: "chicken_broth",
    replaceSelf: "air"
});

//Cream
if (!elements.cream.reactions) {
    elements.cream.reactions = [];
}
elements.cream.reactions.push({
    is: "water",
    replaceWith: "creamy_water",
    replaceSelf: "air"
});