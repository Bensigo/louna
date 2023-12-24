/** @type {import("eslint").Linter.Config} */
const config = {
    root: true,
    extends: ["@solu/eslint-config"], // uses the config in `packages/config/eslint`
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: "latest",
        tsconfigRootDir: __dirname,
        project: [
            "./tsconfig.json",
            "./apps/*/tsconfig.json",
            "./scripts/tsconfig.json",
            "./packages/*/tsconfig.json",
        ],
    },
    settings: {
        next: {
            rootDir: ["apps/nextjs"],
        },
    },
    rules: {
        "@typescript-eslint/no-misused-promises": "off",
        "no-anonymous-default-export": "off",
        "@typescript-eslint/no-unsafe-return": "off",
        "@typescript-eslint/no-floating-promises": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-var-requires": "off"
    },
}

module.exports = config
