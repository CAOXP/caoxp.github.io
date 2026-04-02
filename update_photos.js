const fs = require('fs');

const travelHtmlPath = './travel.html';
let html = fs.readFileSync(travelHtmlPath, 'utf8');

// Find all files in images/travel
const imagesDir = './images/travel';
const files = fs.readdirSync(imagesDir);

// Match the photoData block
const regex = /const photoData = \{([\s\S]*?)\};/;
const match = html.match(regex);
if (match) {
    const photoDataStr = match[1];
    
    const lines = photoDataStr.split('\n');
    let newLines = [];
    
    for (let line of lines) {
        if (!line.trim()) {
            newLines.push(line);
            continue;
        }
        
        const imageMatch = line.match(/image:\s*'images\/travel\/(.*?)\.jpg'/);
        if (imageMatch) {
            const baseName = imageMatch[1]; // e.g. yemen, thailand
            
            const fileRegex = new RegExp('^' + baseName + '(\\d*)?\\.jpg$');
            
            const matchingFiles = files.filter(f => fileRegex.test(f)).sort((a, b) => {
                if (a === baseName + '.jpg') return -1;
                if (b === baseName + '.jpg') return 1;
                return a.localeCompare(b);
            });
            
            const imagesArrayStr = '[' + matchingFiles.map(f => `'images/travel/${f}'`).join(', ') + ']';
            
            let newLine = line.replace(/image:\s*'[^']+'/, `images: ${imagesArrayStr}`);
            newLines.push(newLine);
        } else {
            newLines.push(line);
        }
    }
    
    const newPhotoDataStr = 'const photoData = {' + newLines.join('\n') + '};';
    html = html.replace(regex, newPhotoDataStr);
    
    // Change tooltip formatter
    html = html.replace(/const photo = photoData\[params\.data\.name\];\s*if\s*\(photo\)\s*\{[\s\S]*?return\s*`[\s\S]*?`;\s*\}/, 
        `const photo = photoData[params.data.name];
                            if (photo && photo.images && photo.images.length > 0) {
                                const imagesHtml = photo.images.map(img => 
                                    '<img src="' + img + '" style="max-width: 100%; max-height: 150px; border-radius: 4px; object-fit: cover; margin-bottom: 5px; display: block;">'
                                ).join('');
                                
                                return \`
                                    <div style="text-align: center; max-width: 200px; max-height: 350px; overflow-y: auto;">
                                        <div style="font-weight: bold; margin-bottom: 8px;">\${params.data.name}</div>
                                        \${imagesHtml}
                                    </div>
                                \`;
                            }`);
    
    // Update popup HTML
    html = html.replace(/<img src="" alt="" id="popupImage">/, 
        '<div id="popupImageContainer" style="display: flex; flex-direction: column; gap: 15px; align-items: center; max-height: 70vh; overflow-y: auto; padding: 10px; width: 100%;"></div>');
    
    html = html.replace(/const popupImage = document\.getElementById\('popupImage'\);/, 
        "const popupImageContainer = document.getElementById('popupImageContainer');");
        
    // Update the openPhotoPopup function
    html = html.replace(/function openPhotoPopup\(photoKey\)\s*\{[\s\S]*?photoPopup\.classList\.add\('active'\);\s*\}/,
        `function openPhotoPopup(photoKey) {
            const photo = photoData[photoKey];
            if (photo && photo.images && photo.images.length > 0) {
                popupImageContainer.innerHTML = photo.images.map(img => 
                    '<img src="' + img + '" alt="' + photoKey + '" style="max-width: 100%; max-height: 70vh; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); object-fit: contain;">'
                ).join('');
                
                popupCaption.textContent = photo.caption;
                photoPopup.classList.add('active');
            }`);
        
    fs.writeFileSync(travelHtmlPath, html);
    console.log('Successfully updated travel.html for multiple photos!');
} else {
    console.error('Could not match photoData');
}
