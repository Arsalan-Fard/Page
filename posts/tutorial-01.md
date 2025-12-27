This section provides you quick tips about how this blog is created and deployed on github.


## 1. Requirements

This blog is strongly inspired by "https://codepen.io/Vedant-Jain-the-bold/pen/dywQPLz".

To build this blog, we selected a lightweight but powerful stack (we need node js for these):

### **SCSS (Sass)**
We use **SCSS** for styling.
*   **Why?** The 3D environment in this blog is actually built using **CSS 3D Transforms**, not WebGL or Three.js! SCSS allows us to use variables and math functions to easily manage the complex `transform` and `perspective` properties. And also allows us to use cool projects from codepen.


### **Vite**
We use **Vite** as our build tool and development server. 
*   **Why?** It is incredibly fast and bundles our assets efficiently to make sure the moving around this 3d environment is smooth.


### **JavaScript (ES Modules)**
We use vanilla **JavaScript**.
*   **Why?** Since we are manipulating DOM elements for the 3D effect, we don't need the overhead of a heavy framework like React or Angular. We use modern ES Modules to keep our code organized (e.g., separating `camera.js`, `map.js`, and `data.js`).

### **Marked**
We use the **marked** library.
*   **Why?** This allows us to write blog posts in **Markdown** (like this one!) and have them automatically converted to HTML. This separates our content from our code.

## 2. Development

The core concept of this blog is a "CSS 3D Scroller".

1.  **The Scene**: We create a `div` with `perspective: 1000px`.
2.  **The World**: We place a "world" container inside and move it along the Z-axis based on the user's scroll.
3.  **The Objects**: Posts are HTML elements positioned absolutely using `transform: translate3d(...)`.

This approach gives us a 3D feeling while keeping the text selectable and the performance high on standard browsers.

## 3. Deployment

We use **GitHub Pages** for hosting.


*   **Process**: We use the `gh-pages` package. You can follow the instructions in image below to set it up.

![Blog Setup 1](blog_setup/github.png)

*   **Command**: Running "`npm run deploy`" builds the project (using Vite) into a `dist` folder and pushes that folder to a special branch on GitHub,.
