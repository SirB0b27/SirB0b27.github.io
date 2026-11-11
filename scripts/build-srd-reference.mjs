import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const root = path.resolve('dnd/reference/srd');
const output = path.resolve('dnd/reference/srd_rules.json.gz');
const include = new Set(['rules','combat','spellcasting','character','equipment','adventuring','gamemaster_rules']);

function files(directory) {
  return fs.readdirSync(directory,{withFileTypes:true}).flatMap(entry => {
    const target=path.join(directory,entry.name);
    return entry.isDirectory()?files(target):[target];
  });
}

const records=files(root).filter(file=>file.endsWith('.md')).map(file=>{
  const relative=path.relative(root,file).replaceAll(path.sep,'/'),category=relative.split('/')[0];
  if(!include.has(category))return null;
  const raw=fs.readFileSync(file,'utf8'),heading=raw.match(/^#\s+(.+)$/m)?.[1]?.trim(),description=raw.match(/^description:\s*(.+)$/m)?.[1]?.trim();
  const name=heading||path.basename(file,'.md').replaceAll('_',' ').replace(/\b\w/g,letter=>letter.toUpperCase());
  const plain=raw.replace(/^description:.*$/m,'').replace(/^#+\s*/gm,'').replace(/\[([^\]]+)\]\([^)]+\)/g,'$1').replace(/[|*_`>#-]/g,' ').replace(/\s+/g,' ').trim();
  return {name,category,source:'5thSRD / SRD 5.1',description:description||plain.slice(0,360),content:plain.slice(0,1200),local_path:`srd/${relative}`,url:`https://5thsrd.org/${relative.replace(/index\.md$/,'').replace(/\.md$/,'')}`};
}).filter(Boolean).sort((a,b)=>a.category.localeCompare(b.category)||a.name.localeCompare(b.name));

fs.writeFileSync(output,zlib.gzipSync(JSON.stringify(records),{level:9}));
console.log(`Wrote ${records.length} searchable SRD records to ${output}`);
