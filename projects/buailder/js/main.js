/* Bootstrap 5 JS included */

let imageOriginal = new MarvinImage();
let socket = io();

const overlayEl = document.getElementById('overlay');

('use strict');


// Drag and drop - single or multiple image files
// https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/
// https://codepen.io/joezimjs/pen/yPWQbd?editors=1000
(function () {

    'use strict';

    // Four objects of interest: drop zones, input elements, gallery elements, and the files.
    // dataRefs = {files: [image files], input: element ref, gallery: element ref}

    const preventDefaults = event => {
        event.preventDefault();
        event.stopPropagation();
    };

    const highlight = event =>
        event.target.classList.add('highlight');

    const unhighlight = event =>
        event.target.classList.remove('highlight');

    const getInputAndGalleryRefs = element => {
        const zone = element.closest('.upload_dropZone') || false;
        const gallery = zone.querySelector('.upload_gallery') || false;
        const input = zone.querySelector('input[type="file"]') || false;
        return {input: input, gallery: gallery};
    }

    const handleDrop = event => {
        const dataRefs = getInputAndGalleryRefs(event.target);
        dataRefs.files = event.dataTransfer.files;
        handleFiles(dataRefs);
    }

    const eventHandlers = zone => {

        const dataRefs = getInputAndGalleryRefs(zone);
        if (!dataRefs.input) return;

        // Prevent default drag behaviors
        ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(event => {
            zone.addEventListener(event, preventDefaults, false);
            document.body.addEventListener(event, preventDefaults, false);
        });

        // Highlighting drop area when item is dragged over it
        ;['dragenter', 'dragover'].forEach(event => {
            zone.addEventListener(event, highlight, false);
        });
        ;['dragleave', 'drop'].forEach(event => {
            zone.addEventListener(event, unhighlight, false);
        });

        // Handle dropped files
        zone.addEventListener('drop', handleDrop, false);

        // Handle browse selected files
        dataRefs.input.addEventListener('change', event => {
            dataRefs.files = event.target.files;
            handleFiles(dataRefs);
        }, false);

    }

    // Initialise ALL dropzones
    const dropZones = document.querySelectorAll('.upload_dropZone');
    for (const zone of dropZones) {
        eventHandlers(zone);
    }

    // No 'image/gif' or PDF or webp allowed here, but it's up to your use case.
    // Double checks the input "accept" attribute
    const isImageFile = file =>
        ['image/jpeg', 'image/png', 'image/svg+xml'].includes(file.type);

    function previewFiles(dataRefs) {
        if (!dataRefs.gallery) return;
        for (const file of dataRefs.files) {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = function() {
                let img = document.createElement('img');
                img.className = 'upload_img';
                img.setAttribute('alt', file.name);
                img.src = reader.result;
                document.getElementById('image_wrap').appendChild(img);
                document.getElementById('form').style.display = "none";
                imageOriginal.load(reader.result, imageLoaded);
            }
        }
    }
    
    const getGroups = clump => {
        let groups = []
        let prev_index = null
        for (const member of clump) {
            let index = member.Id
            if (765 - member.sum > 50) {
                if (!(prev_index == null || index - prev_index !== 1)) {
                    if (index - prev_index === 1) {
                        groups[groups.length - 1].push(index)
                    }
                } else {
                    let confirmed = []
                    confirmed.push(index)
                    groups.push(confirmed)
                }
                prev_index = index
            }
        }
        return groups
    }

    // Return average of RGB data for all pixels in every given row
    const getRowAveragesRGB = imageDim => {
        const rows = []
        for (let y = 0; y < imageDim.imageHeight; y++) {
            const row_rgb = { r: 0, g: 0, b: 0 }
            for (let x = 0; x < imageDim.imageWidth; x++) {
                row_rgb.r += imageOriginal.getIntComponent0(x, y)
                row_rgb.g += imageOriginal.getIntComponent1(x, y)
                row_rgb.b += imageOriginal.getIntComponent2(x, y)
            }
            row_rgb.r /= imageDim.imageWidth;
            row_rgb.g /= imageDim.imageWidth;
            row_rgb.b /= imageDim.imageWidth;
            let sum = row_rgb.r + row_rgb.g + row_rgb.b
            rows.push({sum, Id: y, r: row_rgb.r, g: row_rgb.g, b: row_rgb.b})
        }
        return rows
    }

    const findHorizLines = x => {
        const imageDim = {imageHeight:imageOriginal.getHeight(), imageWidth:imageOriginal.getWidth()};
        let newHeight = Math.round(500 * (imageDim.imageHeight / imageDim.imageWidth));
        document.getElementById('image_wrap').style.display = "block"
        overlayEl.style.display = "block"
        overlayEl.style.height = newHeight + "px"

        const rows_rgb = getRowAveragesRGB(imageDim)
        let groups = getGroups(rows_rgb)
        console.log(groups)

        for (const group of groups) {
            let columns = [];
            let clump = [];
            let i = 0;
            let startRow = imageDim.imageHeight;
            let endRow = 0;
            for (const ID of group) {
                if (ID < startRow) startRow = ID
                if (ID > endRow) endRow = ID
                let y = ID;
                i++;
                for (let x = 0; x < imageDim.imageWidth; x++) {
                    if (columns[x] == null) {
                        columns[x] = imageOriginal.getIntComponent0(x,y);
                    } else {
                        columns[x] += imageOriginal.getIntComponent0(x,y);
                    }
                    columns[x] += imageOriginal.getIntComponent1(x,y);
                    columns[x] += imageOriginal.getIntComponent2(x,y);
                    if (i === group.length) {
                        columns[x] /= group.length
                        let sum = columns[x];
                        let Id = x;
                        clump.push({sum, Id})
                    }
                }
            }

            let colGroups = getGroups(clump);
            let startCol = imageDim.imageWidth;
            let endCol = 0;
            for (const ID of colGroups) {
                for (const i of ID) {
                    if (i < startCol) startCol = i
                    if (i > endCol) endCol = i
                }
            }

            let line_data = [];
            line_data.startRow = startRow;
            line_data.endRow = endRow;
            line_data.startCol = startCol;
            line_data.endCol = endCol;

            // Draw overlay marker
            addOverlayLine(line_data);
        }
    }

    const imageLoaded = x => {
        findHorizLines(); // Search for (and overlay) horizontal lines
    }

    const addOverlayLine = line_data => {
        console.log("There is a line => from rows (" + line_data.startRow + ", " + line_data.endRow +
                                         "), cols (" + line_data.startCol + ", " + line_data.endCol + ")")
        let newDiv = document.createElement('div');
        newDiv.setAttribute('class', "overlay_line");
        newDiv.style.height = line_data.endRow - line_data.startRow + "px";
        newDiv.style.width = line_data.endCol - line_data.startCol + "px";
        newDiv.style.position = "relative";
        newDiv.style.top = line_data.startRow + "px";
        newDiv.style.left = line_data.startCol + "px";
        overlayEl.appendChild(newDiv);
    }

    const imageUpload = dataRefs => {
        console.log("User has uploaded an image")
        console.log(dataRefs)
        socket.emit('image', dataRefs)
    }

    // Handle both selected and dropped files
    const handleFiles = dataRefs => {

        let files = [...dataRefs.files];

        // Remove unaccepted file types
        files = files.filter(item => {
            if (!isImageFile(item)) {
                console.log('Not an image, ', item.type);
            }
            return isImageFile(item) ? item : null;
        });

        if (!files.length) return;
        dataRefs.files = files;

        previewFiles(dataRefs);
        imageUpload(dataRefs);
    }

})();