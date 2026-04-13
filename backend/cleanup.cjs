const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            replaceInDir(fullPath);
        } else if (fullPath.endsWith('.js') && !fullPath.includes('node_modules')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let updated = false;
            
            // Replaces instances like ' || req.user._id'
            if (content.includes(' || req.user._id')) {
                content = content.replace(/ \|\| req\.user\._id/g, '');
                updated = true;
            }
            if (content.includes('|| req.user._id')) {
                content = content.replace(/\|\| req\.user\._id/g, '');
                updated = true;
            }

            if (updated) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

replaceInDir(path.join(__dirname, 'routes'));
replaceInDir(path.join(__dirname, 'controllers'));
console.log('Done!');
