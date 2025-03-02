# Updated README.md for EyeGasm Project

````markdown
# EYEGASM

![EYEGASM](public/hero-preview.png)

## Visual Experiences That Captivate Your Senses

EYEGASM is a modern, visually-stunning web experience built with Next.js, leveraging smooth scrolling animations and parallax effects to create an immersive user experience.

## 🚀 Features

- **Smooth Scroll Experience** - Powered by Locomotive Scroll for butter-smooth scrolling
- **Captivating Animations** - Elegant entrance animations and interactive elements
- **Parallax Effects** - Multi-layered depth through parallax scrolling
- **Responsive Design** - Optimized for all devices from mobile to desktop
- **Modern Minimal UI** - Clean, sophisticated interface with focus on visual content
- **Performance Optimized** - Fast loading and smooth rendering

## 🛠️ Technologies

- [Next.js 15](https://nextjs.org/) - React framework
- [Locomotive Scroll](https://locomotivemtl.github.io/locomotive-scroll/) - Smooth scrolling library
- [CSS Modules](https://github.com/css-modules/css-modules) - Component-scoped styling
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- [React](https://reactjs.org/) - UI Component library

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/eyegasm.git
   cd eyegasm
   ```
````

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

4. **Visit the site**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
eyegasm/
├── public/            # Static files
├── src/
│   ├── app/           # Next.js app directory
│   │   ├── globals.css # Global styles
│   │   ├── page.js    # Main page component
│   │   └── layout.js  # Root layout
│   ├── components/    # React components
│   │   ├── LoadingScreen.js
│   │   ├── HeroSection.js
│   │   ├── FeaturesSection.js
│   │   ├── ParallaxSection.js
│   │   └── TestimonialsSection.js
│   └── styles/        # CSS modules
│       ├── main.css   # Main styles
│       ├── animations.css # Animation keyframes
│       └── components/ # Component-specific styles
│           ├── hero.module.css
│           ├── features.module.css
│           └── ...
├── package.json
└── README.md
```

## 🎨 Custom Styling

EYEGASM uses a modular CSS approach with CSS variables for theming:

```css
:root {
  /* Main colors */
  --color-bg-primary: #1a2a3a; /* Deep navy blue */
  --color-bg-secondary: #243447; /* Slightly lighter blue */
  --color-text: #e0e7ee; /* Soft off-white */
  --color-text-muted: #a2b2c3; /* Muted blue-gray */

  /* Accent colors */
  --color-accent: #8eb8a7; /* Sage green */
  --color-accent-hover: #a2cdbd; /* Lighter sage */
  --color-accent-secondary: #d4a5a5; /* Soft pink */
}
```

You can easily customize the color scheme by modifying these variables in `globals.css`.

## 🚢 Deployment

### Build for production

```bash
npm run build
```

### Start production server

```bash
npm run start
```

### Deploy to Vercel

The easiest way to deploy your Next.js app is to use [Vercel](https://vercel.com/):

```bash
npm install -g vercel
vercel
```

## 🧩 Extending the Project

### Adding New Sections

1. Create a new component in components
2. Create corresponding CSS module in components
3. Import and add the component to `page.js`

### Adding Animations

Custom animations are defined in `animations.css` and can be applied to any element:

```css
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animated-element {
  animation: fadeIn 1s ease-out forwards;
}
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👏 Acknowledgements

- Design inspiration from [Locomotive Scroll](https://locomotivemtl.github.io/locomotive-scroll/)
- Font families: [Montserrat](https://fonts.google.com/specimen/Montserrat) and [Inter](https://fonts.google.com/specimen/Inter)
- Background images from [Unsplash](https://unsplash.com/)

```

This README provides a comprehensive overview of your EyeGasm project, including installation instructions, project structure, customization options, and deployment guidance. Feel free to adjust any sections to better match your specific project details.
This README provides a comprehensive overview of your EyeGasm project, including installation instructions, project structure, customization options, and deployment guidance. Feel free to adjust any sections to better match your specific project details.
```
