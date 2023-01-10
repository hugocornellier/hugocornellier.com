for (let p of document.getElementsByClassName('project-icon')) {
    p.addEventListener("click", function() {
        openInNewTab(p.getAttribute('data-url'));
    });
}

function openInNewTab(url) {
    window.open(url, '_blank').focus();
}