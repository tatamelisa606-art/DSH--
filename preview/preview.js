(() => {
  'use strict';
  // Blob URLs keep CSS custom properties below browser size limits while the
  // original bitmap stays embedded once in this offline HTML file.
  const artBase64='__PREVIEW_ART_BASE64__';
  const artBytes=Uint8Array.from(atob(artBase64),c=>c.charCodeAt(0));
  const artUrl=URL.createObjectURL(new Blob([artBytes],{type:'image/png'}));
  document.documentElement.style.setProperty('--art',`url("${artUrl}")`);
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const paths = {
    message:'<path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z"/>',
    code:'<path d="m8 6-6 6 6 6m8-12 6 6-6 6M14 4l-4 16"/>',
    book:'<path d="M12 5c-3-2-7-2-10-1v15c4-1 7-1 10 1m0-15c3-2 7-2 10-1v15c-4-1-7-1-10 1V5Z"/>',
    sliders:'<path d="M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3M1 10h6m2 2h6m2 4h6"/>',
    panel:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',
    search:'<circle cx="10.5" cy="10.5" r="7"/><path d="m16 16 5 5"/>',
    'chevron-down':'<path d="m6 9 6 6 6-6"/>',
    folder:'<path d="M3 7V5a2 2 0 0 1 2-2h4l2 3h8a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    sparkles:'<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3ZM20 2v4m-2-2h4"/>',
    'arrow-up-right':'<path d="M7 17 17 7M7 7h10v10"/>',
    'arrow-up':'<path d="m6 12 6-6 6 6M12 6v13"/>',
    palette:'<path d="M12 3a9 9 0 1 0 0 18h1a2 2 0 0 0 1-3.7 1.3 1.3 0 0 1 .7-2.3H17a4 4 0 0 0 4-4 9 9 0 0 0-9-8Z"/><circle cx="7.5" cy="10" r=".5"/><circle cx="10" cy="6.7" r=".5"/><circle cx="14" cy="6.7" r=".5"/><circle cx="17" cy="10" r=".5"/>',
    focus:'<path d="M8 3H4a1 1 0 0 0-1 1v4m13-5h4a1 1 0 0 1 1 1v4M3 16v4a1 1 0 0 0 1 1h4m8 0h4a1 1 0 0 0 1-1v-4"/><circle cx="12" cy="12" r="3"/>',
    sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4m0-14.2-1.4 1.4M6.3 17.7l-1.4 1.4"/>',
    moon:'<path d="M20.9 13a9 9 0 0 1-9.9-9.9A9 9 0 1 0 20.9 13Z"/>',
    x:'<path d="m6 6 12 12M6 18 18 6"/>',
    check:'<path d="m5 12 4 4L19 6"/>',
    copy:'<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
    rotate:'<path d="M3 10a9 9 0 1 1 1.7 7M3 4v6h6"/>'
  };
  const svg = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.sparkles}</svg>`;
  function icons(root = document) { $$('[data-icon]', root).forEach(el => { el.innerHTML = svg(el.dataset.icon); }); }
  icons();
  const key = 'nezuko.preview.settings.v1';
  const defaults = { mode:'dark', art:85, motion:true, focus:false };
  let state = {...defaults};
  try { const p = JSON.parse(localStorage.getItem(key)); if(p && typeof p==='object') state = {mode:p.mode==='light'?'light':'dark',art:Number.isFinite(p.art)?Math.min(100,Math.max(15,p.art)):85,motion:p.motion!==false,focus:p.focus===true}; } catch {}
  let toastTimer, view = 'home', returnFocus = null, drawerInert = false;
  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)');
  function save() { try { localStorage.setItem(key,JSON.stringify(state)); } catch { toast('当前浏览器不能保存偏好，本次调整仍然有效。'); } }
  function sync() {
    document.documentElement.dataset.mode = state.mode;
    document.documentElement.style.setProperty('--art-strength',String(state.art/100));
    document.body.classList.toggle('focus-mode',state.focus);
    document.body.classList.toggle('no-motion',!state.motion);
    $('[name="theme-color"]').content = state.mode==='dark'?'#171218':'#ddd0cd';
    $$('[data-mode-choice]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.modeChoice===state.mode)));
    $$('[data-action="focus"]').forEach(b=>b.setAttribute(b.getAttribute('role')==='switch'?'aria-checked':'aria-pressed',String(state.focus)));
    $('[data-action="motion"]').setAttribute('aria-checked',String(state.motion));
    $('#art-strength').value = state.art; $('#art-output').textContent = `${state.art}%`;
    $('#status-theme').textContent = state.focus?'专注模式':state.mode==='dark'?'月下模式':'晨樱模式';
    const modeButton = $('[data-action="mode"]'); modeButton.innerHTML = `<i data-icon="${state.mode==='dark'?'sun':'moon'}"></i>`; icons(modeButton);
    modeButton.setAttribute('aria-label',state.mode==='dark'?'切换到晨樱模式':'切换到月下模式');
  }
  function toast(message) { clearTimeout(toastTimer);$('#toast').textContent=message;$('#toast').hidden=false;toastTimer=setTimeout(()=>{$('#toast').hidden=true;},3200); }
  function showView(next) {
    view=next;
    $$('.view').forEach(el=>{el.hidden=el.id!==`view-${next}`;});
    $$('.rail-button[data-view]').forEach(b=>b.classList.toggle('selected',b.dataset.view===(next==='chat'?'home':next)));
    $('#breadcrumb-current').textContent = {home:'新对话',chat:$('#chat-title').textContent,code:'代码样式',guide:'主题手册'}[next];
    $('#sidebar').classList.remove('sidebar-open');
    $$('.session-row').forEach(b=>b.classList.toggle('active',next==='home'?b.dataset.action==='home':next==='chat'?b.dataset.action==='sample':b.dataset.view===next));
    const active=$(`#view-${next}`);active.scrollTop=0;
  }
  function openSettings() {
    if(!$('#settings-drawer').hidden)return;
    returnFocus=document.activeElement;$('#settings-drawer').hidden=false;$('#drawer-scrim').hidden=false;
    drawerInert=$('.app').inert;$('.app').inert=true;
    $('[data-action="close-settings"]').focus();
  }
  function closeSettings() {
    $('#settings-drawer').hidden=true;$('#drawer-scrim').hidden=true;$('.app').inert=drawerInert;returnFocus?.focus();
  }
  function newChat(){showView('home');$('#prompt').value='';$('#attachment-note').hidden=true;$('#file-input').value='';$('#prompt').focus();}
  function addUser(text){const el=document.createElement('div');el.className='message user';const bubble=document.createElement('div');bubble.className='user-bubble';bubble.textContent=text;el.appendChild(bubble);$('#messages').appendChild(el);}
  function assistant(html){const el=document.createElement('div');el.className='message assistant';el.innerHTML=`<div class="assistant-name"><span class="assistant-avatar">禰</span>NEZUKO <span class="local-label">· 对话样式演示</span></div><div class="assistant-body">${html}</div>`;$('#messages').appendChild(el);return el;}
  function sample(){
    $('#chat-title').textContent='为灵感搭建一个家';$('#messages').replaceChildren();
    addUser('我想做一个安静、有温度的个人作品集。你会从哪里开始？');
    assistant('<details class="thought"><summary>设计思路 · 展开看看</summary><p>先建立清晰的内容层级，再让少量色彩与细节承担情绪表达。作品本身始终是主角。</p></details><h3>从一束柔和的光开始。</h3><p>让首页只讲一件事：你是谁，你正在创造什么。用留白承托作品，用竹青点亮可点击的入口。</p><p>樱粉可以落在标题、选中状态和小小的惊喜里。正文使用月白，代码放在安静的深棕表面上。</p><p><code class="inline-code">const idea = "something beautiful";</code></p><p>一个值得慢慢打磨的作品，从清晰的第一步开始。</p><span class="state-chip success">✓ 示例内容 · 未调用模型</span>');
    showView('chat');
  }
  function submit(e){
    e.preventDefault();const input=e.target.id==='home-form'?$('#prompt'):$('#chat-prompt');const text=input.value.trim();
    if(!text){toast('先写下一个小小的灵感吧。');input.focus();return;}
    if(view==='home'){$('#messages').replaceChildren();$('#chat-title').textContent=text.length>20?`${text.slice(0,20)}…`:text;}
    addUser(text);input.value='';showView('chat');
    assistant('<p>你的灵感已经出现在对话里。</p><p>这里是<strong>本地主题交互预览</strong>，这条消息没有发送给任何模型。安装主题到 DSH 后，请在原有对话框中使用你已配置的模型。</p><p>现在可以切换「月下 / 晨樱」，看看消息气泡、文字层级与输入区如何一起变化。</p>');
    $('#chat-prompt').focus();$('#view-chat').scrollTop=$('#view-chat').scrollHeight;
  }
  const codeText="// 把每一个微小的灵感，照亮。\ninterface Moonlight {\n  guardian: string;\n  warmth: number;\n}\n\nconst create = (idea: string): Moonlight => ({\n  guardian: 'Nezuko',\n  warmth: 100,\n});\n\ncreate('Something beautiful starts here.');";
  async function copyCode(){try{await navigator.clipboard.writeText(codeText);toast('代码已复制。');}catch{const t=document.createElement('textarea');t.value=codeText;t.style.position='fixed';t.style.opacity='0';document.body.appendChild(t);t.select();let ok=false;try{ok=document.execCommand('copy');}catch{}t.remove();toast(ok?'代码已复制。':'浏览器不允许复制，请选中代码手动复制。');}}
  let commandIndex=0, filtered=[];
  const commands=[
    {label:'开启新对话',icon:'plus',hint:'Ctrl / ⌘ + Shift + N',run:newChat},
    {label:'为灵感搭建一个家',icon:'message',hint:'示例会话',run:sample},
    {label:'代码样式',icon:'code',hint:'语法高亮',run:()=>showView('code')},
    {label:'主题手册',icon:'book',hint:'设计与使用',run:()=>showView('guide')},
    {label:'外观与氛围',icon:'sliders',hint:'主题设置',run:openSettings},
    {label:'切换月下 / 晨樱',icon:'moon',hint:'昼夜模式',run:()=>{state.mode=state.mode==='dark'?'light':'dark';sync();save();}},
    {label:'切换专注模式',icon:'focus',hint:'安静创作',run:()=>{state.focus=!state.focus;sync();save();}}
  ];
  function renderCommands(){const q=$('#command-input').value.trim().toLowerCase();filtered=commands.filter(c=>(c.label+c.hint).toLowerCase().includes(q));commandIndex=Math.min(commandIndex,Math.max(0,filtered.length-1));const root=$('#command-results');root.replaceChildren();if(!filtered.length){root.innerHTML='<div class="command-empty">没有找到匹配的会话或操作。</div>';return;}filtered.forEach((c,i)=>{const b=document.createElement('button');b.className=`command-item${i===commandIndex?' selected':''}`;b.innerHTML=`<i data-icon="${c.icon}"></i><span>${c.label}</span><small>${c.hint}</small>`;b.addEventListener('click',()=>{$('#command-dialog').close();c.run();});root.appendChild(b);});icons(root);}
  function openCommands(){if(!$('#settings-drawer').hidden)closeSettings();$('#command-input').value='';commandIndex=0;renderCommands();$('#command-dialog').showModal();$('#command-input').focus();}
  const actions={
    home:()=>showView('home'),new:newChat,sample,settings:openSettings,'close-settings':closeSettings,search:openCommands,'close-command':()=>$('#command-dialog').close(),
    mode:()=>{state.mode=state.mode==='dark'?'light':'dark';sync();save();},
    focus:()=>{state.focus=!state.focus;sync();save();},
    motion:()=>{state.motion=!state.motion;sync();save();if(state.motion&&prefersReduced.matches)toast('系统已开启减少动态效果，花瓣保持静止。');},
    reset:()=>{state={...defaults};sync();save();toast('已恢复默认月色。');},
    sidebar:()=>{if(innerWidth<=1050){$('#sidebar').classList.toggle('sidebar-open');}else{document.body.classList.toggle('sidebar-collapsed');}},
    workspace:()=>toast('当前展示 D:\\profile 的界面样式；本预览无法访问你电脑上的文件。'),
    about:()=>{showView('guide');},
    model:()=>toast('这是主题预览。模型选择与连接请在 DSH 中操作。'),
    thinking:()=>{const b=$('[data-action="thinking"]');b.setAttribute('aria-pressed',String(b.getAttribute('aria-pressed')!=='true'));toast('已切换深度思考的演示状态。');},
    attach:()=>$('#file-input').click(),
    'copy-code':copyCode
  };
  document.addEventListener('click',e=>{
    const button=e.target.closest('[data-action],[data-view],[data-mode-choice],[data-prompt]');if(!button)return;
    if(button.tagName==='A')e.preventDefault();
    if(button.dataset.action)actions[button.dataset.action]?.();
    else if(button.dataset.view)showView(button.dataset.view);
    else if(button.dataset.modeChoice){state.mode=button.dataset.modeChoice;sync();save();}
    else if(button.dataset.prompt){$('#prompt').value=button.dataset.prompt;$('#prompt').focus();}
  });
  $('#drawer-scrim').addEventListener('click',closeSettings);
  $('#art-strength').addEventListener('input',e=>{state.art=Number(e.target.value);sync();save();});
  $('#home-form').addEventListener('submit',submit);$('#chat-form').addEventListener('submit',submit);
  $$('.composer textarea').forEach(el=>el.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();el.form.requestSubmit();}}));
  $('#file-input').addEventListener('change',e=>{const f=e.target.files[0];if(f){$('#attachment-note').textContent=`${f.name} · ${(f.size/1024).toFixed(1)} KB · 仅展示文件名，未读取或上传`;$('#attachment-note').hidden=false;}});
  $('#command-input').addEventListener('input',()=>{commandIndex=0;renderCommands();});
  $('#command-dialog').addEventListener('keydown',e=>{if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();commandIndex=(commandIndex+(e.key==='ArrowDown'?1:-1)+filtered.length)%Math.max(1,filtered.length);renderCommands();}else if(e.key==='Enter'&&e.target.id==='command-input'&&filtered[commandIndex]){e.preventDefault();$('#command-dialog').close();filtered[commandIndex].run();}});
  document.addEventListener('keydown',e=>{
    if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();if($('#command-dialog').open)$('#command-dialog').close();else openCommands();}
    if((e.metaKey||e.ctrlKey)&&e.shiftKey&&e.key.toLowerCase()==='n'){e.preventDefault();if(!$('#settings-drawer').hidden)closeSettings();if($('#command-dialog').open)$('#command-dialog').close();newChat();}
    if(e.key==='Escape'){if(!$('#settings-drawer').hidden)closeSettings();$('#sidebar').classList.remove('sidebar-open');}
    if(e.key==='Tab'&&!$('#settings-drawer').hidden){const f=$$('button,input', $('#settings-drawer')).filter(x=>!x.disabled);if(e.shiftKey&&document.activeElement===f[0]){e.preventDefault();f.at(-1).focus();}else if(!e.shiftKey&&document.activeElement===f.at(-1)){e.preventDefault();f[0].focus();}}
  });
  for(let i=0;i<12;i++){const p=document.createElement('span');p.className='petal';p.style.cssText=`--left:${32+(i*17)%72}%;--size:${5+(i*3)%7}px;--duration:${15+(i*5)%13}s;--delay:${-i*2.3}s`;$('#petals').appendChild(p);}
  if(!/Mac|iPhone|iPad/.test(navigator.platform)){$$('.new-chat kbd').forEach(k=>k.textContent='Ctrl ⇧ N');$('.search-button kbd').textContent='Ctrl K';}
  sync();
})();
