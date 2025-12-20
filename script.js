// Optional overrides; by default we load `posts/<projectId>.md`.
const projectData = {
    "lab-1": { markdownPath: "posts/lab-1.md" },
    "lab-2": { markdownPath: "posts/lab-2.md" },
    "lecture-1": { markdownPath: "posts/lecture-1.md" },
    "project-1": { markdownPath: "posts/project-1.md" }
};

const markdownCache = new Map();
let activeProjectId = null;

function filterProjects(category, btnElement) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    btnElement.classList.add('active');

    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}

function showGallery() {
    const gallery = document.getElementById('gallery');
    const filterNav = document.querySelector('.filter-nav');
    const detailView = document.getElementById('project-detail');

    gallery.classList.remove('hidden');
    filterNav.classList.remove('hidden');
    detailView.classList.add('hidden');
    
    history.pushState(null, null, ' ');
}

function renderProjectDetails(projectId) {
    const gallery = document.getElementById('gallery');
    const filterNav = document.querySelector('.filter-nav');
    const detailView = document.getElementById('project-detail');
    const detailTitle = document.getElementById('detail-title');
    const detailImage = document.getElementById('detail-image');
    const detailContent = document.getElementById('detail-content');

    const card = document.querySelector(`.project-card[data-id="${projectId}"]`);
    if (!card) return;

    const title = card.querySelector('.project-title').innerHTML;
    const imageSrc = card.querySelector('img').src;
    const imageAlt = card.querySelector('img').alt;

    detailTitle.innerHTML = title;
    detailImage.src = imageSrc;
    detailImage.alt = imageAlt;

    activeProjectId = projectId;
    detailContent.innerHTML = '<p class="loading">Loading…</p>';
    renderProjectMarkdown(projectId).catch(() => {
        if (activeProjectId !== projectId) return;
        detailContent.innerHTML = "<p>Couldn't load this post. Please try again.</p>";
    });

    gallery.classList.add('hidden');
    filterNav.classList.add('hidden');
    detailView.classList.remove('hidden');

    window.scrollTo(0, 0);
}

function escapeHtml(text) {
    return text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

function isSafeUrl(url) {
    const trimmed = url.trim();
    const lower = trimmed.toLowerCase();
    if (lower.startsWith("javascript:")) return false;
    if (lower.startsWith("data:")) return false;
    if (lower.startsWith("vbscript:")) return false;
    return (
        lower.startsWith("http://") ||
        lower.startsWith("https://") ||
        lower.startsWith("mailto:") ||
        lower.startsWith("#") ||
        lower.startsWith("/") ||
        lower.startsWith("./") ||
        lower.startsWith("../") ||
        !/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(lower) // relative without scheme
    );
}

function normalizeMarkdown(text) {
    return text.replaceAll("\r\n", "\n").replaceAll("\r", "\n");
}

function getMarkdownPathForProject(projectId) {
    return projectData[projectId]?.markdownPath ?? `posts/${projectId}.md`;
}

function parseLinkTarget(rawTarget) {
    const trimmed = rawTarget.trim();
    if (!trimmed) return { url: "", title: "" };

    const match = trimmed.match(/^(\S+)(?:\s+"([^"]*)")?$/);
    if (!match) return { url: trimmed, title: "" };

    return { url: match[1], title: match[2] ?? "" };
}

function renderInlineMarkdown(text) {
    let output = escapeHtml(text);

    // Inline code
    output = output.replace(/`([^`]+)`/g, (_m, code) => `<code>${code}</code>`);

    // Bold
    output = output.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    output = output.replace(/__([^_]+)__/g, "<strong>$1</strong>");

    // Italic (simple)
    output = output.replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, "$1<em>$2</em>");
    output = output.replace(/(^|[^_])_([^_]+)_(?!_)/g, "$1<em>$2</em>");

    // Links
    output = output.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label, target) => {
        const { url, title } = parseLinkTarget(target);
        if (!url || !isSafeUrl(url)) return escapeHtml(label);
        const safeUrl = escapeHtml(url);
        const safeTitle = title ? ` title="${escapeHtml(title)}"` : "";
        const isExternal = /^https?:\/\//i.test(url);
        const externalAttrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : "";
        return `<a href="${safeUrl}"${safeTitle}${externalAttrs}>${label}</a>`;
    });

    return output;
}

function renderMarkdown(markdown) {
    const lines = normalizeMarkdown(markdown).split("\n");
    let index = 0;
    const html = [];

    const consumeWhile = (predicate) => {
        const start = index;
        while (index < lines.length && predicate(lines[index], index)) index += 1;
        return lines.slice(start, index);
    };

    const isBlank = (line) => /^\s*$/.test(line);
    const headingMatch = (line) => line.match(/^(#{1,6})\s+(.+?)\s*$/);
    const fenceMatch = (line) => line.match(/^\s*```(\w+)?\s*$/);
    const imageOnlyMatch = (line) => line.match(/^\s*!\[([^\]]*)\]\(([^)]+)\)\s*$/);
    const listItemMatch = (line) => line.match(/^(\s*)([-*+]|\d+\.)\s+(.+?)\s*$/);

    const stripWrapper = (rendered) => {
        const prefix = '<div class="markdown-body">';
        const suffix = "</div>";
        if (rendered.startsWith(prefix) && rendered.endsWith(suffix)) {
            return rendered.slice(prefix.length, -suffix.length);
        }
        return rendered;
    };

    const renderBlocks = (blockLines) => stripWrapper(renderMarkdown(blockLines.join("\n")));

    const renderFigureFromImageLine = (line) => {
        const match = imageOnlyMatch(line);
        if (!match) return null;
        const alt = match[1] ?? "";
        const { url, title } = parseLinkTarget(match[2] ?? "");
        if (!url || !isSafeUrl(url)) return `<p>${renderInlineMarkdown(line)}</p>`;
        const safeUrl = escapeHtml(url);
        const safeAlt = escapeHtml(alt);
        const caption = title ? `<figcaption>${escapeHtml(title)}</figcaption>` : "";
        return `<figure><img src="${safeUrl}" alt="${safeAlt}">${caption}</figure>`;
    };

    while (index < lines.length) {
        const line = lines[index];

        if (isBlank(line)) {
            index += 1;
            continue;
        }

        const fence = fenceMatch(line);
        if (fence) {
            const language = fence[1] ?? "";
            index += 1;
            const codeLines = consumeWhile((l) => !fenceMatch(l));
            if (index < lines.length) index += 1; // closing fence
            const code = escapeHtml(codeLines.join("\n"));
            const langClass = language ? ` class="language-${escapeHtml(language)}"` : "";
            html.push(`<pre><code${langClass}>${code}</code></pre>`);
            continue;
        }

        const heading = headingMatch(line);
        if (heading) {
            const level = heading[1].length;
            const text = renderInlineMarkdown(heading[2]);
            html.push(`<h${level}>${text}</h${level}>`);
            index += 1;
            continue;
        }

        const figure = renderFigureFromImageLine(line);
        if (figure) {
            html.push(figure);
            index += 1;
            continue;
        }

        const listStart = listItemMatch(line);
        if (listStart) {
            const baseIndent = listStart[1].length;
            const isOrdered = /\d+\./.test(listStart[2]);
            const tag = isOrdered ? "ol" : "ul";
            const items = [];

            while (index < lines.length) {
                const current = lines[index];
                const match = listItemMatch(current);
                if (!match) break;
                if (match[1].length !== baseIndent) break;
                if ((/\d+\./.test(match[2])) !== isOrdered) break;

                const itemLines = [match[3]];
                const contentIndent = baseIndent + match[2].length + 1;
                index += 1;

                while (index < lines.length) {
                    const next = lines[index];
                    if (isBlank(next)) {
                        itemLines.push("");
                        index += 1;
                        continue;
                    }

                    const nextMatch = listItemMatch(next);
                    if (nextMatch && nextMatch[1].length === baseIndent && ((/\d+\./.test(nextMatch[2])) === isOrdered)) {
                        break;
                    }

                    // Continuation line: requires greater indent than the list marker line.
                    if (/^\s+/.test(next)) {
                        itemLines.push(next.slice(Math.min(next.length, contentIndent)));
                        index += 1;
                        continue;
                    }

                    break;
                }

                items.push(itemLines);
            }

            const renderedItems = items
                .map((item) => `<li>${renderBlocks(item)}</li>`)
                .join("");
            html.push(`<${tag}>${renderedItems}</${tag}>`);
            continue;
        }

        const paragraphLines = consumeWhile((l) => !isBlank(l) && !headingMatch(l) && !fenceMatch(l) && !listItemMatch(l));
        const paragraphText = paragraphLines.join(" ").trim();
        html.push(`<p>${renderInlineMarkdown(paragraphText)}</p>`);
    }

    return `<div class="markdown-body">${html.join("")}</div>`;
}

async function renderProjectMarkdown(projectId) {
    const markdownPath = getMarkdownPathForProject(projectId);

    if (markdownCache.has(markdownPath)) {
        if (activeProjectId !== projectId) return;
        document.getElementById("detail-content").innerHTML = markdownCache.get(markdownPath);
        return;
    }

    const response = await fetch(markdownPath, { cache: "no-cache" });
    if (!response.ok) throw new Error(`Failed to load markdown: ${response.status}`);

    const markdown = await response.text();
    const rendered = renderMarkdown(markdown);
    markdownCache.set(markdownPath, rendered);

    if (activeProjectId !== projectId) return;
    document.getElementById("detail-content").innerHTML = rendered;
}

function openProject(projectId) {
    renderProjectDetails(projectId);
    history.pushState({id: projectId}, '', '#' + projectId);
}

document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const projectId = card.getAttribute('data-id');
            openProject(projectId);
        });
    });

    window.addEventListener('popstate', (event) => {
        const hash = window.location.hash.substring(1); 
        if (hash) {
            renderProjectDetails(hash);
        } else {
            const gallery = document.getElementById('gallery');
            const filterNav = document.querySelector('.filter-nav');
            const detailView = document.getElementById('project-detail');
            
            gallery.classList.remove('hidden');
            filterNav.classList.remove('hidden');
            detailView.classList.add('hidden');
        }
    });

    const initialHash = window.location.hash.substring(1);
    if (initialHash) {
        renderProjectDetails(initialHash);
    }

    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        body.classList.add('dark-mode');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const currentTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', currentTheme);
    });
});
