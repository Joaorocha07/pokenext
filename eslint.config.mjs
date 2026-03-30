import nextTs from "eslint-config-next/typescript"
import nextVitals from "eslint-config-next/core-web-vitals"

import { defineConfig, globalIgnores } from "eslint/config"

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  
  {
    rules: {
      "max-len": [
        "error", 
        {
          code: 80,              
          tabWidth: 2,           
          ignoreUrls: true,     
          ignoreStrings: false,  
          ignoreTemplateLiterals: false, 
          ignoreRegExpLiterals: true,
          ignoreComments: false
        }
      ],
      
      "semi": ["error", "never"],
      
      "sort-imports": [
        "error",
        {
          ignoreCase: false,
          ignoreDeclarationSort: false,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
          allowSeparatedGroups: true,
        }
      ],

      "no-unused-vars": [
        "error",
        {
          vars: "all",
          args: "after-used",
          ignoreRestSiblings: true,
          argsIgnorePattern: "^_",
        }
      ],
      
      "no-restricted-imports": [
        "warn",
        {
          patterns: [
            {
              group: ["../../*"],
              message: "Use aliases de path (@/components) em vez de imports relativos profundos",
            },
          ],
        },
      ],
      
      "newline-before-return": "error",
      
      "linebreak-style": "off",
      
      "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 1 }],
      
      "padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: "*", next: "return" },
        { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
        { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] },
      ],
    },
  },

  {
    files: ["**/*.tsx", "**/*.ts", "**/*.jsx", "**/*.js"],
    rules: {
      "max-len": [
        "error",
        {
          code: 80,
          tabWidth: 2,
          ignoreUrls: true,
          ignoreStrings: true,    
          ignoreTemplateLiterals: true,
          ignoreRegExpLiterals: true,
          ignoreComments: false,
        }
      ],
    },
  },

  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
    "*.config.*"
  ]),
])

export default eslintConfig