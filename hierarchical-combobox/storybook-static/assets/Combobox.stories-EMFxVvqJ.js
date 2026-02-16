import{j as r}from"./jsx-runtime-u17CrQMm.js";import{r as h}from"./index-Bpooh2ix.js";import"./_commonjsHelpers-CqkleIqs.js";function te(s){const n=[],t=[];for(let e=s.length-1;e>=0;e--){const o=s[e];o&&t.push([o,0])}for(;t.length>0;){const e=t.pop();if(!e)break;const[o,i]=e;if(n.push({node:o,depth:i}),o.isOpen&&o.children.length>0)for(let a=o.children.length-1;a>=0;a--){const d=o.children[a];d&&t.push([d,i+1])}}return n}function H(s,n){const t=[...s];for(;t.length>0;){const e=t.pop();if(e){if(e.id===n)return e;for(let o=e.children.length-1;o>=0;o--){const i=e.children[o];i&&t.push(i)}}}return null}function j(s,n,t=!1){return{id:s,label:n,children:[],isOpen:!1,isSelected:!1,isIndeterminate:!1,isLoading:!1,hasChildren:t}}function re(s,n){const t=[],e=n.toLowerCase().trim();if(e==="")return t;function o(i,a){for(const d of i)d.label.toLowerCase().includes(e)&&t.push({node:d,depth:0,breadcrumb:a.length>0?a.join(" › "):void 0}),d.children.length>0&&o(d.children,[...a,d.label])}return o(s,[]),t}const ne=500;function oe(s,n){const t=4+Math.floor(Math.random()*5),e=[];for(let o=0;o<t;o++){const i=`${s}-${o}`,a=`${n} › Item ${o+1}`,d=Math.random()>.5;e.push(j(i,a,d))}return e}function se(s,n){return new Promise(t=>{setTimeout(()=>{const e=oe(s,n);t(e)},ne)})}function ae(){return["Engineering","Design","Product","Marketing","Sales","Operations","Finance","Human Resources"].map((n,t)=>j(`root-${t}`,n,!0))}function ie(s){const n=s?.fetchChildrenFn??se,[t,e]=h.useState(()=>s?.initialRootNodes??ae()),[o,i]=h.useState(null),a=h.useMemo(()=>te(t),[t]),d=h.useCallback((f,x)=>{e(m=>{function l(g){return g.map(w=>{const N={...w,children:l(w.children)};return N.id===f?x(N):N})}return l(m)})},[]),c=h.useCallback(f=>{const x=H(t,f);if(x){if(x.children.length>0){d(f,m=>({...m,isOpen:!m.isOpen}));return}x.hasChildren&&!x.isLoading&&(i(null),d(f,m=>({...m,isLoading:!0})),n(f,x.label).then(m=>{d(f,l=>({...l,children:m,isLoading:!1,isOpen:!0}))},m=>{d(f,g=>({...g,isLoading:!1}));const l=m instanceof Error?m.message:"Failed to load children";i(l)}))}},[t,d,n]),y=h.useCallback(f=>{e(x=>{const m=q(x),l=H(m,f);if(!l)return x;const g=!l.isSelected;return z(l,g),U(m),m})},[]),k=h.useMemo(()=>{const f=[];function x(m){for(const l of m)l.isSelected&&f.push({id:l.id,label:l.label}),!l.isSelected&&l.children.length>0&&x(l.children)}return x(t),f},[t]),v=h.useCallback(f=>{y(f)},[y]),C=h.useCallback(()=>{i(null)},[]);return{flatNodes:a,rootNodes:t,selectedNodes:k,error:o,toggleExpand:c,toggleSelect:y,deselectNode:v,clearError:C}}function q(s){return s.map(n=>({...n,children:q(n.children)}))}function z(s,n){s.isSelected=n,s.isIndeterminate=!1;for(const t of s.children)z(t,n)}function U(s){let n=0,t=0;for(const e of s){if(e.children.length>0){const[o,i]=U(e.children),a=o===i&&i>0,d=o===0,c=e.children.some(y=>y.isIndeterminate);a?(e.isSelected=!0,e.isIndeterminate=!1):d&&!c?(e.isSelected=!1,e.isIndeterminate=!1):(e.isSelected=!1,e.isIndeterminate=!0)}t++,e.isSelected&&n++}return[n,t]}function le({containerRef:s,itemCount:n,itemHeight:t,overscan:e=5}){const[o,i]=h.useState(0),[a,d]=h.useState(0),c=h.useRef(0),y=h.useCallback(()=>{const l=s.current;if(!l)return;const g=l.scrollTop;c.current=g,requestAnimationFrame(()=>{i(g)})},[s]);h.useEffect(()=>{const l=s.current;if(!l)return;d(l.clientHeight),l.addEventListener("scroll",y,{passive:!0});const g=new ResizeObserver(w=>{for(const N of w)d(N.contentRect.height)});return g.observe(l),()=>{l.removeEventListener("scroll",y),g.disconnect()}},[s,y]);const k=n*t,v=Math.floor(o/t),C=Math.ceil(a/t),f=Math.max(0,v-e),x=Math.min(n-1,v+C+e),m=[];if(n>0)for(let l=f;l<=x;l++)m.push({index:l,offsetTop:l*t});return{virtualItems:m,totalHeight:k}}const de=20;function W({flatNode:s,offsetTop:n,rowHeight:t,isHighlighted:e,optionId:o,onToggleExpand:i,onToggleSelect:a,searchQuery:d}){const{node:c,depth:y}=s,k=d!==void 0,v=h.useCallback(l=>{l.stopPropagation(),i(c.id)},[c.id,i]),C=h.useCallback(l=>{l.stopPropagation()},[]),f=h.useCallback(()=>{a(c.id)},[c.id,a]),x=h.useCallback(()=>{a(c.id)},[c.id,a]),m=k?12:12+y*de;return r.jsxs("div",{id:o,role:"option","aria-selected":c.isSelected,"aria-expanded":!k&&c.hasChildren?c.isOpen:void 0,onClick:x,className:["absolute left-0 right-0 flex cursor-pointer items-center text-sm","transition-colors duration-75",e?"bg-primary-50":"hover:bg-neutral-50"].join(" "),style:{height:`${t}px`,top:`${n}px`,paddingLeft:`${m}px`,paddingRight:"12px"},children:[!k&&(c.hasChildren?r.jsx("button",{type:"button",tabIndex:-1,onClick:v,className:["mr-xs flex h-5 w-5 flex-shrink-0 items-center justify-center","rounded-sm text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700","transition-colors duration-100"].join(" "),"aria-label":c.isOpen?`Collapse ${c.label}`:`Expand ${c.label}`,"aria-hidden":"true",children:c.isLoading?r.jsx("span",{className:"block h-3 w-3 animate-pulse rounded-sm bg-neutral-300"}):r.jsx("svg",{className:["h-3.5 w-3.5 transition-transform duration-150",c.isOpen?"rotate-90":""].join(" "),fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",strokeWidth:2.5,"aria-hidden":"true",children:r.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M9 5l7 7-7 7"})})}):r.jsx("span",{className:"mr-xs inline-block h-5 w-5 flex-shrink-0","aria-hidden":"true"})),r.jsx("input",{type:"checkbox",tabIndex:-1,checked:c.isSelected,ref:l=>{l&&(l.indeterminate=c.isIndeterminate)},onClick:C,onChange:f,className:["mr-sm h-4 w-4 flex-shrink-0 cursor-pointer rounded-sm","border-neutral-300 text-primary-600","focus:ring-2 focus:ring-primary-500 focus:ring-offset-1"].join(" "),"aria-label":`Select ${c.label}`}),r.jsxs("div",{className:"flex min-w-0 flex-1 flex-col justify-center overflow-hidden",children:[r.jsx("span",{className:["truncate",c.isSelected?"font-medium text-neutral-900":"text-neutral-700"].join(" "),children:d?r.jsx(ce,{text:c.label,query:d}):c.label}),s.breadcrumb&&r.jsx("span",{className:"truncate text-xs leading-tight text-neutral-400",children:s.breadcrumb})]})]})}function ce({text:s,query:n}){const t=s.toLowerCase(),e=n.toLowerCase().trim(),o=t.indexOf(e);if(o===-1||e==="")return r.jsx(r.Fragment,{children:s});const i=s.slice(0,o),a=s.slice(o,o+e.length),d=s.slice(o+e.length);return r.jsxs(r.Fragment,{children:[i,r.jsx("mark",{className:"rounded-sm bg-primary-100 text-primary-800",children:a}),d]})}W.__docgenInfo={description:`TreeRow — a single absolutely-positioned row inside the virtualized list.\r
\r
Renders in two layout modes:\r
\r
**Tree mode** (searchQuery undefined):\r
  [indent] [▸ expand] [☐ checkbox] [label]\r
  Row height: 32px. Depth controls indentation.\r
\r
**Search mode** (searchQuery defined):\r
  [☐ checkbox] [Highlighted label]\r
                [breadcrumb path in gray]\r
  Row height: 44px. No indentation. Expand button hidden.\r
\r
ARIA:\r
  role="option", aria-selected, aria-expanded (branches in tree mode).\r
  The row's DOM id feeds aria-activedescendant on the input.`,methods:[],displayName:"TreeRow",props:{flatNode:{required:!0,tsType:{name:"FlatNode"},description:""},offsetTop:{required:!0,tsType:{name:"number"},description:"Absolute pixel offset from the top of the scroll content"},rowHeight:{required:!0,tsType:{name:"number"},description:"Row height in pixels — must match the virtualizer's itemHeight"},isHighlighted:{required:!0,tsType:{name:"boolean"},description:"Whether this row is the keyboard-highlighted (active descendant) row"},optionId:{required:!0,tsType:{name:"string"},description:"Unique DOM id for this option — used by aria-activedescendant"},onToggleExpand:{required:!0,tsType:{name:"signature",type:"function",raw:"(nodeId: string) => void",signature:{arguments:[{type:{name:"string"},name:"nodeId"}],return:{name:"void"}}},description:""},onToggleSelect:{required:!0,tsType:{name:"signature",type:"function",raw:"(nodeId: string) => void",signature:{arguments:[{type:{name:"string"},name:"nodeId"}],return:{name:"void"}}},description:""},searchQuery:{required:!1,tsType:{name:"string"},description:`When defined, the row is displayed in "search result" mode:\r
 - Expand/collapse button is hidden\r
 - Matching text in the label is highlighted\r
 - Ancestry breadcrumb is shown below the label (if available)`}}};const F=5;function G({selectedNodes:s,onRemove:n}){if(s.length===0)return null;const t=s.slice(0,F),e=s.length-F;return r.jsxs(r.Fragment,{children:[t.map(o=>r.jsx(he,{nodeId:o.id,label:o.label,onRemove:n},o.id)),e>0&&r.jsxs("span",{className:"inline-flex items-center rounded-md bg-neutral-100 px-sm py-xs text-xs font-medium text-neutral-600",children:["+",e," more"]})]})}function he({nodeId:s,label:n,onRemove:t}){const e=h.useCallback(o=>{o.stopPropagation(),t(s)},[s,t]);return r.jsxs("span",{className:"inline-flex items-center gap-xs rounded-md bg-primary-100 px-sm py-xs text-xs font-medium text-primary-800",children:[r.jsx("span",{className:"max-w-24 truncate",children:n}),r.jsx("button",{type:"button",onClick:e,className:"flex h-3.5 w-3.5 items-center justify-center rounded-full text-primary-600 hover:bg-primary-200 hover:text-primary-900","aria-label":`Remove ${n}`,children:r.jsx("svg",{className:"h-3 w-3",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",strokeWidth:2.5,children:r.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M6 18L18 6M6 6l12 12"})})})]})}G.__docgenInfo={description:`SelectedTags — pill-style tags displayed inside the combobox input area.\r
\r
Each tag shows the node's label and an × button to deselect it.\r
When more than MAX_VISIBLE_TAGS are selected, the overflow is\r
collapsed into a "+N more" badge.\r
\r
Returns a Fragment so the parent container's flex-wrap layout\r
can interleave tags with the search input on the same line.`,methods:[],displayName:"SelectedTags",props:{selectedNodes:{required:!0,tsType:{name:"Array",elements:[{name:"SelectedNode"}],raw:"SelectedNode[]"},description:""},onRemove:{required:!0,tsType:{name:"signature",type:"function",raw:"(nodeId: string) => void",signature:{arguments:[{type:{name:"string"},name:"nodeId"}],return:{name:"void"}}},description:""}}};const ue=32,pe=44,P="hcb-option-";function B(s={}){const[n,t]=h.useState(!1),[e,o]=h.useState(-1),[i,a]=h.useState(""),d={};s.initialRootNodes&&(d.initialRootNodes=s.initialRootNodes),s.fetchChildrenFn&&(d.fetchChildrenFn=s.fetchChildrenFn);const{flatNodes:c,rootNodes:y,selectedNodes:k,error:v,toggleExpand:C,toggleSelect:f,deselectNode:x,clearError:m}=ie(d),l=h.useMemo(()=>i.trim().length>0?re(y,i):[],[y,i]),g=i.trim().length>0,w=g?l:c,N=g?pe:ue,S=h.useRef(null),M=h.useRef(null),O=h.useRef(null),{virtualItems:X,totalHeight:K}=le({containerRef:S,itemCount:w.length,itemHeight:N,overscan:5}),_="hcb-listbox",Q=e>=0&&e<w.length?`${P}${w[e]?.node.id??""}`:void 0;h.useEffect(()=>{function u(b){const p=M.current;p&&(p.contains(b.target)||(t(!1),a(""),o(-1)))}return document.addEventListener("mousedown",u),()=>{document.removeEventListener("mousedown",u)}},[]),h.useEffect(()=>{if(e<0||!S.current)return;const u=S.current,b=e*N,p=b+N,$=u.scrollTop,ee=$+u.clientHeight;b<$?u.scrollTop=b:p>ee&&(u.scrollTop=p-u.clientHeight)},[e,N]),h.useEffect(()=>{S.current&&(S.current.scrollTop=0)},[g]);const Y=h.useCallback(u=>{if(u.target===O.current){n||t(!0);return}O.current?.focus(),t(b=>{const p=!b;return p||(a(""),o(-1)),p})},[n]),V=h.useCallback(u=>{u.stopPropagation(),O.current?.focus(),t(b=>{const p=!b;return p||(a(""),o(-1)),p})},[]),J=h.useCallback(u=>{const b=u.target.value;a(b),o(-1),n||t(!0)},[n]),Z=h.useCallback(u=>{const b=w.length;switch(u.key){case"ArrowDown":{u.preventDefault(),n?o(p=>Math.min(p+1,b-1)):(t(!0),o(0));break}case"ArrowUp":{u.preventDefault(),n&&o(p=>Math.max(p-1,0));break}case"ArrowRight":{if(!g&&n&&e>=0){u.preventDefault();const p=w[e];p&&p.node.hasChildren&&!p.node.isOpen&&C(p.node.id)}break}case"ArrowLeft":{if(!g&&n&&e>=0){u.preventDefault();const p=w[e];p&&p.node.isOpen&&C(p.node.id)}break}case"Enter":{if(u.preventDefault(),!n)t(!0),o(0);else if(e>=0){const p=w[e];p&&f(p.node.id)}break}case"Home":{u.preventDefault(),n&&b>0&&o(0);break}case"End":{u.preventDefault(),n&&b>0&&o(b-1);break}case"Escape":{u.preventDefault(),g?(a(""),o(-1)):(t(!1),o(-1));break}}},[n,g,e,w,C,f]);return r.jsxs("div",{ref:M,className:"relative w-full max-w-lg",children:[r.jsxs("div",{onClick:Y,className:["flex w-full min-h-[2.75rem] cursor-text flex-wrap items-center gap-xs","rounded-lg border bg-white px-md py-xs shadow-sm","transition-all duration-200",n?"border-primary-500 ring-2 ring-primary-500/20":"border-neutral-300 hover:border-neutral-400"].join(" "),children:[k.length>0&&r.jsx(G,{selectedNodes:k,onRemove:x}),r.jsx("input",{ref:O,type:"text",role:"combobox","aria-expanded":n,"aria-haspopup":"listbox","aria-controls":n?_:void 0,"aria-activedescendant":n?Q:void 0,"aria-label":"Select items from hierarchical list",value:i,onChange:J,onKeyDown:Z,placeholder:k.length>0?"":"Search or select items…",autoComplete:"off",className:["min-w-[120px] flex-1 border-0 bg-transparent py-xs text-sm","text-neutral-900 outline-none placeholder:text-neutral-400"].join(" ")}),r.jsx("button",{type:"button",tabIndex:-1,onClick:V,className:["ml-auto flex-shrink-0 rounded p-xs","text-neutral-400 hover:text-neutral-600","transition-colors duration-150"].join(" "),"aria-label":n?"Close dropdown":"Open dropdown",children:r.jsx("svg",{className:["h-5 w-5 transition-transform duration-200",n?"rotate-180":""].join(" "),fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",strokeWidth:2,"aria-hidden":"true",children:r.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M19 9l-7 7-7-7"})})})]}),n&&r.jsxs("div",{className:["absolute left-0 top-full z-50 mt-xs w-full","overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-xl"].join(" "),children:[g&&w.length===0&&r.jsxs("div",{className:"px-lg py-md text-center text-sm text-neutral-500",role:"status",children:["No results for “",i,"”"]}),r.jsx("div",{ref:S,id:_,role:"listbox","aria-label":"Hierarchical options","aria-multiselectable":"true",className:"relative overflow-y-auto",style:{maxHeight:"var(--combobox-max-height)"},children:w.length>0&&r.jsx("div",{className:"relative w-full",style:{height:`${K}px`},children:X.map(u=>{const b=w[u.index];return b?r.jsx(W,{flatNode:b,offsetTop:u.offsetTop,rowHeight:N,isHighlighted:u.index===e,optionId:`${P}${b.node.id}`,onToggleExpand:C,onToggleSelect:f,searchQuery:g?i:void 0},b.node.id):null})})}),!g&&c.length===0&&!v&&r.jsx("div",{className:"px-lg py-md text-center text-sm text-neutral-400",role:"status",children:"No items available"}),v&&r.jsxs("div",{role:"alert",className:"flex items-center justify-between border-t border-danger-500/20 bg-danger-500/10 px-md py-sm text-sm text-danger-600",children:[r.jsx("span",{children:v}),r.jsx("button",{type:"button",tabIndex:-1,onClick:m,className:"ml-sm text-xs font-medium underline hover:text-danger-500","aria-label":"Dismiss error",children:"Dismiss"})]})]})]})}B.__docgenInfo={description:`HierarchicalCombobox — the root component.\r
\r
Two rendering modes\r
───────────────────\r
**Tree mode** (default): A hierarchical tree view with expand/collapse,\r
indentation, and async lazy-loading of children.\r
\r
**Search mode** (activated when the user types in the input): A flat\r
filtered list with matching text highlighted and ancestry breadcrumbs\r
showing where each result lives in the hierarchy. This is the\r
"search with context preservation" feature.\r
\r
ARIA 1.2 Combobox Pattern\r
─────────────────────────\r
The text input has role="combobox" with:\r
  - aria-expanded:         true when dropdown is open\r
  - aria-controls:         points to the listbox id\r
  - aria-activedescendant: points to the currently highlighted option\r
\r
Keyboard Navigation\r
───────────────────\r
  ArrowDown  → move highlight to next row (opens dropdown if closed)\r
  ArrowUp    → move highlight to previous row\r
  ArrowRight → expand highlighted node (tree mode only)\r
  ArrowLeft  → collapse highlighted node (tree mode only)\r
  Enter      → toggle selection on highlighted node\r
  Home       → jump to first row\r
  End        → jump to last row\r
  Escape     → clears search query, then closes dropdown`,methods:[],displayName:"Combobox"};const ve={title:"Components/Combobox",component:B,parameters:{layout:"centered",docs:{description:{component:`Storybook stories for the HierarchicalCombobox.\r

Seven stories cover the key scenarios:\r
 1. Default        – Small dataset (8 root departments, lazy-load children)\r
 2. LargeDataset   – 10,000 pre-loaded items to prove custom virtualization\r
 3. AsyncLoading   – Exaggerated network latency (2 seconds) per expand\r
 4. ErrorState     – Every expand triggers a simulated API failure\r
 5. HighContrast   – Verifies readability in forced-colors / high-contrast mode\r
 6. KeyboardOnly   – Opens with focus so keyboard-only usage can be demoed\r
 7. SearchFiltering – Pre-loaded tree to demonstrate search with ancestry context`}}},decorators:[s=>r.jsx("div",{className:"w-[480px]",children:r.jsx(s,{})})]},T={};function me(){const t=[];for(let e=0;e<200;e++){const o=j(`group-${e}`,`Group ${e+1}`,!0),i=[];for(let a=0;a<50;a++)i.push(j(`group-${e}-item-${a}`,`Group ${e+1} › Item ${a+1}`,!1));o.children=i,o.isOpen=!0,t.push(o)}return t}const E={args:{initialRootNodes:me()}};function fe(s,n){return new Promise(e=>{setTimeout(()=>{const o=4+Math.floor(Math.random()*5),i=[];for(let a=0;a<o;a++)i.push(j(`${s}-${a}`,`${n} › Item ${a+1}`,Math.random()>.5));e(i)},2e3)})}const I={args:{fetchChildrenFn:fe}};function ge(s,n){return new Promise((e,o)=>{setTimeout(()=>{o(new Error("Network error: unable to load children. Please try again."))},800)})}const R={args:{fetchChildrenFn:ge}},L={decorators:[s=>r.jsxs("div",{className:"w-[480px] rounded-lg border-2 border-neutral-900 bg-white p-lg",style:{forcedColorAdjust:"auto"},children:[r.jsx("p",{className:"mb-sm text-xs font-semibold uppercase tracking-wide text-neutral-500",children:"High-contrast mode preview"}),r.jsx(s,{})]})],parameters:{a11y:{config:{rules:[{id:"color-contrast",enabled:!0}]}}}},D={decorators:[s=>r.jsxs("div",{className:"w-[480px]",children:[r.jsxs("div",{className:"mb-md rounded-lg bg-primary-50 p-md text-xs leading-relaxed text-primary-800",children:[r.jsx("p",{className:"mb-xs font-semibold",children:"Keyboard-only test instructions:"}),r.jsxs("ul",{className:"list-inside list-disc space-y-0.5",children:[r.jsxs("li",{children:[r.jsx("kbd",{className:"rounded bg-primary-100 px-1 font-mono",children:"Tab"})," to focus the input"]}),r.jsxs("li",{children:[r.jsx("kbd",{className:"rounded bg-primary-100 px-1 font-mono",children:"↓"})," opens dropdown & moves highlight down"]}),r.jsxs("li",{children:[r.jsx("kbd",{className:"rounded bg-primary-100 px-1 font-mono",children:"↑"})," moves highlight up"]}),r.jsxs("li",{children:[r.jsx("kbd",{className:"rounded bg-primary-100 px-1 font-mono",children:"→"})," expands a collapsed branch"]}),r.jsxs("li",{children:[r.jsx("kbd",{className:"rounded bg-primary-100 px-1 font-mono",children:"←"})," collapses an expanded branch"]}),r.jsxs("li",{children:[r.jsx("kbd",{className:"rounded bg-primary-100 px-1 font-mono",children:"Enter"})," toggles selection on highlighted row"]}),r.jsxs("li",{children:[r.jsx("kbd",{className:"rounded bg-primary-100 px-1 font-mono",children:"Home"})," / ",r.jsx("kbd",{className:"rounded bg-primary-100 px-1 font-mono",children:"End"})," jump to first / last row"]}),r.jsxs("li",{children:[r.jsx("kbd",{className:"rounded bg-primary-100 px-1 font-mono",children:"Esc"})," clears search → closes dropdown"]}),r.jsx("li",{children:"Type to search; results show ancestry breadcrumbs"})]})]}),r.jsx(s,{})]})]};function be(){const s=["Engineering","Design","Product"],n=[];for(let t=0;t<s.length;t++){const e=s[t]??`Dept ${t}`,o=j(`dept-${t}`,e,!0);o.isOpen=!0;const i=["Frontend","Backend","Infrastructure"],a=[];for(let d=0;d<i.length;d++){const c=i[d]??`Team ${d}`,y=j(`dept-${t}-team-${d}`,c,!0);y.isOpen=!0;const k=[];for(let v=0;v<4;v++)k.push(j(`dept-${t}-team-${d}-member-${v}`,`${c} Member ${v+1}`,!1));y.children=k,a.push(y)}o.children=a,n.push(o)}return n}const A={args:{initialRootNodes:be()}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:"{}",...T.parameters?.docs?.source},description:{story:`Uses the built-in mock loader with 8 root departments.\r
Click any row to expand and lazy-load children after a 500ms delay.\r
This is the baseline interaction story.`,...T.parameters?.docs?.description}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    initialRootNodes: generateLargeDataset()
  }
}`,...E.parameters?.docs?.source},description:{story:`10,200 visible rows (200 open groups × 50 children + 200 roots).\r
The dropdown should scroll smoothly with no jank — all rendering\r
is handled by the math-based virtualizer.`,...E.parameters?.docs?.description}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    fetchChildrenFn: slowFetchChildren
  }
}`,...I.parameters?.docs?.source},description:{story:`Demonstrates loading state UX with a 2-second delay per expand.\r
Watch the skeleton animation while children load.`,...I.parameters?.docs?.description}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    fetchChildrenFn: failingFetchChildren
  }
}`,...R.parameters?.docs?.source},description:{story:`Every expand attempt fails with an error banner.\r
The dismiss button clears the error, and you can retry.`,...R.parameters?.docs?.description}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  decorators: [(Story): React.JSX.Element => <div className="w-[480px] rounded-lg border-2 border-neutral-900 bg-white p-lg" style={{
    forcedColorAdjust: 'auto'
  }}>\r
        <p className="mb-sm text-xs font-semibold uppercase tracking-wide text-neutral-500">\r
          High-contrast mode preview\r
        </p>\r
        <Story />\r
      </div>],
  parameters: {
    a11y: {
      config: {
        rules: [{
          id: 'color-contrast',
          enabled: true
        }]
      }
    }
  }
}`,...L.parameters?.docs?.source},description:{story:`Renders the default combobox inside a wrapper that simulates\r
forced-colors / high-contrast media. The Accessibility panel\r
(powered by @storybook/addon-a11y) should report zero violations.\r

Manual check: borders, focus rings, and text should remain visible\r
against both light and dark system backgrounds.`,...L.parameters?.docs?.description}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  decorators: [(Story): React.JSX.Element => <div className="w-[480px]">\r
        <div className="mb-md rounded-lg bg-primary-50 p-md text-xs leading-relaxed text-primary-800">\r
          <p className="mb-xs font-semibold">Keyboard-only test instructions:</p>\r
          <ul className="list-inside list-disc space-y-0.5">\r
            <li><kbd className="rounded bg-primary-100 px-1 font-mono">Tab</kbd> to focus the input</li>\r
            <li><kbd className="rounded bg-primary-100 px-1 font-mono">↓</kbd> opens dropdown &amp; moves highlight down</li>\r
            <li><kbd className="rounded bg-primary-100 px-1 font-mono">↑</kbd> moves highlight up</li>\r
            <li><kbd className="rounded bg-primary-100 px-1 font-mono">→</kbd> expands a collapsed branch</li>\r
            <li><kbd className="rounded bg-primary-100 px-1 font-mono">←</kbd> collapses an expanded branch</li>\r
            <li><kbd className="rounded bg-primary-100 px-1 font-mono">Enter</kbd> toggles selection on highlighted row</li>\r
            <li><kbd className="rounded bg-primary-100 px-1 font-mono">Home</kbd> / <kbd className="rounded bg-primary-100 px-1 font-mono">End</kbd> jump to first / last row</li>\r
            <li><kbd className="rounded bg-primary-100 px-1 font-mono">Esc</kbd> clears search → closes dropdown</li>\r
            <li>Type to search; results show ancestry breadcrumbs</li>\r
          </ul>\r
        </div>\r
        <Story />\r
      </div>]
}`,...D.parameters?.docs?.source},description:{story:`Instructions are displayed above the combobox so a reviewer can\r
verify every keyboard shortcut without needing a mouse.\r

The story itself is identical to Default — the value is in the\r
instructions that guide the tester through the keyboard flow.`,...D.parameters?.docs?.description}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    initialRootNodes: generateSearchableTree()
  }
}`,...A.parameters?.docs?.source},description:{story:`A pre-loaded 3-level tree for testing search with ancestry context.\r
Type "Frontend" to see it matched under every department with breadcrumbs.\r
Type "Member" to see leaf nodes with full ancestry paths.`,...A.parameters?.docs?.description}}};const ke=["Default","LargeDataset","AsyncLoading","ErrorState","HighContrast","KeyboardOnly","SearchFiltering"];export{I as AsyncLoading,T as Default,R as ErrorState,L as HighContrast,D as KeyboardOnly,E as LargeDataset,A as SearchFiltering,ke as __namedExportsOrder,ve as default};
