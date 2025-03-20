// Function to load HTML components
async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
    } catch (error) {
        console.error('Error loading component:', error);
    }
}

// Load header when document is ready
document.addEventListener('DOMContentLoaded', function() {
    loadComponent('header-component', '/components/header.html');
});
