import { buildTokens } from './tokens.mjs';
// The build script substitutes the two asset placeholders without a bundler.
const ART = '__ART_DATA_URI__';
const CSS = '__NATIVE_CSS__';
export const inject = ['theme'];
export function apply(ctx) {
  const ID='dsh-theme-nezuko';
  if(!ctx.theme || typeof ctx.theme.overrideTokens!=='function') throw new Error('祢豆子主题需要提供 ctx.theme.overrideTokens 的 DSH Web 版本。');
  ctx.effect(()=>{
    const artBytes=Uint8Array.from(atob(ART.slice(ART.indexOf(',')+1)),c=>c.charCodeAt(0));
    const artURL=URL.createObjectURL(new Blob([artBytes],{type:'image/png'}));
    const storageKey='dsh.nezuko.preferences.v1';
    const defaults={enabled:true,art:35,motion:true,focus:false};
    let prefs={...defaults};
    try{const p=JSON.parse(localStorage.getItem(storageKey));if(p&&typeof p==='object')prefs={enabled:p.enabled!==false,art:Number.isFinite(p.art)?Math.max(0,Math.min(70,p.art)):35,motion:p.motion!==false,focus:p.focus===true};}catch{}
    let release=()=>{};
    const style=document.createElement('style');style.dataset.plugin=ID;style.textContent=CSS;document.head.appendChild(style);
    const launch=document.createElement('button');launch.type='button';launch.className='nz-launcher';launch.textContent='禰';launch.setAttribute('aria-label','祢豆子主题设置');launch.setAttribute('aria-haspopup','dialog');launch.title='祢豆子 · 月下守护';
    const modal=document.createElement('dialog');modal.className='nz-settings';modal.setAttribute('aria-label','祢豆子主题设置');modal.style.setProperty('--nz-dialog-wallpaper',`url("${artURL}")`);
    modal.innerHTML=`<div class="nz-banner"><div>月下守护<small>NEZUKO · MOONLIT GUARDIAN</small></div><button type="button" class="nz-close" aria-label="关闭主题设置">×</button></div><div class="nz-controls"><p class="nz-intro">把温柔留给世界，把创造的勇气留给你。</p><div class="nz-modes"><button type="button" data-nz-mode="dark">☾ 月下</button><button type="button" data-nz-mode="light">☀ 晨樱</button></div><label class="nz-row"><span>启用主题<small>关闭后恢复 DSH 的原有配色</small></span><input type="checkbox" data-nz-setting="enabled"></label><label class="nz-row nz-slider"><span>竹林插画强度</span><output>35%</output><input aria-label="竹林插画强度" type="range" min="0" max="70" step="1" data-nz-setting="art"></label><label class="nz-row"><span>花瓣轻舞<small>自动尊重系统减少动态效果设置</small></span><input type="checkbox" data-nz-setting="motion"></label><label class="nz-row"><span>专注模式<small>保留主题配色，收起插画与花瓣</small></span><input type="checkbox" data-nz-setting="focus"></label><button type="button" class="nz-reset">恢复默认氛围</button><p class="nz-footnote">配色跟随 DSH 的昼夜模式。<br>此面板只调整外观，不读取对话、文件或凭据。</p><div class="nz-status" role="status"></div></div>`;
    const petals=document.createElement('div');petals.className='nz-petals';petals.setAttribute('aria-hidden','true');
    for(let i=0;i<9;i++){const p=document.createElement('i');p.style.cssText=`--nz-left:${34+(i*17)%65}%;--nz-size:${5+(i*3)%5}px;--nz-duration:${21+(i*7)%13}s;--nz-delay:${-i*3}s`;petals.appendChild(p);}
    document.body.append(launch,modal,petals);
    const attributes=['data-nezuko-active','data-nezuko-focus'];
    const priorAttributes=attributes.map(n=>[n,document.body.getAttribute(n)]);
    const variables=['--nz-wallpaper','--nz-art-strength'];
    const priorVariables=variables.map(n=>[n,document.body.style.getPropertyValue(n),document.body.style.getPropertyPriority(n)]);
    function controls(){
      modal.querySelectorAll('[data-nz-setting]').forEach(el=>{const k=el.dataset.nzSetting;if(el.type==='checkbox')el.checked=prefs[k];else el.value=String(prefs[k]);});
      modal.querySelector('output').textContent=`${prefs.art}%`;
      const scheme=ctx.theme.getTheme().active.colorScheme;
      modal.querySelectorAll('[data-nz-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.nzMode===scheme)));
    }
    function paint(){
      const previous=release;release=prefs.enabled?ctx.theme.overrideTokens(ID,buildTokens()):()=>{};previous();
      document.body.toggleAttribute('data-nezuko-active',prefs.enabled);
      document.body.toggleAttribute('data-nezuko-focus',prefs.enabled&&prefs.focus);
      if(prefs.enabled){document.body.style.setProperty('--nz-wallpaper',`url("${artURL}")`);document.body.style.setProperty('--nz-art-strength',`${prefs.art}%`);}
      else variables.forEach(n=>document.body.style.removeProperty(n));
      petals.hidden=!prefs.enabled||!prefs.motion||prefs.focus;
      controls();
    }
    function persist(){try{localStorage.setItem(storageKey,JSON.stringify(prefs));modal.querySelector('.nz-status').textContent='已保存到当前浏览器。';}catch{modal.querySelector('.nz-status').textContent='浏览器无法保存偏好，本次设置仍然有效。';}}
    const open=()=>{controls();modal.showModal();};
    const close=()=>modal.close();
    const click=e=>{const b=e.target.closest('[data-nz-mode]');if(b){ctx.theme.setTheme(b.dataset.nzMode);controls();}};
    const change=e=>{const k=e.target.dataset.nzSetting;if(!k)return;prefs[k]=e.target.type==='checkbox'?e.target.checked:Number(e.target.value);paint();persist();};
    const reset=()=>{prefs={...defaults};paint();persist();};
    const backdrop=e=>{if(e.target===modal){const b=modal.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)modal.close();}};
    launch.addEventListener('click',open);modal.querySelector('.nz-close').addEventListener('click',close);modal.addEventListener('click',click);modal.addEventListener('input',change);modal.addEventListener('click',backdrop);modal.querySelector('.nz-reset').addEventListener('click',reset);
    const offTheme=ctx.on('theme/change',controls);
    paint();
    return ()=>{
      // Restore only resources owned by this plugin. No global preference reset.
      if(typeof offTheme==='function')offTheme();release();modal.close();
      launch.remove();modal.remove();petals.remove();style.remove();
      URL.revokeObjectURL(artURL);
      for(const [n,v] of priorAttributes){if(v===null)document.body.removeAttribute(n);else document.body.setAttribute(n,v);}
      for(const [n,v,p] of priorVariables){if(v)document.body.style.setProperty(n,v,p);else document.body.style.removeProperty(n);}
    };
  },'nezuko: theme, artwork, controls and lifecycle');
}
