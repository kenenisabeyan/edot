const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function traverseAndReplace(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            traverseAndReplace(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            if (content.includes('src="/edot-logo.png"')) {
                // Determine relative path based on file depth
                // Everything is either in src/components or src/pages, so depth to assets is ../assets
                // For deeper files, it would be ../../assets. Let's just calculate path to src/assets
                const relativeToAssets = path.relative(path.dirname(fullPath), path.join(__dirname, 'src', 'assets', 'edot-logo.jpg')).replace(/\\/g, '/');
                
                // Add import if not exists
                if (!content.includes('import edotLogo')) {
                    // Find last import
                    const importLines = content.match(/^import .*?;\n/gm);
                    if (importLines) {
                        const lastImport = importLines[importLines.length - 1];
                        content = content.replace(lastImport, `${lastImport}import edotLogo from '${relativeToAssets.startsWith('.') ? relativeToAssets : './' + relativeToAssets}';\n`);
                    } else {
                        content = `import edotLogo from '${relativeToAssets.startsWith('.') ? relativeToAssets : './' + relativeToAssets}';\n` + content;
                    }
                }

                // Replace image src
                content = content.replace(/src="\/edot-logo\.png"/g, 'src={edotLogo}');
                modified = true;
            }

            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

traverseAndReplace(srcDir);
console.log('Done!');
