# Pixi.js Game Project

Este projeto é uma aplicação de jogo simples utilizando Pixi.js. O objetivo é fornecer uma base para o treinamento e desenvolvimento de jogos com Pixi.js. Você pode executar o jogo facilmente e trocar entre diferentes jogos modificando o script no arquivo HTML.

## Estrutura do Projeto

project-root/
│
├── dist/ # Diretório para arquivos de build
├── node_modules/ # Dependências do projeto
├── package.json # Gerenciador de dependências e scripts
├── package-lock.json # Versões exatas das dependências
├── src/ # Código-fonte do projeto
│ ├── Flappy/ # Pasta para o jogo Flappy
│ ├── Pick/ # Pasta para o jogo Pick
│ ├── Space/ # Pasta para o jogo Space
│ ├── assets/ # Recursos estáticos (imagens, sons, etc.)
│ └── teste/ # Pasta para testes
├── index.html # Arquivo HTML principal
└── vite.config.js # Configuração do Vite

bash
Copiar código

## Requisitos

Certifique-se de ter o [Node.js](https://nodejs.org/) instalado em sua máquina. Você também precisará do [npm](https://www.npmjs.com/) para instalar as dependências.

## Instalação

1. Clone o repositório para sua máquina local:


git clone https://github.com/seu-usuario/seu-repositorio.git
Navegue para o diretório do projeto:

cd seu-repositorio
Instale as dependências do projeto:


npm install
Execução
Para iniciar o jogo, execute o seguinte comando:


npm run dev
Isso iniciará um servidor de desenvolvimento e abrirá o jogo no seu navegador padrão.

Alterar o Jogo
Para trocar o jogo que está sendo executado:

Abra o arquivo index.html localizado no diretório raiz do projeto.

Localize a tag <script> que inclui o arquivo principal do jogo. Por exemplo:

<script type="module" src="/src/Flappy/main.js"></script>
Substitua o valor do src pelo arquivo JavaScript do jogo que deseja executar. Por exemplo:

<script type="module" src="/src/Space/main.js"></script>
Certifique-se de que o caminho e o nome do arquivo correspondam ao jogo desejado dentro do diretório src.

Salve o arquivo index.html e recarregue o navegador para ver o jogo alterado.

Estrutura do Projeto
index.html: Arquivo principal HTML que inclui o script do jogo. Altere o src aqui para mudar o jogo.
src/: Diretório onde o código-fonte do projeto está localizado.
Flappy/: Pasta para o jogo Flappy.
Pick/: Pasta para o jogo Pick.
Space/: Pasta para o jogo Space.
assets/: Pasta para recursos estáticos como imagens e sons.
teste/: Pasta para testes.
vite.config.js: Configuração do Vite para desenvolvimento e build.
Contribuindo
Se você quiser contribuir para o projeto, sinta-se à vontade para fazer um fork e enviar pull requests. Para sugestões e melhorias, abra uma issue no repositório.

Licença
Este projeto é licenciado sob a MIT License.
