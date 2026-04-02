const fs = require('fs');
const path = require('path');

const directory = '.';
const files = fs.readdirSync(directory);

const htmlFiles = files.filter(f => f.endsWith('.html'));

let updatedCount = 0;

for (const file of htmlFiles) {
    const filePath = path.join(directory, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if Travel is already in the menu
    if (content.includes('<a href="travel.html">Travel</a>')) {
        continue;
    }
    
    // The typical menu structure we've seen:
    // <tr><td class="menu"><a href="projects.html">Projects</a></td></tr>
    // <tr><td class="menu"><a href="people.html">People</a></td></tr>
    
    // We will append the Travel link right after People
    const targetString = '<tr><td class="menu"><a href="people.html">People</a></td></tr>';
    const replacementString = targetString + '\n                    <tr><td class="menu"><a href="travel.html">Travel</a></td></tr>';
    
    if (content.includes(targetString)) {
        content = content.replace(targetString, replacementString);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated menu in ${file}`);
        updatedCount++;
    } else {
        console.log(`Target menu item not found in ${file}`);
    }
}

console.log(`Successfully updated navigation menu in ${updatedCount} files.`);
