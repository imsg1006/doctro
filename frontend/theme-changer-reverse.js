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
    content = content.replace(/bg-zinc-950/g, 'bg-slate-50');
    content = content.replace(/bg-black\/50/g, 'bg-white/50');
    content = content.replace(/bg-black\/60/g, 'bg-white/60');
    content = content.replace(/bg-zinc-900/g, 'bg-white');
    content = content.replace(/bg-zinc-800/g, 'bg-slate-100');
    
    // Borders
    content = content.replace(/border-zinc-800/g, 'border-slate-100'); // wait, previously border-transparent -> border-zinc-800, border-slate-100 -> border-zinc-800. So some will be slate-100 which is fine.
    content = content.replace(/border-zinc-700/g, 'border-slate-200');
    content = content.replace(/border-zinc-600/g, 'border-slate-300');
    
    // Texts
    content = content.replace(/text-zinc-50/g, 'text-slate-900');
    content = content.replace(/text-zinc-100/g, 'text-slate-800');
    content = content.replace(/text-zinc-200/g, 'text-slate-700');
    content = content.replace(/text-zinc-300/g, 'text-slate-600');
    content = content.replace(/text-zinc-400/g, 'text-slate-500');
    content = content.replace(/text-zinc-500/g, 'text-slate-400');
    content = content.replace(/text-zinc-600/g, 'text-slate-300');
    
    // Some manual fixes from previous Landing/App
    content = content.replace(/bg-gradient-to-tr from-primary-900 to-black/g, 'bg-gradient-to-tr from-primary-100 to-primary-950');
    
    fs.writeFileSync(file, content);
});
console.log('Reversed themes across ' + files.length + ' files.');
