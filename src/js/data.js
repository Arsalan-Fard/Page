export const posts = [
    {
        title: "Lecture and Project",
        meta: "Main Track",
        body: "The project subject is Locomotion. You can see presentations, demos and final project in this path.",
        tags: ["projects", "main"],
        isProjects: true,
        slug: "main-track",
        // image: "images/blog_image.jpg"
    },
    {
        title: "Lab Assignments",
        meta: "Lab Track",
        body: "This path shows lab assignments. You can see unity projects about a ball in Telecom paris!",
        tags: ["lab", "assignments"],
        isLabAssignments: true,
        slug: "lab-track",
        // image: "images/unity_setup_image.jpg"
    },
    {
        title: "Tutorials",
        meta: "Tutorial Track",
        body: "Learn how to setup a blog like this. And also how to setup Unity 6 for your VR projects.",
        tags: ["Tutorial", "theory"],
        isTutorialAssignments: true,
        slug: "tutorial-track",
        // image: "/images/VR_fail_image.jpg"
    },
    
    {
        title: "Lab 01: The Ball",
        meta: "2025.12.25",
        body: "--",
        tags: ["--"],
        isLabRoute: true,
        slug: "lab-01",
        image: "/unity_setup/1.png"
    },
    {
        title: "Lab 02: The VR Ball",
        meta: "2025.12.25",
        body: "--",
        tags: ["--"],
        isLabRoute: true,
        slug: "lab-02",
        image: "/unity_setup/2.png"
    },
    {
        title: "Tutorial 01: Blog Setup",
        meta: "2025.12.18",
        body: "This section provides you quick tips about how this blog is created and deployed on github.",
        tags: ["Sass", "Vite", "GitHub Pages"],
        isTutorialRoute: true,
        slug: "tutorial-01",
        image: "images/blog_image.jpg"
    },
    {
        title: "Tutorial 02: Unity Setup",
        meta: "2025.12.20",
        body: "This section provides you quick tips about how to setup Unity 6.",
        tags: ["Unity 6", "Microsoft Visual Studio"],
        isTutorialRoute: true,
        slug: "tutorial-02",
        image: "images/unity_setup_image.jpg"
    },
    
    {
        title: "Lecture 01: Three Locomotion Techniques",
        meta: "2025.12.08",
        body: "...",
        tags: ["Presentation", "Locomotion", "MR"],
        isProjectRoute: true,
        slug: "lecture-01",
        image: "/images/blog_image.jpg"
    },
    {
        title: "Lecture 02: Proposing our Locomotion Technique",
        meta: "-",
        body: "...",
        tags: ["Presentation", "Locomotion", "MR"],
        isProjectRoute: true,
        slug: "lecture-02",
        image: "/images/unity_setup_image.jpg"
    },
    {
        title: "Project 01: ...",
        meta: "-",
        body: "...",
        tags: ["Presentation", "Locomotion", "MR"],
        isProjectRoute: true,
        slug: "project-01",
        image: "/images/VR_fail_image.jpg"
    },

];

export const spacing = 2300;
export const scatterX = 220;
export const scatterY = 140;

export const totalDepth = (posts.length - 1) * spacing + 2800;
export const introDepth = 5400;
