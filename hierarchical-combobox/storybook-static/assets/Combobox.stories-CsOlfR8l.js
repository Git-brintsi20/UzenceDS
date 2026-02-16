import{j as r}from"./jsx-runtime-u17CrQMm.js";import{r as d}from"./index-Bpooh2ix.js";import"./_commonjsHelpers-CqkleIqs.js";function te(s){const n=[],t=[];for(let e=s.length-1;e>=0;e--){const o=s[e];o&&t.push([o,0])}for(;t.length>0;){const e=t.pop();if(!e)break;const[o,i]=e;if(n.push({node:o,depth:i}),o.isOpen&&o.children.length>0)for(let a=o.children.length-1;a>=0;a--){const l=o.children[a];l&&t.push([l,i+1])}}return n}function H(s,n){const t=[...s];for(;t.length>0;){const e=t.pop();if(e){if(e.id===n)return e;for(let o=e.children.length-1;o>=0;o--){const i=e.children[o];i&&t.push(i)}}}return null}function S(s,n,t=!1){return{id:s,label:n,children:[],isOpen:!1,isSelected:!1,isIndeterminate:!1,isLoading:!1,hasChildren:t}}function re(s,n){const t=[],e=n.toLowerCase().trim();if(e==="")return t;function o(i,a){for(const l of i)l.label.toLowerCase().includes(e)&&t.push({node:l,depth:0,breadcrumb:a.length>0?a.join(" › "):void 0}),l.children.length>0&&o(l.children,[...a,l.label])}return o(s,[]),t}const ne=500;function oe(s,n){const t=4+Math.floor(Math.random()*5),e=[];for(let o=0;o<t;o++){const i=`${s}-${o}`,a=`${n} › Item ${o+1}`,l=Math.random()>.5;e.push(S(i,a,l))}return e}function se(s,n){return new Promise(t=>{setTimeout(()=>{const e=oe(s,n);t(e)},ne)})}function ae(){return["Engineering","Design","Product","Marketing","Sales","Operations","Finance","Human Resources"].map((n,t)=>S(`root-${t}`,n,!0))}function ie(s){const n=s?.fetchChildrenFn??se,[t,e]=d.useState(()=>s?.initialRootNodes??ae()),[o,i]=d.useState(null),a=d.useMemo(()=>te(t),[t]),l=d.useCallback((g,w)=>{e(b=>{function h(u){return u.map(x=>{const C={...x,children:h(x.children)};return C.id===g?w(C):C})}return h(b)})},[]),c=d.useCallback(g=>{const w=H(t,g);if(w){if(w.children.length>0){l(g,b=>({...b,isOpen:!b.isOpen}));return}w.hasChildren&&!w.isLoading&&(i(null),l(g,b=>({...b,isLoading:!0})),n(g,w.label).then(b=>{l(g,h=>({...h,children:b,isLoading:!1,isOpen:!0}))},b=>{l(g,u=>({...u,isLoading:!1}));const h=b instanceof Error?b.message:"Failed to load children";i(h)}))}},[t,l,n]),y=d.useCallback(g=>{e(w=>{const b=q(w),h=H(b,g);if(!h)return w;const u=!h.isSelected;return z(h,u),U(b),b})},[]),v=d.useMemo(()=>{const g=[];function w(b){for(const h of b)h.isSelected&&g.push({id:h.id,label:h.label}),!h.isSelected&&h.children.length>0&&w(h.children)}return w(t),g},[t]),k=d.useCallback(g=>{y(g)},[y]),N=d.useCallback(()=>{i(null)},[]);return{flatNodes:a,rootNodes:t,selectedNodes:v,error:o,toggleExpand:c,toggleSelect:y,deselectNode:k,clearError:N}}function q(s){return s.map(n=>({...n,children:q(n.children)}))}function z(s,n){s.isSelected=n,s.isIndeterminate=!1;for(const t of s.children)z(t,n)}function U(s){let n=0,t=0;for(const e of s){if(e.children.length>0){const[o,i]=U(e.children),a=o===i&&i>0,l=o===0,c=e.children.some(y=>y.isIndeterminate);a?(e.isSelected=!0,e.isIndeterminate=!1):l&&!c?(e.isSelected=!1,e.isIndeterminate=!1):(e.isSelected=!1,e.isIndeterminate=!0)}t++,e.isSelected&&n++}return[n,t]}function le({containerRef:s,itemCount:n,itemHeight:t,overscan:e=5}){const[o,i]=d.useState(0),[a,l]=d.useState(320),c=d.useRef(0),y=d.useRef(null),v=d.useCallback(()=>{const u=s.current;if(!u)return;const x=u.scrollTop;c.current=x,y.current!==null&&cancelAnimationFrame(y.current),y.current=requestAnimationFrame(()=>{i(x),y.current=null})},[s]);d.useEffect(()=>{const u=s.current;if(!u)return;l(u.clientHeight),u.addEventListener("scroll",v,{passive:!0});const x=new ResizeObserver(C=>{for(const j of C){const E=j.contentRect.height;l(T=>Math.abs(E-T)>1?E:T)}});return x.observe(u),()=>{u.removeEventListener("scroll",v),x.disconnect(),y.current!==null&&cancelAnimationFrame(y.current)}},[s,v]);const k=n*t,N=Math.floor(o/t),g=Math.ceil(a/t),w=Math.max(0,N-e),b=Math.min(n-1,N+g+e),h=[];if(n>0)for(let u=w;u<=b;u++)h.push({index:u,offsetTop:u*t});return{virtualItems:h,totalHeight:k}}const de=20;function W({flatNode:s,offsetTop:n,rowHeight:t,isHighlighted:e,optionId:o,onToggleExpand:i,onToggleSelect:a,searchQuery:l}){const{node:c,depth:y}=s,v=l!==void 0,k=d.useCallback(h=>{h.stopPropagation(),h.preventDefault(),i(c.id)},[c.id,i]),N=d.useCallback(h=>{h.stopPropagation()},[]),g=d.useCallback(()=>{a(c.id)},[c.id,a]),w=d.useCallback(()=>{a(c.id)},[c.id,a]),b=v?12:12+y*de;return r.jsxs("div",{id:o,role:"option","aria-selected":c.isSelected,"aria-expanded":!v&&c.hasChildren?c.isOpen:void 0,onClick:w,className:["absolute left-0 right-0 flex cursor-pointer items-center text-sm","transition-colors duration-75",e?"bg-blue-50":"hover:bg-gray-50"].join(" "),style:{height:`${t}px`,top:`${n}px`,paddingLeft:`${b}px`,paddingRight:"12px"},children:[!v&&(c.hasChildren?r.jsx("button",{type:"button",tabIndex:-1,onClick:k,onMouseDown:h=>h.preventDefault(),className:["mr-1 flex h-5 w-5 flex-shrink-0 items-center justify-center","rounded text-gray-500 hover:bg-gray-100 hover:text-gray-700","transition-colors duration-100"].join(" "),"aria-label":c.isOpen?`Collapse ${c.label}`:`Expand ${c.label}`,"aria-hidden":"true",children:c.isLoading?r.jsx("span",{className:"block h-3 w-3 animate-pulse rounded-sm bg-gray-300"}):r.jsx("svg",{className:["h-3.5 w-3.5 transition-transform duration-150",c.isOpen?"rotate-90":""].join(" "),fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",strokeWidth:2.5,"aria-hidden":"true",children:r.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M9 5l7 7-7 7"})})}):r.jsx("span",{className:"mr-1 inline-block h-5 w-5 flex-shrink-0","aria-hidden":"true"})),r.jsx("input",{type:"checkbox",tabIndex:-1,checked:c.isSelected,ref:h=>{h&&(h.indeterminate=c.isIndeterminate)},onClick:N,onChange:g,className:["mr-2 h-4 w-4 flex-shrink-0 cursor-pointer rounded","border-gray-300 text-blue-600","focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"].join(" "),"aria-label":`Select ${c.label}`}),r.jsxs("div",{className:"flex min-w-0 flex-1 flex-col justify-center overflow-hidden",children:[r.jsx("span",{className:["truncate",c.isSelected?"font-medium text-gray-900":"text-gray-700"].join(" "),children:l?r.jsx(ce,{text:c.label,query:l}):c.label}),s.breadcrumb&&r.jsx("span",{className:"truncate text-xs leading-tight text-gray-400",children:s.breadcrumb})]})]})}function ce({text:s,query:n}){const t=s.toLowerCase(),e=n.toLowerCase().trim(),o=t.indexOf(e);if(o===-1||e==="")return r.jsx(r.Fragment,{children:s});const i=s.slice(0,o),a=s.slice(o,o+e.length),l=s.slice(o+e.length);return r.jsxs(r.Fragment,{children:[i,r.jsx("mark",{className:"rounded-sm bg-yellow-100 text-gray-900",children:a}),l]})}W.__docgenInfo={description:`TreeRow — a single absolutely-positioned row inside the virtualized list.\r
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
 - Ancestry breadcrumb is shown below the label (if available)`}}};const F=5;function G({selectedNodes:s,onRemove:n}){if(s.length===0)return null;const t=s.slice(0,F),e=s.length-F;return r.jsxs(r.Fragment,{children:[t.map(o=>r.jsx(he,{nodeId:o.id,label:o.label,onRemove:n},o.id)),e>0&&r.jsxs("span",{className:"inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600",children:["+",e," more"]})]})}function he({nodeId:s,label:n,onRemove:t}){const e=d.useCallback(o=>{o.stopPropagation(),t(s)},[s,t]);return r.jsxs("span",{className:"inline-flex items-center gap-1 rounded-md bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800",children:[r.jsx("span",{className:"max-w-24 truncate",children:n}),r.jsx("button",{type:"button",onClick:e,className:"flex h-3.5 w-3.5 items-center justify-center rounded-full text-blue-600 hover:bg-blue-200 hover:text-blue-900","aria-label":`Remove ${n}`,children:r.jsx("svg",{className:"h-3 w-3",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",strokeWidth:2.5,children:r.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M6 18L18 6M6 6l12 12"})})})]})}G.__docgenInfo={description:`SelectedTags — pill-style tags displayed inside the combobox input area.\r
\r
Each tag shows the node's label and an × button to deselect it.\r
When more than MAX_VISIBLE_TAGS are selected, the overflow is\r
collapsed into a "+N more" badge.\r
\r
Returns a Fragment so the parent container's flex-wrap layout\r
can interleave tags with the search input on the same line.`,methods:[],displayName:"SelectedTags",props:{selectedNodes:{required:!0,tsType:{name:"Array",elements:[{name:"SelectedNode"}],raw:"SelectedNode[]"},description:""},onRemove:{required:!0,tsType:{name:"signature",type:"function",raw:"(nodeId: string) => void",signature:{arguments:[{type:{name:"string"},name:"nodeId"}],return:{name:"void"}}},description:""}}};const ue=32,pe=44,P="hcb-option-";function B(s={}){const[n,t]=d.useState(!1),[e,o]=d.useState(-1),[i,a]=d.useState(""),l={};s.initialRootNodes&&(l.initialRootNodes=s.initialRootNodes),s.fetchChildrenFn&&(l.fetchChildrenFn=s.fetchChildrenFn);const{flatNodes:c,rootNodes:y,selectedNodes:v,error:k,toggleExpand:N,toggleSelect:g,deselectNode:w,clearError:b}=ie(l),h=d.useMemo(()=>i.trim().length>0?re(y,i):[],[y,i]),u=i.trim().length>0,x=d.useMemo(()=>(u?h:c).filter(f=>f&&f.node&&f.node.id),[u,h,c]),C=u?pe:ue,j=d.useRef(null),E=d.useRef(null),T=d.useRef(null),{virtualItems:X,totalHeight:K}=le({containerRef:j,itemCount:x.length,itemHeight:C,overscan:5}),_="hcb-listbox",Q=e>=0&&e<x.length?`${P}${x[e]?.node.id??""}`:void 0;d.useEffect(()=>{function p(f){const m=E.current;m&&(m.contains(f.target)||(t(!1),a(""),o(-1)))}return document.addEventListener("mousedown",p),()=>{document.removeEventListener("mousedown",p)}},[]),d.useEffect(()=>{n&&j.current&&(j.current.scrollTop=0)},[n]),d.useEffect(()=>{if(e<0||!j.current||x.length===0)return;const p=j.current,f=e*C,m=f+C,$=p.scrollTop,ee=$+p.clientHeight;f<$?requestAnimationFrame(()=>{p.scrollTop=f}):m>ee&&requestAnimationFrame(()=>{p.scrollTop=m-p.clientHeight})},[e,C,x.length]),d.useEffect(()=>{j.current&&(j.current.scrollTop=0)},[u]);const Y=d.useCallback(p=>{if(p.target===T.current){n||t(!0);return}T.current?.focus(),t(f=>{const m=!f;return m||(a(""),o(-1)),m})},[n]),V=d.useCallback(p=>{p.stopPropagation(),T.current?.focus(),t(f=>{const m=!f;return m||(a(""),o(-1)),m})},[]),J=d.useCallback(p=>{const f=p.target.value;a(f),o(-1),n||t(!0)},[n]),Z=d.useCallback(p=>{const f=x.length;switch(p.key){case"ArrowDown":{p.preventDefault(),n?o(m=>Math.min(m+1,f-1)):(t(!0),o(0));break}case"ArrowUp":{p.preventDefault(),n&&o(m=>Math.max(m-1,0));break}case"ArrowRight":{if(!u&&n&&e>=0){p.preventDefault();const m=x[e];m&&m.node.hasChildren&&!m.node.isOpen&&N(m.node.id)}break}case"ArrowLeft":{if(!u&&n&&e>=0){p.preventDefault();const m=x[e];m&&m.node.isOpen&&N(m.node.id)}break}case"Enter":{if(p.preventDefault(),!n)t(!0),o(0);else if(e>=0){const m=x[e];m&&g(m.node.id)}break}case"Home":{p.preventDefault(),n&&f>0&&o(0);break}case"End":{p.preventDefault(),n&&f>0&&o(f-1);break}case"Escape":{p.preventDefault(),u?(a(""),o(-1)):(t(!1),o(-1));break}}},[n,u,e,x,N,g]);return r.jsxs("div",{ref:E,className:"relative w-full max-w-lg",children:[r.jsxs("div",{onClick:Y,className:["flex min-h-[2.5rem] w-full cursor-text flex-wrap items-center gap-1","rounded-md border bg-white px-3 py-1.5","transition-all duration-150",n?"border-blue-500 shadow-sm":"border-gray-300 hover:border-gray-400"].join(" "),children:[v.length>0&&r.jsx(G,{selectedNodes:v,onRemove:w}),r.jsx("input",{ref:T,type:"text",role:"combobox","aria-expanded":n,"aria-haspopup":"listbox","aria-controls":n?_:void 0,"aria-activedescendant":n?Q:void 0,"aria-label":"Select items from hierarchical list",value:i,onChange:J,onKeyDown:Z,placeholder:v.length>0?"":"Type to search or click to browse…",autoComplete:"off",className:["min-w-[120px] flex-1 border-0 bg-transparent py-1 text-sm","text-gray-900 outline-none placeholder:text-gray-400"].join(" ")}),r.jsx("button",{type:"button",tabIndex:-1,onClick:V,className:"ml-auto flex-shrink-0 rounded p-1 text-gray-400 hover:text-gray-600 transition-colors","aria-label":n?"Close dropdown":"Open dropdown",children:r.jsx("svg",{className:["h-4 w-4 transition-transform duration-200",n?"rotate-180":""].join(" "),fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",strokeWidth:2,"aria-hidden":"true",children:r.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M19 9l-7 7-7-7"})})})]}),n&&r.jsxs("div",{className:"absolute left-0 top-full z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg",children:[u&&x.length===0&&r.jsxs("div",{className:"px-4 py-3 text-center text-sm text-gray-500",role:"status",children:["No results for “",i,"”"]}),r.jsx("div",{ref:j,id:_,role:"listbox","aria-label":"Hierarchical options","aria-multiselectable":"true",className:"relative overflow-y-auto",style:{maxHeight:"320px",minHeight:"100px"},children:x.length>0&&r.jsx("div",{className:"relative w-full",style:{height:`${K}px`},children:X.map(p=>{const f=x[p.index];return f?r.jsx(W,{flatNode:f,offsetTop:p.offsetTop,rowHeight:C,isHighlighted:p.index===e,optionId:`${P}${f.node.id}`,onToggleExpand:N,onToggleSelect:g,searchQuery:u?i:void 0},f.node.id):null})})}),!u&&c.length===0&&!k&&r.jsx("div",{className:"px-4 py-3 text-center text-sm text-gray-400",role:"status",children:"No items available"}),k&&r.jsxs("div",{role:"alert",className:"flex items-center justify-between border-t border-red-500/20 bg-red-50 px-3 py-2 text-sm text-red-600",children:[r.jsx("span",{children:k}),r.jsx("button",{type:"button",tabIndex:-1,onClick:b,className:"ml-2 text-xs font-medium underline hover:text-red-500","aria-label":"Dismiss error",children:"Dismiss"})]})]})]})}B.__docgenInfo={description:`HierarchicalCombobox — the root component.\r
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
 7. SearchFiltering – Pre-loaded tree to demonstrate search with ancestry context`}}},decorators:[s=>r.jsx("div",{className:"w-[480px]",children:r.jsx(s,{})})]},I={};function me(){const t=[];for(let e=0;e<200;e++){const o=S(`group-${e}`,`Group ${e+1}`,!0),i=[];for(let a=0;a<50;a++)i.push(S(`group-${e}-item-${a}`,`Group ${e+1} › Item ${a+1}`,!1));o.children=i,o.isOpen=!0,t.push(o)}return t}const R={args:{initialRootNodes:me()}};function fe(s,n){return new Promise(e=>{setTimeout(()=>{const o=4+Math.floor(Math.random()*5),i=[];for(let a=0;a<o;a++)i.push(S(`${s}-${a}`,`${n} › Item ${a+1}`,Math.random()>.5));e(i)},2e3)})}const L={args:{fetchChildrenFn:fe}};function ge(s,n){return new Promise((e,o)=>{setTimeout(()=>{o(new Error("Network error: unable to load children. Please try again."))},800)})}const D={args:{fetchChildrenFn:ge}},A={decorators:[s=>r.jsxs("div",{className:"w-[480px] rounded-lg border-2 border-neutral-900 bg-white p-lg",style:{forcedColorAdjust:"auto"},children:[r.jsx("p",{className:"mb-sm text-xs font-semibold uppercase tracking-wide text-neutral-500",children:"High-contrast mode preview"}),r.jsx(s,{})]})],parameters:{a11y:{config:{rules:[{id:"color-contrast",enabled:!0}]}}}},M={decorators:[s=>r.jsxs("div",{className:"w-[480px]",children:[r.jsxs("div",{className:"mb-md rounded-lg bg-primary-50 p-md text-xs leading-relaxed text-primary-800",children:[r.jsx("p",{className:"mb-xs font-semibold",children:"Keyboard-only test instructions:"}),r.jsxs("ul",{className:"list-inside list-disc space-y-0.5",children:[r.jsxs("li",{children:[r.jsx("kbd",{className:"rounded bg-primary-100 px-1 font-mono",children:"Tab"})," to focus the input"]}),r.jsxs("li",{children:[r.jsx("kbd",{className:"rounded bg-primary-100 px-1 font-mono",children:"↓"})," opens dropdown & moves highlight down"]}),r.jsxs("li",{children:[r.jsx("kbd",{className:"rounded bg-primary-100 px-1 font-mono",children:"↑"})," moves highlight up"]}),r.jsxs("li",{children:[r.jsx("kbd",{className:"rounded bg-primary-100 px-1 font-mono",children:"→"})," expands a collapsed branch"]}),r.jsxs("li",{children:[r.jsx("kbd",{className:"rounded bg-primary-100 px-1 font-mono",children:"←"})," collapses an expanded branch"]}),r.jsxs("li",{children:[r.jsx("kbd",{className:"rounded bg-primary-100 px-1 font-mono",children:"Enter"})," toggles selection on highlighted row"]}),r.jsxs("li",{children:[r.jsx("kbd",{className:"rounded bg-primary-100 px-1 font-mono",children:"Home"})," / ",r.jsx("kbd",{className:"rounded bg-primary-100 px-1 font-mono",children:"End"})," jump to first / last row"]}),r.jsxs("li",{children:[r.jsx("kbd",{className:"rounded bg-primary-100 px-1 font-mono",children:"Esc"})," clears search → closes dropdown"]}),r.jsx("li",{children:"Type to search; results show ancestry breadcrumbs"})]})]}),r.jsx(s,{})]})]};function be(){const s=["Engineering","Design","Product"],n=[];for(let t=0;t<s.length;t++){const e=s[t]??`Dept ${t}`,o=S(`dept-${t}`,e,!0);o.isOpen=!0;const i=["Frontend","Backend","Infrastructure"],a=[];for(let l=0;l<i.length;l++){const c=i[l]??`Team ${l}`,y=S(`dept-${t}-team-${l}`,c,!0);y.isOpen=!0;const v=[];for(let k=0;k<4;k++)v.push(S(`dept-${t}-team-${l}-member-${k}`,`${c} Member ${k+1}`,!1));y.children=v,a.push(y)}o.children=a,n.push(o)}return n}const O={args:{initialRootNodes:be()}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:"{}",...I.parameters?.docs?.source},description:{story:`Uses the built-in mock loader with 8 root departments.\r
Click any row to expand and lazy-load children after a 500ms delay.\r
This is the baseline interaction story.`,...I.parameters?.docs?.description}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    initialRootNodes: generateLargeDataset()
  }
}`,...R.parameters?.docs?.source},description:{story:`10,200 visible rows (200 open groups × 50 children + 200 roots).\r
The dropdown should scroll smoothly with no jank — all rendering\r
is handled by the math-based virtualizer.`,...R.parameters?.docs?.description}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    fetchChildrenFn: slowFetchChildren
  }
}`,...L.parameters?.docs?.source},description:{story:`Demonstrates loading state UX with a 2-second delay per expand.\r
Watch the skeleton animation while children load.`,...L.parameters?.docs?.description}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    fetchChildrenFn: failingFetchChildren
  }
}`,...D.parameters?.docs?.source},description:{story:`Every expand attempt fails with an error banner.\r
The dismiss button clears the error, and you can retry.`,...D.parameters?.docs?.description}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
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
}`,...A.parameters?.docs?.source},description:{story:`Renders the default combobox inside a wrapper that simulates\r
forced-colors / high-contrast media. The Accessibility panel\r
(powered by @storybook/addon-a11y) should report zero violations.\r

Manual check: borders, focus rings, and text should remain visible\r
against both light and dark system backgrounds.`,...A.parameters?.docs?.description}}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
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
}`,...M.parameters?.docs?.source},description:{story:`Instructions are displayed above the combobox so a reviewer can\r
verify every keyboard shortcut without needing a mouse.\r

The story itself is identical to Default — the value is in the\r
instructions that guide the tester through the keyboard flow.`,...M.parameters?.docs?.description}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    initialRootNodes: generateSearchableTree()
  }
}`,...O.parameters?.docs?.source},description:{story:`A pre-loaded 3-level tree for testing search with ancestry context.\r
Type "Frontend" to see it matched under every department with breadcrumbs.\r
Type "Member" to see leaf nodes with full ancestry paths.`,...O.parameters?.docs?.description}}};const ke=["Default","LargeDataset","AsyncLoading","ErrorState","HighContrast","KeyboardOnly","SearchFiltering"];export{L as AsyncLoading,I as Default,D as ErrorState,A as HighContrast,M as KeyboardOnly,R as LargeDataset,O as SearchFiltering,ke as __namedExportsOrder,ve as default};
