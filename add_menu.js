const fs = require('fs');
const path = require('path');

const directory = '.';
const files = fs.readdirSync(directory);

const htmlFiles = files.filter(f => f.endsWith('.html'));

let updatedCount = 0;
const peopleRow = '<tr><td class="menu"><a href="people.html">People</a></td></tr>';
const perspectivesRow = '<tr><td class="menu"><a href="perspective.html">Perspectives</a></td></tr>';
for (const file of htmlFiles) {
    const filePath = path.join(directory, file);
    let content = fs.readFileSync(filePath, 'utf8');

    const originalContent = content;
    content = content.replace(/href="blog\.html/g, 'href="perspective.html');

    if (content.includes(peopleRow) && !content.includes(perspectivesRow)) {
        const replacementString = `${peopleRow}\n                    ${perspectivesRow}`;
        content = content.replace(peopleRow, replacementString);
    }

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated menu in ${file}`);
        updatedCount++;
    }
}

console.log(`Successfully updated perspective links in ${updatedCount} files.`);
