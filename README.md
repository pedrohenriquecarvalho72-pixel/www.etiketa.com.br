# Etike.Tá Impressos

Loja virtual estática em React + Vite para adesivos personalizados, impressão de apostilas e canecas personalizadas.

## Rodar no computador

Você precisa ter o Node.js 20 ou superior instalado.

```bash
npm install
npm run dev
```

Depois, abra o endereço mostrado pelo Vite, normalmente `http://localhost:5173`.

## Gerar a versão de produção

```bash
npm run build
npm run preview
```

A pasta `dist/` contém os arquivos finais que podem ser hospedados em qualquer serviço de hospedagem estática.

## Publicar no GitHub Pages

1. Crie um repositório novo no GitHub, por exemplo `etiketa-impressos`.
2. Envie todos os arquivos desta pasta para a branch `main` ou `master`.
3. Abra **Settings → Pages** no repositório.
4. Em **Build and deployment**, escolha **GitHub Actions**.
5. O workflow em `.github/workflows/deploy-pages.yml` instalará as dependências, fará o build e publicará o site automaticamente.

Após a primeira execução, o endereço ficará parecido com:

`https://SEU-USUARIO.github.io/etiketa-impressos/`

## Ajustes importantes antes de publicar

- Abra `src/App.jsx` e troque `WHATSAPP_NUMBER` pelo número real da empresa, usando apenas números com código do país.
- Atualize o e-mail e os links de Instagram/Facebook no rodapé.
- Substitua os textos e preços da seção `DATA` no início de `src/App.jsx`.
- Os produtos e os preços estão organizados como objetos simples para facilitar a edição.

## Estrutura

```text
.
├── .github/workflows/deploy-pages.yml
├── public/
├── src/
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```
