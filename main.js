const fs = require('fs');
const AdmZip = require('adm-zip');
const toml = require('toml');

let re = [];
let ls = fs.readdirSync("mods/");
ls = ls.filter((a) => a.endsWith(".jar"));

ls.forEach((v) => {
      try {
          let zip = new AdmZip("mods/" + v);
          try {
              const modsTomlData = zip.getEntry("META-INF/mods.toml").getData().toString();
              const modsToml = toml.parse(modsTomlData).mods;
              modsToml.forEach((mod) => {
                  re.push({ modid: mod.modId, modfile: v });
              });
          } catch (e) {
              const fabricModJsonData = zip.getEntry("fabric.mod.json").getData().toString();
              const fabricModJson = JSON.parse(fabricModJsonData);
              re.push({ modid: fabricModJson.id, modfile: v });
          }
      } catch (e) {
          console.log(e);
      }
});

for (let i of re) {
    //DeMoon后端服务  StarNet.X所有
      fetch(`https://demoon.starnetx.top/${i.modid}`).then(async (r) => {
          try {
              let body = await r.json();
              if (body.client === 'true') {
                  if (i.modfile) {
                      fs.renameSync('mods/' + i.modfile, 'clientmod/' + i.modfile);
                  } else {
                      throw new Error(`modfile is undefined for mod id ${i.modid}`);
                  }
              }
          } catch (error) {
              console.error(`Error fetching mod info for ${i.modid}: ${error}`);
          }
      }).catch((error) => {
          console.error(`Error fetching mod info for ${i.modid}: ${error}`);
      });
}
