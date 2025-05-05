

**Tired of manually copy-pasting code snippets and directory structures for LLM prompts, documentation, or code reviews? `ingest-digest` is your streamlined solution!**

This cross-platform desktop application (Windows, macOS, Linux) lets you visually select files and folders from your projects and instantly generates a clean, combined text output containing both the directory structure and the content of your selected files.

---

## The Problem: Lost Context & Tedious Copying

Providing accurate context to Large Language Models (LLMs) or collaborators is crucial but often cumbersome:

*   **Manual Copy-Pasting:** Grabbing multiple files is slow and error-prone.
*   **Lost Structure:** Simply pasting file contents loses the vital context of *where* those files live in the project hierarchy.
*   **Ambiguity:** LLMs can get confused without clear boundaries between different files in a single paste.
*   **Fragmented Information:** Sending file structures and content separately makes it hard to see the whole picture.

## The Solution: `ingest-digest` - Select, Digest, Copy!

`ingest-digest` simplifies this entire process:

1.  **Load:** Open any project directory.
2.  **Select:** Intuitively browse the file tree and check the boxes next to the files and folders you need. Smart parent/child checkbox logic makes selection easy.
3.  **Digest:** Instantly see a preview pane populate with:
    *   A clean ASCII representation of your selected directory structure.
    *   The full content of all selected files, clearly delimited.
4.  **Copy:** Hit the copy button to get the perfectly formatted context block onto your clipboard.


## Key Features

*   📁 **Intuitive Directory Explorer:** Easily navigate your project structure.
*   ✅ **Selective File/Folder Checking:** Choose exactly what context to include with smart tri-state checkboxes for directories.
*   👁️ **Combined Structure + Content Preview:** See exactly what you'll get *before* you copy.
*   📋 **One-Click Copy:** Grab the perfectly formatted output instantly.
*   ✨ **Crystal Clear File Delimitation:** Uses `=== FILE: filename ===` markers, making it unambiguous for LLMs and humans.
*   🖥️ **Cross-Platform:** Works seamlessly on Windows, macOS, and Linux.
*   🚀 **Built with Modern Tech:** Electron, React, TypeScript, Vite, Tailwind CSS.

## Why is this GREAT for LLM Prompts?

Stop feeding your AI fragmented, context-poor snippets! `ingest-digest` provides LLMs with exactly what they need:

*   **Hierarchical Context:** The ASCII tree tells the LLM *where* files are located relative to each other.
*   **Unambiguous Content:** Clear delimiters prevent the LLM from mixing up code from different files.
*   **Efficiency:** Provide comprehensive context in a single, well-formatted block within your prompt.
*   **Accuracy:** Reduce errors caused by manual copying or forgetting relevant files.


## Other Use Cases

*   **Documentation:** Quickly grab code examples with their file paths.
*   **Code Reviews:** Share relevant sections of code with context.
*   **Debugging:** Consolidate configuration files and log snippets.
*   **Technical Blogging:** Easily embed structured code examples.

## Getting Started

### Prerequisites

*   Node.js (Recommended: LTS version)
*   npm (comes with Node.js)

### Installation & Running

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/<your-username>/ingest-digest.git
    cd ingest-digest
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run in development mode:**
    ```bash
    npm run dev
    ```

## Building the Application

To build distributable packages for your OS:

```bash
# For Windows (.exe installer)
npm run build:win

# For macOS (.dmg - universal binary if possible, check package.json scripts)
# You might need separate builds depending on your setup:
npm run build:mac:x64
npm run build:mac:arm64

# For Linux (.AppImage, .deb, .snap)
npm run build:linux
```

Built applications will be located in the `dist` folder.

## Technology Stack

*   **Framework:** Electron
*   **UI:** React, TypeScript
*   **Build Tool:** Vite (`electron-vite`)
*   **Styling:** Tailwind CSS
*   **Packaging:** Electron Builder

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

