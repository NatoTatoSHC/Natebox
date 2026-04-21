var behaviors = {
    POWDER: [
        ["0;1"],
        ["1;1", "-1;1"]
    ]
}
var elements = {
    air: {},
    sand: {
        movement: [
            ["0;1"],
            ["1;1", "-1;1"]
        ],
        color: `rgb(227, 220, 125)`
    },
    mud: {
        movement: [
            ["0;1"]
        ],
        color: `rgb(90, 60, 0)`
    },
    smoke: {
        movement: [
            ["0;1", "0;-1", "1;0", "-1;0"],
            ["1;1", "1;-1", "-1;1", "-1;-1"]
        ],
        color: `rgb(78, 78, 78)`
    },
    water: {
        movement: [
            ["0;1"],
            ["1;1", "-1;1", "1;0", "-1;0"]
        ],
        color: `rgb(21, 0, 255)`
    },
    plastic: {
        color: `rgb(137, 137, 137)`
    },
    wood: {
        color: `rgb(103, 86, 55)`
    },
    steel: {
        color: `rgb(211, 211, 211)`
    },
    stone: {
        color: `rgb(117, 117, 117)`
    },
    gravel: {
        movement: [
            ["0;1"],
            ["1;1", "-1;1"]
        ],
        color: `rgb(115, 115, 115)`
    },
    concrete: {
        color: `rgb(152, 152, 152)`
    },
    concrete_powder: {
        movement: behaviors.POWDER,
        color: `rgb(165, 165, 165)`
    },
    glass: {},
    corsaylium: {
        movement: [
            ["0;1"]
        ],
        color: `rgb(251, 255, 176)`
    }
};