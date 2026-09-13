// DSH token names verified against the official ui-theme sources, 2026-09-12.
// Every token supplies both appearance modes. No dependency or network access.
export const palette = {
  dark:{base:'#171218',side:'#1b151d',surface:'#241c27',raised:'#302531',overlay:'#352a37',text:'#f7eaf0',secondary:'#c7b4c2',tertiary:'#b49fae',caption:'#a08a9b',accent:'#f2a8bc',green:'#a7c7ad',gold:'#e0bb89',error:'#f49eab'},
  light:{base:'#ddd0cd',side:'#cebdc0',surface:'#e7dcd7',raised:'#cdbabe',overlay:'#e2d4d0',text:'#33262d',secondary:'#604b54',tertiary:'#694d5a',caption:'#684e58',accent:'#813b55',green:'#405f4d',gold:'#704e29',error:'#963047'}
};
export function buildTokens(){
  const t={};
  const role=(names,k)=>names.split(' ').forEach(n=>{t[n]={dark:palette.dark[k],light:palette.light[k]};});
  const pair=(names,dark,light)=>names.split(' ').forEach(n=>{t[n]={dark,light};});
  role('--dsw-alias-bg-base','base');
  role('--dsw-alias-bg-layer-1 --dsw-alias-button-elevated-fill --dsw-alias-button-floating-fill --dsw-specific-input-major --dsw-specific-login-input','surface');
  role('--dsw-alias-bg-layer-2 --dsw-alias-bg-module-platform --dsw-alias-button-floating-hover','raised');
  role('--dsw-alias-bg-layer-3 --dsw-alias-bg-overlay --dsw-specific-menu --dsw-specific-selector --dsw-alias-toast-bg --dsw-alias-tooltip-bg','overlay');
  role('--dsw-alias-label-primary --dsw-alias-label-primary-bluish --dsw-alias-brand-text','text');
  role('--dsw-alias-label-secondary','secondary');role('--dsw-alias-label-tertiary','tertiary');role('--dsw-alias-label-caption','caption');
  role('--dsw-alias-brand-primary --dsw-alias-button-info-fill --dsw-alias-link --dsw-alias-state-business-primary --dsw-static-deepseek-500 --dsw-static-deepseek-450','accent');
  role('--dsw-specific-sidebar-fill','side');
  role('--dsw-alias-state-success-primary','green');role('--dsw-alias-state-warn-primary --dsw-alias-state-warn-label','gold');role('--dsw-alias-state-error-primary','error');
  pair('--dsw-alias-border-l1','#372b38','#c4aeb5');pair('--dsw-alias-border-l2 --dsw-alias-border-l2-darkmode-thin','#483444','#b99ba8');
  pair('--dsw-alias-border-l3','#745168','#a27589');pair('--dsw-alias-border-l4','#b37d98','#885c73');
  pair('--dsw-alias-button-info-hover','#f7c1d0','#7b354e');
  pair('--dsw-alias-label-primary-foreground --dsw-alias-label-primary-inverted --dsw-alias-brand-primary-invert','#25151f','#f4e7e3');
  // Primary fill stays paired with its native inverted label.
  role('--dsw-alias-button-primary-fill','accent');pair('--dsw-alias-button-primary-hover','#f7c1d0','#7b354e');
  pair('--dsw-alias-label-primary-dimmed --dsw-alias-label-dimmed','#806b7b','#876977');
  pair('--dsw-alias-state-business-tertiary --dsw-alias-interactive-bg-hover-accent --dsw-specific-sidebar-nav-item-active-accent','#3d2837','#ceb1bf');
  pair('--dsw-alias-interactive-bg-hover --dsw-alias-interactive-bg-hover-solid --dsw-specific-sidebar-nav-item-hover','#2e2230','#c9b5bc');
  pair('--dsw-alias-interactive-bg-active --dsw-specific-sidebar-nav-item-active','#49313f','#bda1af');
  pair('--dsw-specific-bubble','#372532','#d3bfc5');pair('--dsw-specific-bubble-highlight','#4d3142','#c4a3b5');
  pair('--dsw-alias-markdown-inline-code','#372937','#cfbac4');
  pair('--dsw-alias-markdown-code-block','#1d1721','#e0d2d1');pair('--dsw-alias-markdown-code-block-banner','#2a202d','#cebbc2');
  pair('--dsw-alias-scrollbar-bg-l1 --dsw-alias-scrollbar-bg-l2','#674155','#a5788e');pair('--dsw-alias-scrollbar-hover-l1 --dsw-alias-scrollbar-hover-l2','#c785a4','#85506a');
  pair('--dsw-static-deepseek-200','#936579','#b28a9d');
  const ui='"Moonlight Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif';
  const mono='"Cascadia Code", "SF Mono", "JetBrains Mono", Consolas, "PingFang SC", "Microsoft YaHei", monospace';
  pair('--dsw-font-family',ui,ui);pair('--ds-font-family-code',mono,mono);
  return t;
}
