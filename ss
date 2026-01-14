[33mcommit 3ee65745e6300f4b9f3f26c4c7da4ce6515f3436[m[33m ([m[1;32mDual-mode[m[33m)[m
Author: Arsalan-Fard <arsalan77x@gmail.com>
Date:   Tue Dec 2 11:30:57 2025 +0100

    fix blog setup

[1mdiff --git a/blog_setup/2.png b/blog_setup/2.png[m
[1mindex 3039ca9..ba8ec7d 100644[m
Binary files a/blog_setup/2.png and b/blog_setup/2.png differ
[1mdiff --git a/script.js b/script.js[m
[1mindex dad1ae7..89949db 100644[m
[1m--- a/script.js[m
[1m+++ b/script.js[m
[36m@@ -13,45 +13,32 @@[m [mconst projectData = {[m
                         </figure>[m
                     </li>[m
                     <li>[m
[31m-                        <p>We used https://www.bestfolios.com/portfolio/leahlee to get a template and modified to meets our need.</p>[m
[32m+[m[32m                        <p>We can use https://www.bestfolios.com/portfolio/leahlee to get a template and then we can modify it.</p>[m
                         <figure>[m
                             <img src="blog_setup/2.png" alt="GitHub Pages settings in a repository with 'octocat.github.io' outlined." style="max-width: 100%; height: auto; display: block; margin: 15px 0; border-radius: 6px;">[m
                             <figcaption>Repository naming</figcaption>[m
                         </figure>[m
                     </li>[m
                     <li>[m
[31m-                        <p>Choose a repository visibility. For more information, see <a href="#">About repositories</a>.</p>[m
[31m-                    </li>[m
[31m-                    <li>[m
[31m-                        <p>Toggle <strong>Add README</strong> to <strong>On</strong>.</p>[m
[31m-                    </li>[m
[31m-                    <li>[m
[31m-                        <p>Click <strong>Create repository</strong>.</p>[m
[31m-                    </li>[m
[31m-                    <li>[m
[31m-                        <p>Under your repository name, click <strong>Settings</strong>. If you cannot see the "Settings" tab, select the <strong>...</strong> dropdown menu, then click <strong>Settings</strong>.</p>[m
[32m+[m[32m                        <p>Under the repository name, click <strong>Settings</strong>. If you cannot see the "Settings" tab, select the <strong>...</strong> dropdown menu, then click <strong>Settings</strong>.</p>[m
                         <figure>[m
                             <img src="blog_setup/3.png" alt="Repository header with 'Settings' tab highlighted." style="max-width: 100%; height: auto; display: block; margin: 15px 0; border-radius: 6px;">[m
                             <figcaption>Repository Settings tab</figcaption>[m
                         </figure>[m
                     </li>[m
[32m+[m
                     <li>[m
[31m-                        <p>In the "Code and automation" section of the sidebar, click <strong>Pages</strong>.</p>[m
[32m+[m[32m                        <p>In the "Code and automation" section of the sidebar, click  Pages.</p>[m
                     </li>[m
                     <li>[m
[31m-                        <p>Under "Build and deployment", under "Source", select <strong>Deploy from a branch</strong>.</p>[m
[32m+[m[32m                        <p>Under "Build and deployment", under "Source", select Deploy from a branch.</p>[m
                     </li>[m
[32m+[m
                     <li>[m
                         <p>Under "Build and deployment", under "Branch", use the branch dropdown menu and select a publishing source.</p>[m
[31m-                        <figure>[m
[31m-                            <img src="blog_setup/4.png" alt="GitHub Pages branch selection menu with 'None' outlined." style="max-width: 100%; height: auto; display: block; margin: 15px 0; border-radius: 6px;">[m
[31m-                            <figcaption>GitHub Pages branch selection</figcaption>[m
[31m-                        </figure>                    </li>[m
[31m-                    <li>[m
[31m-                        <p>Optionally, open the <code>README.md</code> file of your repository. The <code>README.md</code> file is where you will write the content for your site. You can edit the file or keep the default content for now.</p>[m
                     </li>[m
                     <li>[m
[31m-                        <p>Visit <code>username.github.io</code> to view your new website. Note that it can take up to 10 minutes for changes to your site to publish after you push the changes to GitHub.</p>[m
[32m+[m[32m                        <p>Visit username.github.io to view your new website. Note that it can take up to 10 minutes for changes to your site to publish after you push the changes to GitHub.</p>[m
                     </li>[m
                 </ol>[m
             </div>[m
