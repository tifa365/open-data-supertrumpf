I’ve kept the full, ready-to-paste **SupertrumpfCard.jsx** file in the canvas on the right side of your screen—just click anywhere inside that code block to copy it.

### How to drop it into your project

1. **Dependencies**
   Make sure you already have:

   ```bash
   npm i tailwindcss lucide-react
   # plus shadcn/ui if you haven’t set it up yet
   ```

2. **Save the file**
   Put the canvas code in `components/SupertrumpfCard.jsx` (or wherever you keep your React components).

3. **Tailwind config tweaks**
   The component relies on your default Tailwind setup plus the fonts you already use. No extra config is required, but if you want rounded corners that big everywhere else, add:

   ```js
   // tailwind.config.js
   module.exports = {
     theme: {
       extend: {
         borderRadius: {
           'super': '1.75rem',
         },
       },
     },
   }
   ```

   Then swap `rounded-[1.75rem]` for `rounded-super` in the JSX if you like.

4. **Use it**

   ```jsx
   import SupertrumpfCard from '@/components/SupertrumpfCard';

   export default function Demo() {
     return (
       <main className="flex min-h-screen items-center justify-center bg-gray-100">
         <SupertrumpfCard />
       </main>
     );
   }
   ```

### Customising

* **Colours** – tweak the three constants at the top (`blue`, `yellow`) to match your brand palette.
* **Data** – replace the hard-coded array of `[label, value]` tuples with props or API data.
* **Map** – swap out the grey placeholder div for a real SVG/IMG or a mini map component (height adjusts with Tailwind’s `h-52` class).

Let me know if you run into any snags or want to add interactivity!
