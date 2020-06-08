
module.exports = {
    presets: [
        ["@babel/env", {
            "useBuiltIns": "usage",
            "corejs": 3,
        }],
        ["@babel/preset-react"],
    ],
    "plugins": [
        ["@babel/plugin-proposal-class-properties"],
    ]
};
