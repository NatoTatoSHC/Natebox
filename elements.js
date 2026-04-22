var behaviors = {
    POWDER: [
        ["0;1"],
        ["1;1", "-1;1"]
    ],
    LIQUID: [
        ["0;1"],
        ["1;1", "-1;1", "1;0", "-1;0"]
    ],
    GAS: [
            ["0;-1", "-1;0", "1;0"],
            ["1;1", "1;-1", "-1;1", "-1;-1"]
        ]
}
var elements = {
    air: {category: "TOOL"},
    heat: {category: "TOOL", color: `rgb(255, 0, 0)`},
    drink: {category: "TOOL", color: `rgb(0, 0, 255)`},
    sand: {
        state: "solid",
        category: "LAND",
        movement: behaviors.POWDER,
        color: `rgb(227, 220, 125)`,
        density: 2
    },
    mud: {
        state: "solid",
        category: "LAND",
        movement: [
            ["0;1"]
        ],
        color: `rgb(90, 60, 0)`,
        density: 2
    },
    smoke: {
        state: "gas",
        category: "GASES",
        movement: behaviors.GAS,
        color: `rgb(78, 78, 78)`,
        density: 0
    },
    water: {
        state: "liquid",
        category: "LIQUID",
        movement: behaviors.LIQUID,
        color: `rgb(21, 0, 255)`,
        reactions: [
            {
                cell: "0;1",
                is: "concrete_powder",
                replaceWith: "concrete"
            }
        ],
        converts: {
            cold: {},
            hot: {
                100: "steam",
                1000: "bomb",
                10000: "nuke"
            }
        },
        density: 1
    },
    steam: {
        state: "gas",
        category: "GASES",
        movement: behaviors.GAS,
        color: `rgb(157, 157, 157)`,
        density: 0
    },
    plastic: {
        state: "solid",
        category: "SOLIDS",
        color: `rgb(137, 137, 137)`
    },
    wood: {
        state: "solid",
        category: "BIO",
        color: `rgb(103, 86, 55)`,
        flamable: .05,
        coalChance: 5
    },
    branch: {
        state: "solid",
        category: "BIO",
        color: `rgb(103, 86, 55)`,
        grow: {
            tick: {
                min: 20,
                max: 30
            },
            growth: ["branch", "leaves"]
        }
    },
    leaves: {
        state: "solid",
        category: "BIO",
        color: `rgb(0, 255, 21)`
    },
    steel: {
        state: "solid",
        category: "SOLIDS",
        color: `rgb(211, 211, 211)`
    },
    stone: {
        state: "solid",
        category: "LAND",
        color: `rgb(117, 117, 117)`
    },
    gravel: {
        state: "solid",
        category: "LAND",
        movement: behaviors.POWDER,
        color: `rgb(115, 115, 115)`,
        density: 2
    },
    concrete: {
        state: "solid",
        category: "SOLIDS",
        color: `rgb(130, 130, 130)`
    },
    concrete_powder: {
        state: "solid",
        category: "POWDERS",
        movement: behaviors.POWDER,
        color: `rgb(165, 165, 165)`,
        density: 2
    },
    glass: {
        state: "solid",
        category: "SOLIDS",
        color: `rgb(147, 215, 255)`
    },
    bomb: {
        state: "solid",
        category: "WEAPONS",
        color: `rgb(26, 97, 0)`,
        movement: [
            ["0;1"]
        ],
        explode: {
            trigger: "impact",
            size: 2
        },
        density: 2
    },
    nuke: {
        state: "solid",
        category: "WEAPONS",
        movement: [
            ["0;1"]
        ],
        color: "rgb(251, 255, 0)",
        explode: {
            trigger: "impact",
            size: 20
        },
        density: 2
    },
    corsaylium: {
        state: "solid",
        category: "SPEC",
        movement: [
            ["0;1"]
        ],
        color: `rgb(248, 255, 123)`,
        reactions: [
            {
                cell: "0;-1",
                is: "water",
                replaceWith: "corsum",
                replaceSelf: "air"
            },
            {
                cell: "0;-1",
                is: "smoke",
                replaceWith: "air",
                replaceSelf: "corsalinium"
            }
        ],
        density: 2
    },
    corsum: {
        state: "liquid",
        category: "SPEC",
        movement: behaviors.LIQUID,
        color: `rgb(246, 255, 68)`,
        density: 0.01
    },
    corsalinium: {
        state: "gas",
        category: "SPEC",
        movement: behaviors.GAS,
        color: `rgb(140, 147, 0)`,
        density: 0
    },
    fire: {
        state: "energy",
        category: "TOOL",
        color: `rgb(255, 170, 0)`,
        density: 0,
        timeout: {
            min: 50,
            max: 200
        },
        spread: {
            tick: {
                min: 2,
                max: 3
            }
        }
    },
    sugercane_seed: {},
    charcoal: {
        state: "solid",
        category: "POWDERS",
        movement: behaviors.POWDER,
        color: `rgb(42, 42, 42)`,
        flamable: .02
    }
};