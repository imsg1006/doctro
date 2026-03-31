import fs from 'fs';
import path from 'path';

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        let fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(fullPath));
        } else if (fullPath.endsWith('.jsx')) { 
            results.push(fullPath);
        }
    });
    return results;
}

const files = walk('./src'); 

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Background replacements
    content = content.replace(/bg-slate-50/g, 'bg-zinc-950');
    content = content.replace(/bg-white\/50/g, 'bg-black/50');
    content = content.replace(/bg-white\/60/g, 'bg-black/60');
    content = content.replace(/bg-white/g, 'bg-zinc-900');
    content = content.replace(/bg-slate-100/g, 'bg-zinc-800');
    
    // Borders
    content = content.replace(/border-slate-100/g, 'border-zinc-800');
    content = content.replace(/border-slate-200/g, 'border-zinc-700');
    content = content.replace(/border-slate-300/g, 'border-zinc-600');
    
    // Texts
    content = content.replace(/text-slate-900/g, 'text-zinc-50');
    content = content.replace(/text-slate-800/g, 'text-zinc-100');
    content = content.replace(/text-slate-700/g, 'text-zinc-200');
    content = content.replace(/text-slate-600/g, 'text-zinc-300');
    content = content.replace(/text-slate-500/g, 'text-zinc-400');
    content = content.replace(/text-slate-400/g, 'text-zinc-500');
    content = content.replace(/text-slate-300/g, 'text-zinc-600');
    
    // Other specifics (indigo, blue, emerald -> primary or distinct)
    content = content.replace(/indigo-600/g, 'primary-500');
    content = content.replace(/indigo-500/g, 'primary-400');
    content = content.replace(/indigo-100/g, 'primary-950');
    content = content.replace(/indigo-50/g, 'primary-950');
    content = content.replace(/text-indigo-700/g, 'text-primary-400');
    content = content.replace(/blue-300/g, 'primary-600');
    content = content.replace(/blue-100/g, 'primary-900');
    content = content.replace(/blue-600/g, 'primary-500');
    content = content.replace(/emerald-100/g, 'primary-900');
    content = content.replace(/emerald-500/g, 'primary-500');
    content = content.replace(/emerald-600/g, 'primary-500');
    content = content.replace(/emerald-50/g, 'primary-950');
    content = content.replace(/emerald-700/g, 'primary-400');
    
    fs.writeFileSync(file, content);
});
console.log('Replaced themes across ' + files.length + ' files.');
