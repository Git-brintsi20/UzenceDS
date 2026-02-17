import{j as t}from"./jsx-runtime-u17CrQMm.js";import{r as c}from"./index-Bpooh2ix.js";import"./_commonjsHelpers-CqkleIqs.js";function te(s){const r=[],n=[];for(let e=s.length-1;e>=0;e--){const o=s[e];o&&n.push([o,0])}for(;n.length>0;){const e=n.pop();if(!e)break;const[o,a]=e;if(r.push({node:o,depth:a}),o.isOpen&&o.children.length>0)for(let i=o.children.length-1;i>=0;i--){const l=o.children[i];l&&n.push([l,a+1])}}return r}function F(s,r){const n=[...s];for(;n.length>0;){const e=n.pop();if(e){if(e.id===r)return e;for(let o=e.children.length-1;o>=0;o--){const a=e.children[o];a&&n.push(a)}}}return null}function S(s,r,n=!1){return{id:s,label:r,children:[],isOpen:!1,isSelected:!1,isIndeterminate:!1,isLoading:!1,hasChildren:n}}function re(s,r){const n=[],e=r.toLowerCase().trim();if(e==="")return n;function o(a,i){for(const l of a)l.label.toLowerCase().includes(e)&&n.push({node:l,depth:0,breadcrumb:i.length>0?i.join(" › "):void 0}),l.children.length>0&&o(l.children,[...i,l.label])}return o(s,[]),n}const ne=500;function oe(s,r){const n=4+Math.floor(Math.random()*5),e=[];for(let o=0;o<n;o++){const a=`${s}-${o}`,i=`${r} › Item ${o+1}`,l=Math.random()>.5;e.push(S(a,i,l))}return e}function se(s,r){return new Promise(n=>{setTimeout(()=>{const e=oe(s,r);n(e)},ne)})}function ae(){return["Engineering","Design","Product","Marketing","Sales","Operations","Finance","Human Resources"].map((r,n)=>S(`root-${n}`,r,!0))}function ie(s){const r=s?.fetchChildrenFn??se,[n,e]=c.useState(()=>s?.initialRootNodes??ae()),[o,a]=c.useState(null),i=c.useMemo(()=>te(n),[n]),l=c.useCallback((g,w)=>{e(b=>{function u(y){return y.map(h=>{const k={...h,children:u(h.children)};return k.id===g?w(k):k})}return u(b)})},[]),d=c.useCallback(g=>{const w=F(n,g);if(w){if(w.children.length>0){l(g,b=>({...b,isOpen:!b.isOpen}));return}w.hasChildren&&!w.isLoading&&(a(null),l(g,b=>({...b,isLoading:!0})),r(g,w.label).then(b=>{l(g,u=>({...u,children:b,isLoading:!1,isOpen:!0}))},b=>{l(g,y=>({...y,isLoading:!1}));const u=b instanceof Error?b.message:"Failed to load children";a(u)}))}},[n,l,r]),x=c.useCallback(g=>{e(w=>{const b=z(w),u=F(b,g);if(!u)return w;const y=!u.isSelected;return U(u,y),W(b),b})},[]),v=c.useMemo(()=>{const g=[];function w(b){for(const u of b)u.isSelected&&g.push({id:u.id,label:u.label}),!u.isSelected&&u.children.length>0&&w(u.children)}return w(n),g},[n]),N=c.useCallback(g=>{x(g)},[x]),C=c.useCallback(()=>{a(null)},[]);return{flatNodes:i,rootNodes:n,selectedNodes:v,error:o,toggleExpand:d,toggleSelect:x,deselectNode:N,clearError:C}}function z(s){return s.map(r=>({...r,children:z(r.children)}))}function U(s,r){s.isSelected=r,s.isIndeterminate=!1;for(const n of s.children)U(n,r)}function W(s){let r=0,n=0;for(const e of s){if(e.children.length>0){const[o,a]=W(e.children),i=o===a&&a>0,l=o===0,d=e.children.some(x=>x.isIndeterminate);i?(e.isSelected=!0,e.isIndeterminate=!1):l&&!d?(e.isSelected=!1,e.isIndeterminate=!1):(e.isSelected=!1,e.isIndeterminate=!0)}n++,e.isSelected&&r++}return[r,n]}function le({containerRef:s,itemCount:r,itemHeight:n,overscan:e=5}){const[o,a]=c.useState(0),[i,l]=c.useState(320),d=c.useRef(0),x=c.useRef(null),v=c.useCallback(()=>{const h=s.current;if(!h)return;const k=h.scrollTop;d.current=k,x.current!==null&&cancelAnimationFrame(x.current),x.current=requestAnimationFrame(()=>{a(k),x.current=null})},[s]);c.useEffect(()=>{const h=s.current;if(!h)return;h.scrollTop!==d.current&&(a(h.scrollTop),d.current=h.scrollTop),l(h.clientHeight),h.addEventListener("scroll",v,{passive:!0});const k=new ResizeObserver(j=>{for(const O of j){const T=O.contentRect.height;l(H=>Math.abs(T-H)>1?T:H)}});return k.observe(h),()=>{h.removeEventListener("scroll",v),k.disconnect(),x.current!==null&&cancelAnimationFrame(x.current)}},[s,v]);const N=r*n,C=n,g=Math.floor(o/C),w=Math.ceil(i/C)+1,b=Math.max(0,g-e),u=Math.min(r-1,g+w+e),y=[];if(r>0)for(let h=b;h<=u;h++)y.push({index:h,offsetTop:h*C});return{virtualItems:y,totalHeight:N}}const de=20;function G({flatNode:s,offsetTop:r,rowHeight:n,isHighlighted:e,optionId:o,onToggleExpand:a,onToggleSelect:i,searchQuery:l}){const{node:d,depth:x}=s,v=l!==void 0,N=c.useCallback(u=>{u.stopPropagation(),u.preventDefault(),a(d.id)},[d.id,a]),C=c.useCallback(u=>{u.stopPropagation()},[]),g=c.useCallback(()=>{i(d.id)},[d.id,i]),w=c.useCallback(()=>{i(d.id)},[d.id,i]),b=v?12:12+x*de;return t.jsxs("div",{id:o,role:"option","aria-selected":d.isSelected,"aria-expanded":!v&&d.hasChildren?d.isOpen:void 0,onClick:w,className:["absolute left-0 right-0 flex cursor-pointer items-center text-sm","transition-colors duration-75",e?"bg-blue-50":"hover:bg-gray-50"].join(" "),style:{height:`${n}px`,top:`${r}px`,paddingLeft:`${b}px`,paddingRight:"12px"},children:[!v&&(d.hasChildren?t.jsx("button",{type:"button",tabIndex:-1,onClick:N,onMouseDown:u=>u.preventDefault(),className:["mr-1 flex h-5 w-5 flex-shrink-0 items-center justify-center","rounded text-gray-500 hover:bg-gray-100 hover:text-gray-700","transition-colors duration-100"].join(" "),"aria-label":d.isOpen?`Collapse ${d.label}`:`Expand ${d.label}`,"aria-hidden":"true",children:d.isLoading?t.jsx("span",{className:"block h-3 w-3 animate-pulse rounded-sm bg-gray-300"}):t.jsx("svg",{className:["h-3.5 w-3.5 transition-transform duration-150",d.isOpen?"rotate-90":""].join(" "),fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",strokeWidth:2.5,"aria-hidden":"true",children:t.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M9 5l7 7-7 7"})})}):t.jsx("span",{className:"mr-1 inline-block h-5 w-5 flex-shrink-0","aria-hidden":"true"})),t.jsx("input",{type:"checkbox",tabIndex:-1,checked:d.isSelected,ref:u=>{u&&(u.indeterminate=d.isIndeterminate)},onClick:C,onChange:g,className:["mr-2 h-4 w-4 flex-shrink-0 cursor-pointer rounded","border-gray-300 text-blue-600","focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"].join(" "),"aria-label":`Select ${d.label}`}),t.jsxs("div",{className:"flex min-w-0 flex-1 flex-col justify-center overflow-hidden",children:[t.jsx("span",{className:["truncate",d.isSelected?"font-medium text-gray-900":"text-gray-700"].join(" "),children:l?t.jsx(ce,{text:d.label,query:l}):d.label}),s.breadcrumb&&t.jsx("span",{className:"truncate text-xs leading-tight text-gray-400",children:s.breadcrumb})]})]})}function ce({text:s,query:r}){const n=s.toLowerCase(),e=r.toLowerCase().trim(),o=n.indexOf(e);if(o===-1||e==="")return t.jsx(t.Fragment,{children:s});const a=s.slice(0,o),i=s.slice(o,o+e.length),l=s.slice(o+e.length);return t.jsxs(t.Fragment,{children:[a,t.jsx("mark",{className:"rounded-sm bg-yellow-100 text-gray-900",children:i}),l]})}G.__docgenInfo={description:`TreeRow — a single absolutely-positioned row inside the virtualized list.\r
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
 - Ancestry breadcrumb is shown below the label (if available)`}}};const P=5;function B({selectedNodes:s,onRemove:r}){if(s.length===0)return null;const n=s.slice(0,P),e=s.length-P;return t.jsxs(t.Fragment,{children:[n.map(o=>t.jsx(he,{nodeId:o.id,label:o.label,onRemove:r},o.id)),e>0&&t.jsxs("span",{className:"inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600",children:["+",e," more"]})]})}function he({nodeId:s,label:r,onRemove:n}){const e=c.useCallback(o=>{o.stopPropagation(),n(s)},[s,n]);return t.jsxs("span",{className:"inline-flex items-center gap-1 rounded-md bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800",children:[t.jsx("span",{className:"max-w-24 truncate",children:r}),t.jsx("button",{type:"button",onClick:e,className:"flex h-3.5 w-3.5 items-center justify-center rounded-full text-blue-600 hover:bg-blue-200 hover:text-blue-900","aria-label":`Remove ${r}`,children:t.jsx("svg",{className:"h-3 w-3",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",strokeWidth:2.5,children:t.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M6 18L18 6M6 6l12 12"})})})]})}B.__docgenInfo={description:`SelectedTags — pill-style tags displayed inside the combobox input area.\r
\r
Each tag shows the node's label and an × button to deselect it.\r
When more than MAX_VISIBLE_TAGS are selected, the overflow is\r
collapsed into a "+N more" badge.\r
\r
Returns a Fragment so the parent container's flex-wrap layout\r
can interleave tags with the search input on the same line.`,methods:[],displayName:"SelectedTags",props:{selectedNodes:{required:!0,tsType:{name:"Array",elements:[{name:"SelectedNode"}],raw:"SelectedNode[]"},description:""},onRemove:{required:!0,tsType:{name:"signature",type:"function",raw:"(nodeId: string) => void",signature:{arguments:[{type:{name:"string"},name:"nodeId"}],return:{name:"void"}}},description:""}}};const ue=32,pe=44,q="hcb-option-";function X(s={}){const[r,n]=c.useState(!1),[e,o]=c.useState(-1),[a,i]=c.useState(""),l={};s.initialRootNodes&&(l.initialRootNodes=s.initialRootNodes),s.fetchChildrenFn&&(l.fetchChildrenFn=s.fetchChildrenFn);const{flatNodes:d,rootNodes:x,selectedNodes:v,error:N,toggleExpand:C,toggleSelect:g,deselectNode:w,clearError:b}=ie(l),u=c.useMemo(()=>a.trim().length>0?re(x,a):[],[x,a]),y=a.trim().length>0,h=c.useMemo(()=>(y?u:d).filter(f=>f&&f.node&&f.node.id),[y,u,d]),k=y?pe:ue,j=c.useRef(null),O=c.useRef(null),T=c.useRef(null),{virtualItems:H,totalHeight:K}=le({containerRef:j,itemCount:h.length,itemHeight:k,overscan:10}),_="hcb-listbox",Q=e>=0&&e<h.length?`${q}${h[e]?.node.id??""}`:void 0;c.useEffect(()=>{function p(f){const m=O.current;m&&(m.contains(f.target)||(n(!1),i(""),o(-1)))}return document.addEventListener("mousedown",p),()=>{document.removeEventListener("mousedown",p)}},[]),c.useEffect(()=>{r&&j.current&&(j.current.scrollTop=0)},[r]),c.useEffect(()=>{if(e<0||!j.current||h.length===0)return;const p=j.current,f=e*k,m=f+k,$=p.scrollTop,ee=$+p.clientHeight;f<$?requestAnimationFrame(()=>{p.scrollTop=f}):m>ee&&requestAnimationFrame(()=>{p.scrollTop=m-p.clientHeight})},[e,k,h.length]),c.useEffect(()=>{j.current&&(j.current.scrollTop=0)},[y]);const Y=c.useCallback(p=>{if(p.target===T.current){r||n(!0);return}T.current?.focus(),n(f=>{const m=!f;return m||(i(""),o(-1)),m})},[r]),V=c.useCallback(p=>{p.stopPropagation(),T.current?.focus(),n(f=>{const m=!f;return m||(i(""),o(-1)),m})},[]),J=c.useCallback(p=>{const f=p.target.value;i(f),o(-1),r||n(!0)},[r]),Z=c.useCallback(p=>{const f=h.length;switch(p.key){case"ArrowDown":{p.preventDefault(),r?o(m=>Math.min(m+1,f-1)):(n(!0),o(0));break}case"ArrowUp":{p.preventDefault(),r&&o(m=>Math.max(m-1,0));break}case"ArrowRight":{if(!y&&r&&e>=0){p.preventDefault();const m=h[e];m&&m.node.hasChildren&&!m.node.isOpen&&C(m.node.id)}break}case"ArrowLeft":{if(!y&&r&&e>=0){p.preventDefault();const m=h[e];m&&m.node.isOpen&&C(m.node.id)}break}case"Enter":{if(p.preventDefault(),!r)n(!0),o(0);else if(e>=0){const m=h[e];m&&g(m.node.id)}break}case"Home":{p.preventDefault(),r&&f>0&&o(0);break}case"End":{p.preventDefault(),r&&f>0&&o(f-1);break}case"Escape":{p.preventDefault(),y?(i(""),o(-1)):(n(!1),o(-1));break}}},[r,y,e,h,C,g]);return t.jsxs("div",{ref:O,className:"relative w-full max-w-lg",children:[t.jsxs("div",{onClick:Y,className:["flex min-h-[2.5rem] w-full cursor-text flex-wrap items-center gap-1","rounded-md border bg-white px-3 py-1.5","transition-all duration-150",r?"border-blue-500 shadow-sm":"border-gray-300 hover:border-gray-400"].join(" "),children:[v.length>0&&t.jsx(B,{selectedNodes:v,onRemove:w}),t.jsx("input",{ref:T,type:"text",role:"combobox","aria-expanded":r,"aria-haspopup":"listbox","aria-controls":r?_:void 0,"aria-activedescendant":r?Q:void 0,"aria-label":"Select items from hierarchical list",value:a,onChange:J,onKeyDown:Z,placeholder:v.length>0?"":"Type to search or click to browse…",autoComplete:"off",className:["min-w-[120px] flex-1 border-0 bg-transparent py-1 text-sm","text-gray-900 outline-none placeholder:text-gray-400"].join(" ")}),t.jsx("button",{type:"button",tabIndex:-1,onClick:V,className:"ml-auto flex-shrink-0 rounded p-1 text-gray-400 hover:text-gray-600 transition-colors","aria-label":r?"Close dropdown":"Open dropdown",children:t.jsx("svg",{className:["h-4 w-4 transition-transform duration-200",r?"rotate-180":""].join(" "),fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",strokeWidth:2,"aria-hidden":"true",children:t.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M19 9l-7 7-7-7"})})})]}),r&&t.jsxs("div",{className:"absolute left-0 top-full z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg",children:[y&&h.length===0&&t.jsxs("div",{className:"px-4 py-3 text-center text-sm text-gray-500",role:"status",children:["No results for “",a,"”"]}),t.jsx("div",{ref:j,id:_,role:"listbox","aria-label":"Hierarchical options","aria-multiselectable":"true",className:"relative overflow-y-auto overflow-x-hidden",style:{maxHeight:"320px",minHeight:"50px"},children:h.length>0&&t.jsx("div",{className:"relative w-full",style:{height:`${K}px`},children:H.map(p=>{const f=h[p.index];return f?t.jsx(G,{flatNode:f,offsetTop:p.offsetTop,rowHeight:k,isHighlighted:p.index===e,optionId:`${q}${f.node.id}`,onToggleExpand:C,onToggleSelect:g,searchQuery:y?a:void 0},f.node.id):null})})}),!y&&d.length===0&&!N&&t.jsx("div",{className:"px-4 py-3 text-center text-sm text-gray-400",role:"status",children:"No items available"}),N&&t.jsxs("div",{role:"alert",className:"flex items-center justify-between border-t border-red-500/20 bg-red-50 px-3 py-2 text-sm text-red-600",children:[t.jsx("span",{children:N}),t.jsx("button",{type:"button",tabIndex:-1,onClick:b,className:"ml-2 text-xs font-medium underline hover:text-red-500","aria-label":"Dismiss error",children:"Dismiss"})]})]})]})}X.__docgenInfo={description:`HierarchicalCombobox — the root component.\r
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
  Escape     → clears search query, then closes dropdown`,methods:[],displayName:"Combobox"};const ve={title:"Components/Combobox",component:X,parameters:{layout:"centered",docs:{description:{component:`Storybook stories for the HierarchicalCombobox.\r

Seven stories cover the key scenarios:\r
 1. Default        – Small dataset (8 root departments, lazy-load children)\r
 2. LargeDataset   – 10,000 pre-loaded items to prove custom virtualization\r
 3. AsyncLoading   – Exaggerated network latency (2 seconds) per expand\r
 4. ErrorState     – Every expand triggers a simulated API failure\r
 5. HighContrast   – Verifies readability in forced-colors / high-contrast mode\r
 6. KeyboardOnly   – Opens with focus so keyboard-only usage can be demoed\r
 7. SearchFiltering – Pre-loaded tree to demonstrate search with ancestry context`}}},decorators:[s=>t.jsx("div",{className:"w-[480px]",children:t.jsx(s,{})})]},E={};function me(){const n=[];for(let e=0;e<200;e++){const o=S(`group-${e}`,`Group ${e+1}`,!0),a=[];for(let i=0;i<50;i++)a.push(S(`group-${e}-item-${i}`,`Group ${e+1} › Item ${i+1}`,!1));o.children=a,o.isOpen=!0,n.push(o)}return n}const I={args:{initialRootNodes:me()}};function fe(s,r){return new Promise(e=>{setTimeout(()=>{const o=4+Math.floor(Math.random()*5),a=[];for(let i=0;i<o;i++)a.push(S(`${s}-${i}`,`${r} › Item ${i+1}`,Math.random()>.5));e(a)},2e3)})}const R={args:{fetchChildrenFn:fe}};function ge(s,r){return new Promise((e,o)=>{setTimeout(()=>{o(new Error("Network error: unable to load children. Please try again."))},800)})}const L={args:{fetchChildrenFn:ge}},D={decorators:[s=>t.jsxs("div",{className:"w-[480px] rounded-lg border-2 border-neutral-900 bg-white p-lg",style:{forcedColorAdjust:"auto"},children:[t.jsx("p",{className:"mb-sm text-xs font-semibold uppercase tracking-wide text-neutral-500",children:"High-contrast mode preview"}),t.jsx(s,{})]})],parameters:{a11y:{config:{rules:[{id:"color-contrast",enabled:!0}]}}}},A={decorators:[s=>t.jsxs("div",{className:"w-[480px]",children:[t.jsxs("div",{className:"mb-md rounded-lg bg-primary-50 p-md text-xs leading-relaxed text-primary-800",children:[t.jsx("p",{className:"mb-xs font-semibold",children:"Keyboard-only test instructions:"}),t.jsxs("ul",{className:"list-inside list-disc space-y-0.5",children:[t.jsxs("li",{children:[t.jsx("kbd",{className:"rounded bg-primary-100 px-1 font-mono",children:"Tab"})," to focus the input"]}),t.jsxs("li",{children:[t.jsx("kbd",{className:"rounded bg-primary-100 px-1 font-mono",children:"↓"})," opens dropdown & moves highlight down"]}),t.jsxs("li",{children:[t.jsx("kbd",{className:"rounded bg-primary-100 px-1 font-mono",children:"↑"})," moves highlight up"]}),t.jsxs("li",{children:[t.jsx("kbd",{className:"rounded bg-primary-100 px-1 font-mono",children:"→"})," expands a collapsed branch"]}),t.jsxs("li",{children:[t.jsx("kbd",{className:"rounded bg-primary-100 px-1 font-mono",children:"←"})," collapses an expanded branch"]}),t.jsxs("li",{children:[t.jsx("kbd",{className:"rounded bg-primary-100 px-1 font-mono",children:"Enter"})," toggles selection on highlighted row"]}),t.jsxs("li",{children:[t.jsx("kbd",{className:"rounded bg-primary-100 px-1 font-mono",children:"Home"})," / ",t.jsx("kbd",{className:"rounded bg-primary-100 px-1 font-mono",children:"End"})," jump to first / last row"]}),t.jsxs("li",{children:[t.jsx("kbd",{className:"rounded bg-primary-100 px-1 font-mono",children:"Esc"})," clears search → closes dropdown"]}),t.jsx("li",{children:"Type to search; results show ancestry breadcrumbs"})]})]}),t.jsx(s,{})]})]};function be(){const s=["Engineering","Design","Product"],r=[];for(let n=0;n<s.length;n++){const e=s[n]??`Dept ${n}`,o=S(`dept-${n}`,e,!0);o.isOpen=!0;const a=["Frontend","Backend","Infrastructure"],i=[];for(let l=0;l<a.length;l++){const d=a[l]??`Team ${l}`,x=S(`dept-${n}-team-${l}`,d,!0);x.isOpen=!0;const v=[];for(let N=0;N<4;N++)v.push(S(`dept-${n}-team-${l}-member-${N}`,`${d} Member ${N+1}`,!1));x.children=v,i.push(x)}o.children=i,r.push(o)}return r}const M={args:{initialRootNodes:be()}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:"{}",...E.parameters?.docs?.source},description:{story:`Uses the built-in mock loader with 8 root departments.\r
Click any row to expand and lazy-load children after a 500ms delay.\r
This is the baseline interaction story.`,...E.parameters?.docs?.description}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    initialRootNodes: generateLargeDataset()
  }
}`,...I.parameters?.docs?.source},description:{story:`10,200 visible rows (200 open groups × 50 children + 200 roots).\r
The dropdown should scroll smoothly with no jank — all rendering\r
is handled by the math-based virtualizer.`,...I.parameters?.docs?.description}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    fetchChildrenFn: slowFetchChildren
  }
}`,...R.parameters?.docs?.source},description:{story:`Demonstrates loading state UX with a 2-second delay per expand.\r
Watch the skeleton animation while children load.`,...R.parameters?.docs?.description}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    fetchChildrenFn: failingFetchChildren
  }
}`,...L.parameters?.docs?.source},description:{story:`Every expand attempt fails with an error banner.\r
The dismiss button clears the error, and you can retry.`,...L.parameters?.docs?.description}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
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
}`,...D.parameters?.docs?.source},description:{story:`Renders the default combobox inside a wrapper that simulates\r
forced-colors / high-contrast media. The Accessibility panel\r
(powered by @storybook/addon-a11y) should report zero violations.\r

Manual check: borders, focus rings, and text should remain visible\r
against both light and dark system backgrounds.`,...D.parameters?.docs?.description}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
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
}`,...A.parameters?.docs?.source},description:{story:`Instructions are displayed above the combobox so a reviewer can\r
verify every keyboard shortcut without needing a mouse.\r

The story itself is identical to Default — the value is in the\r
instructions that guide the tester through the keyboard flow.`,...A.parameters?.docs?.description}}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    initialRootNodes: generateSearchableTree()
  }
}`,...M.parameters?.docs?.source},description:{story:`A pre-loaded 3-level tree for testing search with ancestry context.\r
Type "Frontend" to see it matched under every department with breadcrumbs.\r
Type "Member" to see leaf nodes with full ancestry paths.`,...M.parameters?.docs?.description}}};const ke=["Default","LargeDataset","AsyncLoading","ErrorState","HighContrast","KeyboardOnly","SearchFiltering"];export{R as AsyncLoading,E as Default,L as ErrorState,D as HighContrast,A as KeyboardOnly,I as LargeDataset,M as SearchFiltering,ke as __namedExportsOrder,ve as default};
