# Portfolio Web - Fernando Lombardo

Este é um projeto de portfolio web interativo e imersivo, focado em demonstrar habilidades em Creative Technology, Design UI/UX e Desenvolvimento Frontend Moderno.

O projeto utiliza uma estética "Glassmorphism" combinada com elementos 3D e animações fluidas para criar uma experiência de usuário premium.

## 🚀 Tecnologias

*   **HTML5/CSS3**: Estrutura semântica e estilização avançada com CSS Variables e Flexbox/Grid.
*   **JavaScript (Vanilla)**: Lógica da aplicação sem dependência de frameworks pesados de SPA.
*   **[Three.js](https://threejs.org/)**: Renderização de elementos 3D interativos (background ambiental).
*   **[GSAP](https://greensock.com/gsap/)**: Biblioteca poderosa para animações de alta performance.
*   **[ScrollTrigger](https://greensock.com/scrolltrigger/)**: Plugin do GSAP para animações baseadas em rolagem (Scrollytelling).

## ✨ Funcionalidades

*   **Experiência 3D Ambiental**: Fundo interativo com partículas/orbs que reagem ao movimento do mouse ("Fluxo Etéreo").
*   **Navegação Híbrida**: Combinação de rolagem vertical (seções padrão) e horizontal (galeria de projetos).
*   **Design Glassmorphism**: Uso intensivo de desfoque (backdrop-filter), transparências e bordas sutis para um visual moderno.
*   **Interações Magnéticas**: Botões que atraem levemente o cursor do mouse para uma sensação tátil.
*   **Modal de Projetos**: Sistema dinâmico para exibição de detalhes dos projetos sem recarregar a página.
*   **Responsividade**: Layout adaptável para dispositivos móveis e desktops.

## 📂 Estrutura do Projeto

```
/
├── assets/
│   ├── css/
│   │   └── style.css       # Estilos globais e componentes
│   ├── js/
│   │   └── main.js         # Lógica 3D, Animações e Dados dos Projetos
│   └── img/                # Imagens otimizadas (WebP/PNG)
└── index.php               # Arquivo principal (Estrutura HTML)
```

## 🛠️ Como Executar

Este é um projeto estático (HTML/CSS/JS). Embora o arquivo principal tenha a extensão `.php`, ele não contém código PHP server-side obrigatório para renderização básica e pode ser servido por qualquer servidor web.

### Opção 1: Servidor PHP (Recomendado se manter .php)
Se você tem PHP instalado ou usa XAMPP/Laragon:
```bash
php -S localhost:8000
```
Acesse `http://localhost:8000` no navegador.

### Opção 2: Live Server (VS Code)
Se preferir não usar PHP, você pode renomear `index.php` para `index.html` e usar a extensão **Live Server** do VS Code.

## ⚙️ Personalização

### Adicionar Novos Projetos
Os dados dos projetos estão centralizados no arquivo `assets/js/main.js`. Procure pelo objeto `projectDetails`:

```javascript
const projectDetails = {
    'novo-id': {
        title: 'Título do Projeto',
        number: '04',
        tags: ['Tech 1', 'Tech 2'],
        images: ['caminho/para/imagem.png'],
        description: 'Descrição completa...',
        github: 'url-do-repo',
        live: 'url-do-demo'
    },
    // ...
};
```
Lembre-se de adicionar o card HTML correspondente no `index.php` com o atributo `data-img="novo-id"`.

## 🎨 Créditos

Desenvolvido por **Fernando Lombardo**.
Design inspirado em princípios de "Google Material You" e estética Apple.
