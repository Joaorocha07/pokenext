import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  
  // Configurações personalizadas
  {
    rules: {
      // ==========================================
      // 1. LIMITE DE LARGURA DE LINHA (max-len)
      // ==========================================
      "max-len": [
        "error", 
        {
          code: 80,              // Máximo de 80 caracteres por linha
          tabWidth: 2,           // Tamanho do tab
          ignoreUrls: true,      // Ignora URLs longas
          ignoreStrings: false,  // Não ignora strings (força quebra)
          ignoreTemplateLiterals: false, // Não ignora template literals
          ignoreRegExpLiterals: true,
          ignoreComments: false, // Valida comentários também
        }
      ],
      
      // ==========================================
      // 2. SEM PONTO E VÍRGULA (semi)
      // ==========================================
      "semi": ["error", "never"],  // Proíbe ponto e vírgula
      
      // ==========================================
      // 3. ORGANIZAÇÃO DE IMPORTS
      // ==========================================
      // Ordenação alfabética dos imports
      "sort-imports": [
        "error",
        {
          ignoreCase: false,
          ignoreDeclarationSort: false, // Ordena declarações
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
          allowSeparatedGroups: true,   // Permite grupos separados
        }
      ],
      
      // Imports não utilizados (erro)
      "no-unused-vars": [
        "error",
        {
          vars: "all",
          args: "after-used",
          ignoreRestSiblings: true,
          argsIgnorePattern: "^_",
        }
      ],
      
      // Preferir imports absolutos do que relativos quando possível
      "no-restricted-imports": [
        "warn",
        {
          patterns: [
            {
              group: ["../../*"], // Evitar ../../../component
              message: "Use aliases de path (@/components) em vez de imports relativos profundos",
            },
          ],
        },
      ],
      
      // ==========================================
      // 4. BOAS PRÁTICAS ADICIONAIS
      // ==========================================
      // Quebra de linha antes do return quando necessário
      "newline-before-return": "error",
      
      // Consistência de quebras de linha
      "linebreak-style": ["error", "unix"], // LF em vez de CRLF
      
      // Múltiplas linhas vazias
      "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 1 }],
      
      // Espaço entre blocos
      "padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: "*", next: "return" },
        { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
        { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] },
      ],
    },
  },
  
  // ==========================================
  // OVERRIDES ESPECÍFICOS
  // ==========================================
  {
    files: ["**/*.tsx", "**/*.ts", "**/*.jsx", "**/*.js"],
    rules: {
      // Para JSX/TSX, podemos ser um pouco mais flexíveis com strings
      "max-len": [
        "error",
        {
          code: 80,
          tabWidth: 2,
          ignoreUrls: true,
          ignoreStrings: true,      // Ignora strings em JSX (className longos)
          ignoreTemplateLiterals: true,
          ignoreRegExpLiterals: true,
          ignoreComments: false,
        }
      ],
    },
  },
  
  // Ignorar arquivos específicos
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
    "*.config.*",  // Arquivos de config
  ]),
]);

export default eslintConfig;