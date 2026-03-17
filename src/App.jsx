import { useState, useRef, useEffect } from "react";
import * as api from "./api.js";

const BIND = [
  { id: "none", name: "None", price: 0, icon: "📋" },
  { id: "spiral", name: "Spiral", price: 25, icon: "🔗" },
  { id: "staple", name: "Staple", price: 10, icon: "📌" },
  { id: "perfect", name: "Perfect", price: 60, icon: "📖" },
  { id: "hardcover", name: "Hard", price: 150, icon: "📕" },
];

const P = (label, active, fn) => <button key={label} onClick={fn} style={{ padding:"7px 11px",borderRadius:8,fontSize:11,fontWeight:500,cursor:"pointer",border:`1.5px solid ${active?"#FF6B35":"#ddd"}`,background:active?"#FFF3ED":"#fff",color:active?"#FF6B35":"#555",whiteSpace:"nowrap" }}>{label}</button>;

function Stepper({value,onChange,label,sub}){const v=parseInt(value)||1;const B=(t,fn,d)=><button onClick={fn} disabled={d} style={{width:30,border:"none",background:d?"#f5f5f5":"#FFF3ED",color:d?"#ccc":"#FF6B35",fontSize:15,fontWeight:700,cursor:d?"not-allowed":"pointer",flexShrink:0,padding:0}}>{t}</button>;return<div style={{flex:1,minWidth:0}}><label style={{fontSize:12,fontWeight:600,color:"#999",display:"block",marginBottom:3}}>{label} {sub&&<span style={{color:"#16a34a"}}>{sub}</span>}</label><div style={{display:"flex",border:"1.5px solid #ddd",borderRadius:8,overflow:"hidden",height:34}}>{B("−",()=>onChange(Math.max(1,v-1)),v<=1)}<input type="number" inputMode="numeric" min="1" value={value} onChange={e=>{const x=e.target.value;onChange(x===""?"":Math.max(1,parseInt(x)||1));}} onBlur={()=>{if(!value||value<1)onChange(1);}} style={{flex:1,border:"none",borderLeft:"1px solid #ddd",borderRight:"1px solid #ddd",fontSize:16,fontWeight:600,textAlign:"center",outline:"none",minWidth:0,padding:"0 2px",background:"transparent"}} />{B("+",()=>onChange(v+1),false)}</div></div>;}

function Progress({step}){return<div style={{display:"flex",alignItems:"center",marginBottom:24}}>{["Upload","Address","Payment","Done"].map((s,i)=><div key={s} style={{flex:1,display:"flex",alignItems:"center"}}><div style={{display:"flex",flexDirection:"column",alignItems:"center",flex:1}}><div style={{width:26,height:26,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,background:i<=step?"linear-gradient(135deg,#FF6B35,#FF8C42)":"#eee",color:i<=step?"#fff":"#bbb"}}>{i+1}</div><span style={{fontSize:9,marginTop:2,color:i<=step?"#FF6B35":"#bbb",fontWeight:500}}>{s}</span></div>{i<3&&<div style={{flex:1,height:2,background:i<step?"#FF6B35":"#eee",marginBottom:14}}/>}</div>)}</div>;}

function Nav({user,setPage,page,onSignOut}){const[open,setOpen]=useState(false);const go=p=>{setPage(p);setOpen(false);};const items=[{k:"home",l:"Home",i:"🏠"},{k:"orders",l:"My Orders",i:"📦"},{k:"account",l:"My Account",i:"👤"},{k:"about",l:"About Us",i:"ℹ️"},{k:"contact",l:"Contact Us",i:"📞"}];return<><style>{`@media(min-width:769px){.mb{display:none!important}}@media(max-width:768px){.dk{display:none!important}.mb{display:flex!important}}`}</style><nav style={{background:"#fff",borderBottom:"1px solid #eee",position:"sticky",top:0,zIndex:50}}><div style={{maxWidth:1100,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 16px"}}><button onClick={()=>go("home")} style={{display:"flex",alignItems:"center",gap:8,border:"none",background:"none",cursor:"pointer",padding:0}}><div style={{width:32,height:32,borderRadius:8,background:"linear-gradient(135deg,#FF6B35,#FF8C42)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:15,flexShrink:0}}>P</div><span style={{fontSize:18,fontWeight:700,color:"#1a1a2e",fontFamily:"'DM Serif Display',Georgia,serif"}}>PrintKaaro</span></button><div className="dk" style={{display:"flex",alignItems:"center",gap:4}}>{items.slice(0,3).map(p=><button key={p.k} onClick={()=>go(p.k)} style={{padding:"6px 12px",borderRadius:6,fontSize:13,fontWeight:500,border:"none",cursor:"pointer",background:page===p.k?"#FFF3ED":"transparent",color:page===p.k?"#FF6B35":"#666"}}>{p.l}</button>)}{user?<div style={{display:"flex",alignItems:"center",gap:6,marginLeft:4}}><div style={{width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#FF6B35,#FF8C42)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:12,fontWeight:600}}>{user.name[0].toUpperCase()}</div><span style={{fontSize:12,color:"#333"}}>{user.name}</span></div>:<button onClick={()=>go("signin")} style={{marginLeft:4,padding:"6px 14px",borderRadius:6,fontSize:12,fontWeight:600,border:"2px solid #FF6B35",background:"#fff",color:"#FF6B35",cursor:"pointer"}}>Sign In</button>}</div><button className="mb" onClick={()=>setOpen(!open)} style={{display:"none",border:"none",background:"none",cursor:"pointer",padding:6,flexDirection:"column",gap:4}}><span style={{display:"block",width:20,height:2,borderRadius:1,background:open?"#FF6B35":"#333",transition:"all .2s",transform:open?"rotate(45deg) translate(4px,4px)":"none"}}/><span style={{display:"block",width:20,height:2,borderRadius:1,background:"#333",opacity:open?0:1,transition:"all .2s"}}/><span style={{display:"block",width:20,height:2,borderRadius:1,background:open?"#FF6B35":"#333",transition:"all .2s",transform:open?"rotate(-45deg) translate(4px,-4px)":"none"}}/></button></div></nav>{open&&<div onClick={()=>setOpen(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.3)",zIndex:60}}/>}<div style={{position:"fixed",top:0,right:0,width:250,height:"100%",background:"#fff",zIndex:70,transform:open?"translateX(0)":"translateX(100%)",transition:"transform .25s",boxShadow:open?"-2px 0 20px rgba(0,0,0,.08)":"none",display:"flex",flexDirection:"column",overflowY:"auto"}}><div style={{padding:"18px 14px",borderBottom:"1px solid #f0f0f0"}}>{user?<div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,#FF6B35,#FF8C42)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:15,fontWeight:700,flexShrink:0}}>{user.name[0].toUpperCase()}</div><div><div style={{fontSize:14,fontWeight:700}}>{user.name}</div><div style={{fontSize:11,color:"#999"}}>{user.phone}</div></div></div>:<button onClick={()=>go("signin")} style={{width:"100%",padding:10,borderRadius:8,border:"none",background:"linear-gradient(135deg,#FF6B35,#FF8C42)",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>Sign In / Sign Up</button>}</div><div style={{flex:1,padding:"4px 0"}}>{items.map(it=><button key={it.k} onClick={()=>go(it.k)} style={{width:"100%",padding:"11px 14px",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:8,fontSize:13,fontWeight:500,textAlign:"left",background:page===it.k?"#FFF3ED":"#fff",color:page===it.k?"#FF6B35":"#444",borderLeft:page===it.k?"3px solid #FF6B35":"3px solid transparent"}}><span>{it.i}</span>{it.l}</button>)}</div>{user&&<div style={{padding:"12px 14px",borderTop:"1px solid #f0f0f0"}}><button onClick={()=>{onSignOut();setOpen(false);}} style={{width:"100%",padding:9,borderRadius:8,border:"1.5px solid #ef4444",background:"#fff",color:"#ef4444",fontSize:12,fontWeight:600,cursor:"pointer"}}>Sign Out</button></div>}</div></>;}

function AuthPage({onAuth}){const[mode,setMode]=useState("signin");const[name,setName]=useState("");const[email,setEmail]=useState("");const[phone,setPhone]=useState("");const[pw,setPw]=useState("");const[err,setErr]=useState("");const[loading,setLoading]=useState(false);const go=async()=>{setErr("");if(mode==="signup"&&!name.trim())return setErr("Enter name");if(phone.length<10)return setErr("Valid phone required");if(pw.length<4)return setErr("Min 4 char password");setLoading(true);setErr("Connecting... (first time may take 30 sec)");try{let user;if(mode==="signup"){user=await api.signup(name.trim(),phone.trim(),email.trim(),pw);}else{user=await api.signin(phone.trim(),pw);}setErr("");onAuth(user);}catch(e){const m=e.message||"";setErr(m.includes("fetch")||m.includes("Network")?"Server waking up. Try again in 30s.":m);}finally{setLoading(false);}};const I={width:"100%",padding:"10px 12px",borderRadius:8,border:"1.5px solid #ddd",fontSize:16,outline:"none",boxSizing:"border-box"};return<div style={{minHeight:"80vh",display:"flex",alignItems:"center",justifyContent:"center",padding:16,background:"linear-gradient(135deg,#FFF9F5,#FFF0E8)"}}><div style={{width:"100%",maxWidth:380,background:"#fff",borderRadius:16,padding:"28px 20px",boxShadow:"0 12px 40px rgba(255,107,53,.06)"}}><div style={{textAlign:"center",marginBottom:20}}><div style={{width:44,height:44,borderRadius:12,background:"linear-gradient(135deg,#FF6B35,#FF8C42)",display:"inline-flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:18,fontWeight:800,marginBottom:10}}>P</div><h2 style={{fontSize:20,fontWeight:700,color:"#1a1a2e",margin:0}}>{mode==="signin"?"Welcome Back":"Create Account"}</h2><p style={{fontSize:12,color:"#888",marginTop:4}}>{mode==="signin"?"Sign in to track orders":"Join PrintKaaro"}</p></div>{mode==="signup"&&<><label style={{fontSize:12,fontWeight:600,color:"#999"}}>NAME</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" style={{...I,marginBottom:10,marginTop:3}}/></>}<label style={{fontSize:12,fontWeight:600,color:"#999"}}>PHONE</label><div style={{display:"flex",border:"1.5px solid #ddd",borderRadius:8,overflow:"hidden",marginBottom:10,marginTop:3}}><span style={{padding:"10px 8px",background:"#f8f8f8",fontSize:12,color:"#666",borderRight:"1px solid #ddd",flexShrink:0}}>+91</span><input value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,"").slice(0,10))} placeholder="9876543210" style={{flex:1,padding:"10px",border:"none",fontSize:16,outline:"none",minWidth:0}}/></div>{mode==="signup"&&<><label style={{fontSize:12,fontWeight:600,color:"#999"}}>EMAIL (optional)</label><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email@example.com" style={{...I,marginBottom:10,marginTop:3}}/></>}<label style={{fontSize:12,fontWeight:600,color:"#999"}}>PASSWORD</label><input value={pw} onChange={e=>setPw(e.target.value)} type="password" placeholder="Password" onKeyDown={e=>e.key==="Enter"&&go()} style={{...I,marginBottom:14,marginTop:3}}/>{err&&<p style={{color:loading?"#FF6B35":"#e53e3e",fontSize:11,textAlign:"center",marginBottom:8}}>{err}</p>}<button onClick={go} disabled={loading} style={{width:"100%",padding:12,borderRadius:10,border:"none",background:"linear-gradient(135deg,#FF6B35,#FF8C42)",color:"#fff",fontSize:14,fontWeight:700,cursor:loading?"wait":"pointer",opacity:loading?.7:1}}>{loading?"Connecting...":mode==="signin"?"Sign In":"Create Account"}</button><p style={{textAlign:"center",marginTop:14,fontSize:12,color:"#888"}}>{mode==="signin"?"No account? ":"Have one? "}<button onClick={()=>{setMode(mode==="signin"?"signup":"signin");setErr("");}} style={{color:"#FF6B35",fontWeight:600,border:"none",background:"none",cursor:"pointer",fontSize:12}}>{mode==="signin"?"Sign Up":"Sign In"}</button></p></div></div>;}

const PHOTO_SIZES=[
  {id:"passport",name:"Passport Size",price:3,desc:"2×2 inch (8 photos/sheet)"},
  {id:"stamp",name:"Stamp Size",price:3,desc:"1×1 inch (16 photos/sheet)"},
  {id:"4x6",name:"4×6 inch",price:8,desc:"Standard photo size"},
  {id:"5x7",name:"5×7 inch",price:15,desc:"Medium frame size"},
  {id:"8x10",name:"8×10 inch",price:30,desc:"Large frame size"},
  {id:"a4",name:"A4 Full Page",price:20,desc:"Full A4 sheet print"},
];
const FRAME_OPTS=[
  {id:"none",name:"No Frame",price:0,icon:"📷"},
  {id:"glass",name:"Glass Frame",price:80,icon:"🖼️"},
  {id:"empty",name:"Empty Frame",price:50,icon:"🪟"},
];

const MAX_FILE_MB=200;

function HomePage({onProceed}){
const[files,setFiles]=useState([]);
const[drag,setDrag]=useState(false);
const ref=useRef();

const isImage=(f)=>/\.(jpg|jpeg|png|gif|webp|bmp|heic)$/i.test(f.name)||f.type.startsWith("image/");

const countPages=(f,cb)=>{const r=new FileReader();r.onload=e=>{const s=new TextDecoder("latin1").decode(new Uint8Array(e.target.result));const m=s.match(/\/Type\s*\/Page[^s]/g);cb(Math.max(1,m?m.length:Math.ceil(f.size/30000)||1));};r.readAsArrayBuffer(f);};

const addFiles=(fileList)=>{const rejected=[];Array.from(fileList).forEach(f=>{
  const sizeMB=f.size/(1024*1024);
  if(sizeMB>MAX_FILE_MB){rejected.push(`${f.name} (${sizeMB.toFixed(1)}MB)`);return;}
  if(isImage(f)){
    const url=URL.createObjectURL(f);
    setFiles(prev=>[...prev,{file:f,type:"photo",preview:url,photoSize:"passport",qty:1,laminated:false,frame:"none"}]);
  } else if(f.type==="application/pdf"){
    countPages(f,pg=>{setFiles(prev=>[...prev,{file:f,type:"pdf",pages:pg,copies:1,clr:"bw",paper:"A4",sided:"double",bind:"none"}]);});
  }
});if(rejected.length>0)alert(`These files are too large (max ${MAX_FILE_MB}MB each):\n\n${rejected.join("\n")}\n\nTip: Compress PDFs at ilovepdf.com before uploading.`);};const updateFile=(idx,key,val)=>setFiles(prev=>prev.map((f,i)=>i===idx?{...f,[key]:val}:f));
const removeFile=(idx)=>setFiles(prev=>prev.filter((_,i)=>i!==idx));

const calcPrice=(f)=>{
  if(f.type==="photo"){
    const ps=PHOTO_SIZES.find(s=>s.id===f.photoSize)||PHOTO_SIZES[0];
    const fr=FRAME_OPTS.find(o=>o.id===f.frame)||FRAME_OPTS[0];
    const qty=parseInt(f.qty)||1;
    let price=ps.price*qty;
    if(f.laminated)price+=5*qty;
    price+=fr.price*qty;
    return price;
  }
  // New pricing: B&W both=0.75, B&W single=1, Color both=2, Color single=3
  let ppp;
  if(f.clr==="bw") ppp=f.sided==="double"?0.75:1;
  else ppp=f.sided==="double"?2:3;
  const bo=BIND.find(b=>b.id===f.bind);const pg=parseInt(f.pages)||1;const cp=parseInt(f.copies)||1;return Math.ceil(ppp*pg*cp+(bo?.price||0)*cp);
};
const totalPrice=files.reduce((s,f)=>s+calcPrice(f),0);
const del=totalPrice>=499?0:40;

return<div style={{background:"linear-gradient(180deg,#FFF9F5 0%,#FFF 40%)",minHeight:"80vh"}}>
<div style={{textAlign:"center",padding:"28px 16px 10px"}}>
<div style={{display:"inline-block",padding:"5px 14px",borderRadius:14,fontSize:12,fontWeight:600,background:"#FFF3ED",color:"#FF6B35",marginBottom:10}}>UPLOAD → CONFIGURE → PAY → DELIVERED</div>
<h1 style={{fontSize:"clamp(24px,6vw,38px)",fontWeight:700,color:"#1a1a2e",margin:"0 0 8px",lineHeight:1.2,fontFamily:"'DM Serif Display',Georgia,serif"}}>Documents & Photos<br/><span style={{background:"linear-gradient(135deg,#FF6B35,#FF8C42)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Printed & Delivered</span></h1>
<p style={{fontSize:"clamp(13px,3vw,15px)",color:"#888",maxWidth:400,margin:"0 auto"}}>Upload PDFs or photos, choose options, pay online.</p>
</div>
<div style={{maxWidth:560,margin:"0 auto",padding:"0 14px 36px"}}>

{/* Pricing Cards */}
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
<div style={{background:"#fff",borderRadius:10,padding:"12px 8px",border:"1px solid #eee",textAlign:"center"}}>
<div style={{fontSize:24,fontWeight:800,color:"#1a1a2e"}}>₹0.75<span style={{fontSize:12,fontWeight:500,color:"#999"}}>/page</span></div>
<div style={{fontSize:13,fontWeight:600,color:"#555",marginTop:2}}>B&W Both Sides</div>
</div>
<div style={{background:"#fff",borderRadius:10,padding:"12px 8px",border:"1px solid #eee",textAlign:"center"}}>
<div style={{fontSize:24,fontWeight:800,color:"#FF6B35"}}>₹2<span style={{fontSize:12,fontWeight:500,color:"#999"}}>/page</span></div>
<div style={{fontSize:13,fontWeight:600,color:"#555",marginTop:2}}>Color Both Sides</div>
</div>
<div style={{background:"#fff",borderRadius:10,padding:"12px 8px",border:"1px solid #eee",textAlign:"center"}}>
<div style={{fontSize:24,fontWeight:800,color:"#8b5cf6"}}>₹3<span style={{fontSize:12,fontWeight:500,color:"#999"}}>/piece</span></div>
<div style={{fontSize:13,fontWeight:600,color:"#555",marginTop:2}}>Photo Print</div>
</div>
</div>

<div style={{background:"linear-gradient(135deg,#1a1a2e,#16213e)",borderRadius:10,padding:"14px 16px",marginBottom:14,textAlign:"center"}}>
<p style={{fontSize:15,fontWeight:700,color:"#fff",margin:"0 0 2px"}}>🔥 B&W both sides just <span style={{color:"#FF8C42"}}>₹0.75/page!</span> Color both sides <span style={{color:"#FF8C42"}}>₹2/page!</span></p>
<p style={{fontSize:12,color:"#bbb",margin:0}}>Single side: B&W ₹1 | Color ₹3 per page</p>
</div>

{/* Upload Zone */}
<div onClick={()=>ref.current?.click()} onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);addFiles(e.dataTransfer.files);}} style={{border:`2px dashed ${drag?"#FF6B35":"#ccc"}`,borderRadius:10,padding:"18px 12px",textAlign:"center",cursor:"pointer",background:drag?"#FFF8F4":"#FAFAFA",marginBottom:14}}>
<input ref={ref} type="file" accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.bmp,.heic" multiple style={{display:"none"}} onChange={e=>{addFiles(e.target.files);e.target.value="";}}/>
<div style={{fontSize:28,marginBottom:4}}>📄 📷</div>
<p style={{fontSize:15,fontWeight:600,color:"#333",margin:0}}>{files.length>0?"+ Add more files":"Drop your PDFs or Photos here"}</p>
<p style={{fontSize:13,color:"#999",margin:"3px 0 0"}}>PDF for documents • JPG/PNG for photos • Multiple files</p>
</div>

{/* File Cards */}
{files.map((f,idx)=>{const price=calcPrice(f);

// ── PHOTO CARD ──
if(f.type==="photo"){const ps=PHOTO_SIZES.find(s=>s.id===f.photoSize)||PHOTO_SIZES[0];return<div key={idx} style={{background:"#fff",borderRadius:10,padding:"14px",border:"1px solid #eee",marginBottom:10}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
<div style={{display:"flex",alignItems:"center",gap:8,minWidth:0,flex:1}}>
{f.preview&&<img src={f.preview} style={{width:40,height:40,borderRadius:6,objectFit:"cover"}} alt=""/>}
<div style={{minWidth:0}}><p style={{fontSize:14,fontWeight:600,color:"#333",margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.file.name}</p><p style={{fontSize:12,color:"#8b5cf6",margin:0,fontWeight:600}}>📷 Photo Print</p></div></div>
<div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}><span style={{fontSize:16,fontWeight:700,color:"#FF6B35"}}>₹{price}</span><button onClick={()=>removeFile(idx)} style={{border:"none",background:"#FEF2F2",color:"#ef4444",width:26,height:26,borderRadius:6,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button></div>
</div>

<div style={{marginBottom:8}}>
<label style={{fontSize:12,fontWeight:600,color:"#999",display:"block",marginBottom:5}}>PHOTO SIZE</label>
<div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{PHOTO_SIZES.map(s=>P(`${s.name} ₹${s.price}`,f.photoSize===s.id,()=>updateFile(idx,"photoSize",s.id)))}</div>
<p style={{fontSize:11,color:"#999",margin:"4px 0 0"}}>{ps.desc}</p>
</div>

<div style={{display:"flex",gap:10,marginBottom:8}}>
<Stepper value={f.qty} onChange={v=>updateFile(idx,"qty",v)} label="QUANTITY"/>
</div>

<div style={{marginBottom:8}}>
<label style={{fontSize:12,fontWeight:600,color:"#999",display:"block",marginBottom:5}}>FINISH</label>
<div style={{display:"flex",gap:5}}>
{P(f.laminated?"✅ Laminated +₹5":"Laminate +₹5",f.laminated,()=>updateFile(idx,"laminated",!f.laminated))}
</div>
</div>

<div>
<label style={{fontSize:12,fontWeight:600,color:"#999",display:"block",marginBottom:5}}>FRAME</label>
<div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{FRAME_OPTS.map(o=>P(`${o.icon} ${o.name}${o.price?` +₹${o.price}`:""}`,f.frame===o.id,()=>updateFile(idx,"frame",o.id)))}</div>
</div>
</div>;}

// ── PDF CARD ──
return<div key={idx} style={{background:"#fff",borderRadius:10,padding:"14px",border:"1px solid #eee",marginBottom:10}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
<div style={{display:"flex",alignItems:"center",gap:8,minWidth:0,flex:1}}><span style={{fontSize:18}}>📄</span><div style={{minWidth:0}}><p style={{fontSize:14,fontWeight:600,color:"#333",margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.file.name}</p><p style={{fontSize:12,color:"#888",margin:0}}>{(f.file.size/1024).toFixed(0)}KB • {f.pages} pages</p></div></div>
<div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}><span style={{fontSize:16,fontWeight:700,color:"#FF6B35"}}>₹{price}</span><button onClick={()=>removeFile(idx)} style={{border:"none",background:"#FEF2F2",color:"#ef4444",width:26,height:26,borderRadius:6,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button></div>
</div>

<div style={{marginBottom:8}}>
<label style={{fontSize:12,fontWeight:600,color:"#999",display:"block",marginBottom:5}}>COLOUR TYPE</label>
<div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{P("⬛ B&W",f.clr==="bw",()=>updateFile(idx,"clr","bw"))}{P("🎨 Color",f.clr==="color",()=>updateFile(idx,"clr","color"))}</div>
</div>

<div style={{marginBottom:8}}>
<label style={{fontSize:12,fontWeight:600,color:"#999",display:"block",marginBottom:5}}>PAGE SIZE</label>
<div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{["A4","A3","Legal","A5"].map(s=>P(s,f.paper===s,()=>updateFile(idx,"paper",s)))}</div>
</div>

<div style={{marginBottom:8}}>
<label style={{fontSize:12,fontWeight:600,color:"#999",display:"block",marginBottom:5}}>PRINT SIDE</label>
<div style={{display:"flex",gap:5}}>{P("📄📄 Both Sides",f.sided==="double",()=>updateFile(idx,"sided","double"))}{P("📄 Single Side",f.sided==="single",()=>updateFile(idx,"sided","single"))}</div>
</div>

<div style={{display:"flex",gap:10,marginBottom:8}}>
<Stepper value={f.pages} onChange={v=>updateFile(idx,"pages",v)} label="PAGES" sub="(auto)"/>
<Stepper value={f.copies} onChange={v=>updateFile(idx,"copies",v)} label="COPIES"/>
</div>
<div>
<label style={{fontSize:12,fontWeight:600,color:"#999",display:"block",marginBottom:5}}>BINDING</label>
<div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{BIND.map(b=>P(`${b.icon}${b.name}${b.price?` ₹${b.price}`:""}`,f.bind===b.id,()=>updateFile(idx,"bind",b.id)))}</div>
</div>
</div>;})}

{/* Order Summary */}
{files.length>0&&<div style={{background:"#fff",borderRadius:10,padding:"16px 14px",border:"1px solid #eee",marginBottom:14}}>
<h3 style={{fontSize:15,fontWeight:700,color:"#1a1a2e",margin:"0 0 10px"}}>Order Summary ({files.length} file{files.length>1?"s":""})</h3>
{files.map((f,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:13,color:"#666",marginBottom:4}}>
<span>{f.type==="photo"?`📷 ${f.file.name} (${f.photoSize}×${f.qty||1})`:`📄 ${f.file.name} (${f.pages}p×${f.copies}c)`}</span>
<span style={{fontWeight:600,color:"#333"}}>₹{calcPrice(f)}</span>
</div>)}
<div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:"#666",marginBottom:4,marginTop:6,paddingTop:6,borderTop:"1px solid #f0f0f0"}}><span>Delivery</span><span style={{fontWeight:600,color:del===0?"#16a34a":"#333"}}>{del===0?"FREE":"₹40"}</span></div>
{del===0&&<p style={{fontSize:11,color:"#16a34a",margin:"0 0 4px"}}>🎉 Free delivery on orders ₹499+</p>}
<div style={{borderTop:"2px solid #FF6B35",paddingTop:10,marginTop:6,display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:15,fontWeight:700}}>Total</span><span style={{fontSize:22,fontWeight:800,color:"#FF6B35"}}>₹{totalPrice+del}</span></div>
<button onClick={()=>{if(files.length===0)return;const names=files.map(f=>f.file.name).join(", ");const totalPages=files.reduce((s,f)=>f.type==="pdf"?(s+(parseInt(f.pages)||1)*(parseInt(f.copies)||1)):(s+(parseInt(f.qty)||1)),0);onProceed({file:names,files:files.map(f=>f.type==="photo"?{name:f.file.name,type:"photo",photoSize:f.photoSize,qty:parseInt(f.qty)||1,laminated:f.laminated,frame:FRAME_OPTS.find(o=>o.id===f.frame)?.name||"No Frame",copies:parseInt(f.qty)||1,pages:1,colorMode:"color",paperSize:f.photoSize,sided:"single",binding:"No Binding"}:{name:f.file.name,type:"pdf",pages:parseInt(f.pages)||1,copies:parseInt(f.copies)||1,colorMode:f.clr,paperSize:f.paper,sided:f.sided,binding:BIND.find(b=>b.id===f.bind)?.name||"No Binding"}),pages:totalPages,copies:1,colorMode:files[0].clr||"color",paperSize:files[0].paper||"A4",sided:files[0].sided||"single",binding:files[0].bind||"none",price:totalPrice},files.map(f=>f.file));}} style={{width:"100%",padding:13,borderRadius:10,border:"none",marginTop:10,background:"linear-gradient(135deg,#FF6B35,#FF8C42)",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer"}}>Proceed to Checkout →</button>
</div>}

{files.length===0&&<div style={{background:"#fff",borderRadius:10,padding:"16px 14px",border:"1px solid #eee",marginBottom:14,textAlign:"center"}}><span style={{fontSize:24}}>📄 📷</span><p style={{fontSize:13,color:"#ccc",margin:"4px 0 0"}}>Upload PDFs or photos to see pricing</p></div>}

<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>{[{i:"⚡",t:"24hr Turnaround"},{i:"🔒",t:"Secure Files"},{i:"📱",t:"UPI Payment"},{i:"🚚",t:"Free Delivery 499+"}].map(x=><div key={x.t} style={{background:"#fff",borderRadius:8,padding:"8px 10px",border:"1px solid #f0f0f0",display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:14}}>{x.i}</span><span style={{fontSize:11,color:"#888",fontWeight:500}}>{x.t}</span></div>)}</div>
</div></div>;}

/* ── ADDRESS with saved addresses (up to 5) ── */
function AddressPage({onConfirm,onBack,user}){
const saved=api.getSavedAddresses();
const[useNew,setUseNew]=useState(saved.length===0);
const[selectedIdx,setSelectedIdx]=useState(0);
const[n,sN]=useState(saved[0]?.name||user?.name||"");
const[ph,sPh]=useState(saved[0]?.phone||user?.phone||"");
const[ad,sAd]=useState(saved[0]?.address||"");
const[ci,sCi]=useState(saved[0]?.city||"");
const[pin,sPin]=useState(saved[0]?.pincode||"");
const ok=n&&ph.length>=10&&ad&&ci&&pin.length>=6;
const I={width:"100%",padding:"12px 14px",borderRadius:8,border:"1.5px solid #ddd",fontSize:16,outline:"none",boxSizing:"border-box"};
const selectSaved=(idx)=>{const a=saved[idx];sN(a.name);sPh(a.phone);sAd(a.address);sCi(a.city);sPin(a.pincode);setSelectedIdx(idx);setUseNew(false);};
const confirm=(addr)=>{api.saveAddress(addr);onConfirm(addr);};
return<div style={{maxWidth:500,margin:"0 auto",padding:"24px 14px"}}><button onClick={onBack} style={{border:"none",background:"none",color:"#888",fontSize:14,cursor:"pointer",marginBottom:12}}>← Back</button><Progress step={1}/><h2 style={{fontSize:22,fontWeight:700,margin:"0 0 6px",fontFamily:"'DM Serif Display',Georgia,serif"}}>Delivery Address</h2><p style={{fontSize:14,color:"#888",marginBottom:16}}>Where should we deliver?</p>

{saved.length>0&&!useNew&&<div style={{marginBottom:12}}>
{saved.map((a,i)=><div key={i} onClick={()=>selectSaved(i)} style={{background:"#fff",borderRadius:8,padding:14,border:`2px solid ${selectedIdx===i?"#FF6B35":"#eee"}`,marginBottom:6,cursor:"pointer"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:14,fontWeight:600,color:selectedIdx===i?"#FF6B35":"#333"}}>{a.name}</span>{i===0&&<span style={{fontSize:10,color:"#22c55e",fontWeight:600,background:"#F0FDF4",padding:"2px 8px",borderRadius:8}}>Last used</span>}</div>
<div style={{fontSize:13,color:"#666",marginTop:3}}>{a.address}, {a.city} - {a.pincode}</div>
<div style={{fontSize:12,color:"#888",marginTop:2}}>📱 {a.phone}</div>
</div>)}
<button onClick={()=>confirm(saved[selectedIdx])} style={{width:"100%",padding:13,borderRadius:8,border:"none",background:"linear-gradient(135deg,#FF6B35,#FF8C42)",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",marginBottom:8}}>Deliver Here →</button>
<button onClick={()=>setUseNew(true)} style={{width:"100%",padding:10,borderRadius:8,border:"1.5px solid #ddd",background:"#fff",color:"#666",fontSize:13,fontWeight:600,cursor:"pointer"}}>+ New Address</button>
</div>}

{(useNew||saved.length===0)&&<><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
<div style={{gridColumn:"1/-1"}}><label style={{fontSize:12,fontWeight:600,color:"#999"}}>FULL NAME</label><input value={n} onChange={e=>sN(e.target.value)} placeholder="Your name" style={{...I,marginTop:3}}/></div>
<div><label style={{fontSize:12,fontWeight:600,color:"#999"}}>PHONE</label><input value={ph} onChange={e=>sPh(e.target.value.replace(/\D/g,"").slice(0,10))} placeholder="9876543210" style={{...I,marginTop:3}}/></div>
<div><label style={{fontSize:12,fontWeight:600,color:"#999"}}>PINCODE</label><input value={pin} onChange={e=>sPin(e.target.value.replace(/\D/g,"").slice(0,6))} placeholder="733101" style={{...I,marginTop:3}}/></div>
<div style={{gridColumn:"1/-1"}}><label style={{fontSize:12,fontWeight:600,color:"#999"}}>ADDRESS</label><textarea value={ad} onChange={e=>sAd(e.target.value)} rows={2} placeholder="House, Street" style={{...I,marginTop:3,resize:"none"}}/></div>
<div><label style={{fontSize:12,fontWeight:600,color:"#999"}}>CITY</label><input value={ci} onChange={e=>sCi(e.target.value)} placeholder="Balurghat" style={{...I,marginTop:3}}/></div>
<div><label style={{fontSize:12,fontWeight:600,color:"#999"}}>STATE</label><input value="West Bengal" disabled style={{...I,marginTop:3,background:"#f8f8f8",color:"#666"}}/></div>
</div>{saved.length>0&&<button onClick={()=>setUseNew(false)} style={{marginTop:8,border:"none",background:"none",color:"#FF6B35",fontSize:12,fontWeight:600,cursor:"pointer"}}>← Use Saved Address</button>}
<button onClick={()=>ok&&confirm({name:n,phone:ph,address:ad,city:ci,pincode:pin})} disabled={!ok} style={{width:"100%",padding:11,borderRadius:8,border:"none",marginTop:10,background:ok?"linear-gradient(135deg,#FF6B35,#FF8C42)":"#ddd",color:ok?"#fff":"#999",fontSize:14,fontWeight:700,cursor:ok?"pointer":"not-allowed"}}>Proceed to Payment →</button></>}
</div>;}

function PaymentPage({order,onPay,onBack}){const[m,setM]=useState("upi");const[loading,setLoading]=useState(false);const[upiDone,setUpiDone]=useState(false);const d=order.price>=499?0:40;const total=order.price+d;const methods=[{id:"upi",i:"📱",l:"UPI (GPay / PhonePe)",s:"Instant payment"},{id:"cod",i:"🚚",l:"Cash on Delivery",s:"Pay when you receive"}];const btnBg=m==="upi"?"linear-gradient(135deg,#059669,#10b981)":"linear-gradient(135deg,#f59e0b,#eab308)";
const upiLink=`upi://pay?pa=printkaaro@ibl&pn=PrintKaaro&am=${total}&cu=INR&tn=PrintKaaro-Order`;
const handleClick=()=>{if(m==="upi"){window.location.href=upiLink;setUpiDone(true);}else{setLoading(true);onPay(m);}};
return<div style={{maxWidth:500,margin:"0 auto",padding:"24px 14px"}}><button onClick={onBack} style={{border:"none",background:"none",color:"#888",fontSize:14,cursor:"pointer",marginBottom:12}}>← Back</button><Progress step={2}/><h2 style={{fontSize:22,fontWeight:700,margin:"0 0 6px",fontFamily:"'DM Serif Display',Georgia,serif"}}>Payment</h2><p style={{fontSize:14,color:"#888",marginBottom:16}}>Choose payment method</p><div style={{background:"#FFFAF7",borderRadius:10,padding:14,border:"1px solid #FFE8D9",marginBottom:14,fontSize:13}}><div style={{display:"flex",justifyContent:"space-between",color:"#666",marginBottom:4}}><span>📄 {order.file}</span><span style={{fontWeight:600,color:"#333"}}>{order.pages}p×{order.copies}c</span></div><div style={{borderTop:"1px dashed #FFD5BE",paddingTop:8,marginTop:6,display:"flex",justifyContent:"space-between"}}><span style={{fontSize:15,fontWeight:700}}>Total</span><span style={{fontSize:22,fontWeight:800,color:"#FF6B35"}}>₹{total}</span></div></div>{methods.map(x=><button key={x.id} onClick={()=>{setM(x.id);setUpiDone(false);}} style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:"13px 14px",borderRadius:10,cursor:"pointer",border:`2px solid ${m===x.id?"#FF6B35":"#eee"}`,background:m===x.id?"#FFF8F4":"#fff",textAlign:"left",marginBottom:8,boxSizing:"border-box"}}><span style={{fontSize:22}}>{x.i}</span><div style={{flex:1,minWidth:0}}><div style={{fontSize:15,fontWeight:600,color:"#333"}}>{x.l}</div><div style={{fontSize:12,color:"#999"}}>{x.s}</div></div><div style={{width:18,height:18,borderRadius:"50%",border:`2px solid ${m===x.id?"#FF6B35":"#ddd"}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{m===x.id&&<div style={{width:10,height:10,borderRadius:"50%",background:"#FF6B35"}}/>}</div></button>)}

{m==="upi"&&!upiDone&&<><button onClick={handleClick} style={{width:"100%",padding:14,borderRadius:10,border:"none",marginTop:8,background:btnBg,color:"#fff",fontSize:16,fontWeight:700,cursor:"pointer"}}>📱 Pay ₹{total} via UPI</button><p style={{textAlign:"center",fontSize:12,color:"#888",marginTop:6}}>Opens your UPI app (GPay/PhonePe/Paytm)</p><p style={{textAlign:"center",fontSize:12,color:"#bbb",marginTop:2}}>UPI ID: printkaaro@ibl</p></>}

{m==="upi"&&upiDone&&<div style={{background:"#F0FDF4",borderRadius:10,padding:18,border:"1px solid #BBF7D0",marginTop:10,textAlign:"center"}}><p style={{fontSize:15,fontWeight:600,color:"#16a34a",margin:"0 0 6px"}}>✅ Complete payment in your UPI app</p><p style={{fontSize:13,color:"#888",margin:"0 0 12px"}}>After paying, tap the button below</p><button onClick={()=>{setLoading(true);onPay("upi");}} disabled={loading} style={{width:"100%",padding:13,borderRadius:10,border:"none",background:"linear-gradient(135deg,#059669,#10b981)",color:"#fff",fontSize:15,fontWeight:700,cursor:loading?"wait":"pointer",opacity:loading?.7:1}}>{loading?"Confirming...":"I've Paid ✓"}</button><button onClick={handleClick} style={{marginTop:8,border:"none",background:"none",color:"#3b82f6",fontSize:13,fontWeight:600,cursor:"pointer"}}>Didn't open? Tap to retry</button></div>}

{m==="cod"&&<><button onClick={handleClick} disabled={loading} style={{width:"100%",padding:14,borderRadius:10,border:"none",marginTop:8,background:"linear-gradient(135deg,#f59e0b,#eab308)",color:"#1a1a2e",fontSize:16,fontWeight:700,cursor:loading?"wait":"pointer",opacity:loading?.7:1}}>{loading?"Processing...":"🚚 Place Order — COD ₹"+total}</button><p style={{textAlign:"center",fontSize:12,color:"#f59e0b",marginTop:8}}>💡 Pay cash when delivered</p></>}
</div>;}

function StatusPage({order,address,setPage}){const id=`#PK-${new Date().toISOString().slice(0,10).replace(/-/g,"")}-${String(Math.floor(Math.random()*999)).padStart(3,"0")}`;const d=order.price>=499?0:40;const steps=[{l:"Order Placed",t:"Just now",ok:true,i:"✅"},{l:"Payment Confirmed",t:"Just now",ok:true,i:"💳"},{l:"Printing",t:"Est. 2-4 hrs",ok:false,i:"🖨️"},{l:"Ready",ok:false,i:"📦"},{l:"Delivery",ok:false,i:"🚚"},{l:"Delivered",ok:false,i:"🏠"}];return<div style={{maxWidth:500,margin:"0 auto",padding:"24px 14px"}}><Progress step={3}/><div style={{textAlign:"center",marginBottom:18}}><div style={{width:48,height:48,borderRadius:"50%",background:"linear-gradient(135deg,#22c55e,#16a34a)",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:22,color:"#fff",marginBottom:8}}>✓</div><h2 style={{fontSize:20,fontWeight:700,margin:"0 0 2px"}}>Order Confirmed!</h2><p style={{fontSize:11,color:"#888"}}>{id}</p></div><div style={{background:"#fff",borderRadius:10,padding:12,border:"1px solid #eee",marginBottom:12,fontSize:11}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}><span style={{color:"#888"}}>File</span><span style={{fontWeight:600}}>{order.file}</span></div><div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}><span style={{color:"#888"}}>Deliver to</span><span>{address.city}-{address.pincode}</span></div><div style={{borderTop:"1px solid #f0f0f0",paddingTop:6,marginTop:4,display:"flex",justifyContent:"space-between"}}><span style={{fontWeight:700}}>Total</span><span style={{fontSize:15,fontWeight:800,color:"#FF6B35"}}>₹{order.price+d}</span></div></div><div style={{background:"#fff",borderRadius:10,padding:12,border:"1px solid #eee",marginBottom:12}}><h3 style={{fontSize:12,fontWeight:700,margin:"0 0 10px"}}>Status</h3>{steps.map((s,i)=><div key={i} style={{display:"flex",gap:8}}><div style={{display:"flex",flexDirection:"column",alignItems:"center"}}><div style={{width:26,height:26,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,background:s.ok?"#F0FDF4":"#f8f8f8",border:`2px solid ${s.ok?"#22c55e":"#e0e0e0"}`}}>{s.i}</div>{i<steps.length-1&&<div style={{width:2,height:18,background:s.ok?"#22c55e":"#e0e0e0"}}/>}</div><div style={{paddingBottom:6}}><p style={{fontSize:11,fontWeight:600,color:s.ok?"#333":"#bbb",margin:0}}>{s.l}</p>{s.t&&<p style={{fontSize:9,color:s.ok?"#16a34a":"#ccc",margin:0}}>{s.t}</p>}</div></div>)}</div><p style={{textAlign:"center",fontSize:10,color:"#999",marginBottom:8}}>💡 You can cancel within 30 minutes from My Orders</p><button onClick={()=>setPage("home")} style={{width:"100%",padding:10,borderRadius:8,border:"2px solid #FF6B35",background:"#fff",color:"#FF6B35",fontSize:12,fontWeight:600,cursor:"pointer"}}>+ Another Order</button></div>;}

/* ── ORDERS PAGE with order details + cancel ── */
function OrdersPage({setPage,user}){const[orders,setOrders]=useState([]);const[loading,setLoading]=useState(true);const[detail,setDetail]=useState(null);const[cancelling,setCancelling]=useState(false);
const load=()=>{if(user&&api.isLoggedIn()){api.getMyOrders().then(o=>setOrders(o)).catch(()=>{}).finally(()=>setLoading(false));}else setLoading(false);};
useEffect(load,[user]);
const sc={confirmed:"#8b5cf6",printing:"#f59e0b",ready:"#3b82f6",shipped:"#0ea5e9",delivered:"#22c55e",cancelled:"#ef4444",pending:"#999"};
const pct={confirmed:15,printing:35,ready:55,shipped:75,delivered:100,cancelled:0,pending:5};
const canCancel=(o)=>o.status!=="cancelled"&&o.status!=="delivered"&&((Date.now()-new Date(o.createdAt).getTime())/(1000*60))<30;
const doCancel=async(id)=>{setCancelling(true);try{await api.cancelOrder(id);load();setDetail(null);}catch(e){alert(e.message);}setCancelling(false);};

if(!user)return<div style={{maxWidth:380,margin:"0 auto",padding:"50px 16px",textAlign:"center"}}><div style={{fontSize:36}}>📦</div><h2 style={{fontSize:20,fontWeight:700,margin:"8px 0"}}>Sign in to view orders</h2><button onClick={()=>setPage("signin")} style={{padding:"11px 24px",borderRadius:8,border:"none",background:"linear-gradient(135deg,#FF6B35,#FF8C42)",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",marginTop:10}}>Sign In</button></div>;

return<div style={{maxWidth:520,margin:"0 auto",padding:"24px 14px"}}><h2 style={{fontSize:22,fontWeight:700,margin:"0 0 16px",fontFamily:"'DM Serif Display',Georgia,serif"}}>My Orders</h2>
{loading?<p style={{textAlign:"center",color:"#999",padding:20,fontSize:14}}>Loading...</p>:orders.length===0?<div style={{textAlign:"center",padding:30,color:"#999"}}><div style={{fontSize:36,marginBottom:8}}>📭</div><p style={{fontSize:15}}>No orders yet</p></div>:orders.map(x=><div key={x._id} onClick={()=>setDetail(x)} style={{background:"#fff",borderRadius:10,padding:14,border:"1px solid #eee",marginBottom:10,cursor:"pointer"}}>
<div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:13,fontWeight:700,color:"#FF6B35",fontFamily:"monospace"}}>{x.orderId} <span style={{color:"#bbb",fontFamily:"sans-serif",fontWeight:400,fontSize:12}}>{new Date(x.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short"})}</span></span><span style={{fontSize:12,fontWeight:600,padding:"3px 8px",borderRadius:10,background:`${sc[x.status]||"#999"}15`,color:sc[x.status]||"#999"}}>{x.status}</span></div>
<p style={{fontSize:13,color:"#888",margin:"0 0 8px"}}>{x.colorMode==="bw"?"B&W":"Color"} — {x.fileName} ({x.pages}p×{x.copies}c)</p>
<div style={{display:"flex",alignItems:"center",gap:8}}><div style={{flex:1,height:4,borderRadius:2,background:"#f0f0f0"}}><div style={{height:"100%",borderRadius:2,width:`${pct[x.status]||0}%`,background:sc[x.status]||"#999"}}/></div><span style={{fontSize:14,fontWeight:700}}>₹{x.totalPrice}</span></div>
</div>)}
<button onClick={()=>setPage("home")} style={{width:"100%",padding:10,borderRadius:8,border:"2px solid #FF6B35",background:"#fff",color:"#FF6B35",fontSize:12,fontWeight:600,cursor:"pointer",marginTop:4}}>+ New Order</button>

{/* Order Detail Modal */}
{detail&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={()=>setDetail(null)}><div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:14,padding:20,maxWidth:460,width:"100%",maxHeight:"85vh",overflow:"auto"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><h3 style={{fontSize:18,fontWeight:700,margin:0}}>Order {detail.orderId}</h3><button onClick={()=>setDetail(null)} style={{border:"none",background:"#f5f5f5",borderRadius:6,width:30,height:30,cursor:"pointer",color:"#999",fontSize:14}}>✕</button></div>

{/* Status Timeline */}
<div style={{marginBottom:14}}>
{["confirmed","printing","ready","shipped","delivered"].map((s,i)=>{const done=["confirmed","printing","ready","shipped","delivered"].indexOf(detail.status)>=i;const isCurrent=detail.status===s;return<div key={s} style={{display:"flex",gap:10}}><div style={{display:"flex",flexDirection:"column",alignItems:"center"}}><div style={{width:26,height:26,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,background:done?"#F0FDF4":"#f8f8f8",border:`2px solid ${done?"#22c55e":"#e0e0e0"}`,fontWeight:isCurrent?700:400}}>{done?"✓":"○"}</div>{i<4&&<div style={{width:2,height:16,background:done?"#22c55e":"#e0e0e0"}}/>}</div><div style={{paddingBottom:6}}><span style={{fontSize:13,fontWeight:isCurrent?700:500,color:done?"#333":"#bbb"}}>{s.charAt(0).toUpperCase()+s.slice(1)}</span></div></div>;})}
{detail.status==="cancelled"&&<div style={{background:"#FEF2F2",borderRadius:6,padding:10,marginTop:4}}><span style={{fontSize:13,color:"#ef4444",fontWeight:600}}>❌ Order Cancelled</span></div>}
</div>

{/* Details */}
<div style={{fontSize:14,background:"#f9f9f9",borderRadius:8,padding:14,marginBottom:10}}>
<div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{color:"#888"}}>File</span><span style={{fontWeight:600}}>{detail.fileName}</span></div>
<div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{color:"#888"}}>Pages × Copies</span><span>{detail.pages} × {detail.copies}</span></div>
<div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{color:"#888"}}>Type</span><span>{detail.colorMode==="bw"?"B&W":"Color"} • {detail.paperSize} • {detail.sided}</span></div>
<div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{color:"#888"}}>Binding</span><span>{detail.binding}</span></div>
<div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{color:"#888"}}>Payment</span><span>{detail.paymentMethod} • {detail.paymentStatus}</span></div>
{detail.trackingId&&<div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{color:"#888"}}>Tracking</span><span style={{color:"#0ea5e9"}}>{detail.deliveryPartner}: {detail.trackingId}</span></div>}
</div>

{/* Delivery Address */}
{detail.deliveryAddress&&<div style={{fontSize:14,background:"#f9f9f9",borderRadius:8,padding:14,marginBottom:10}}>
<div style={{fontWeight:600,marginBottom:3}}>📍 Delivery Address</div>
<div style={{color:"#666"}}>{detail.deliveryAddress.name} • {detail.deliveryAddress.phone}</div>
<div style={{color:"#666"}}>{detail.deliveryAddress.address}, {detail.deliveryAddress.city} - {detail.deliveryAddress.pincode}</div>
</div>}

{/* Price */}
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderTop:"2px solid #FF6B35"}}>
<span style={{fontSize:16,fontWeight:700}}>Total</span><span style={{fontSize:22,fontWeight:800,color:"#FF6B35"}}>₹{detail.totalPrice}</span>
</div>

{/* Cancel Button (within 30 min) */}
{canCancel(detail)&&<button onClick={()=>doCancel(detail._id)} disabled={cancelling} style={{width:"100%",padding:12,borderRadius:8,border:"1.5px solid #ef4444",background:"#fff",color:"#ef4444",fontSize:14,fontWeight:600,cursor:"pointer",marginTop:10}}>{cancelling?"Cancelling...":"Cancel Order (within 30 min)"}</button>}
{detail.status!=="cancelled"&&!canCancel(detail)&&detail.status!=="delivered"&&<p style={{fontSize:12,color:"#999",textAlign:"center",marginTop:8}}>Cancellation window (30 min) has passed</p>}
</div></div>}
</div>;}

function AccountPage({user,setPage,onSignOut}){if(!user)return<div style={{maxWidth:380,margin:"0 auto",padding:"50px 16px",textAlign:"center"}}><div style={{fontSize:36}}>👤</div><h2 style={{fontSize:20,fontWeight:700,margin:"8px 0 6px"}}>Sign in to view account</h2><button onClick={()=>setPage("signin")} style={{padding:"11px 24px",borderRadius:8,border:"none",background:"linear-gradient(135deg,#FF6B35,#FF8C42)",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",marginTop:10}}>Sign In</button></div>;return<div style={{maxWidth:480,margin:"0 auto",padding:"24px 14px"}}><h2 style={{fontSize:22,fontWeight:700,margin:"0 0 16px",fontFamily:"'DM Serif Display',Georgia,serif"}}>My Account</h2><div style={{background:"#fff",borderRadius:10,padding:18,border:"1px solid #eee",marginBottom:12}}><div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}><div style={{width:44,height:44,borderRadius:"50%",background:"linear-gradient(135deg,#FF6B35,#FF8C42)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:18,fontWeight:700,flexShrink:0}}>{user.name[0].toUpperCase()}</div><div><div style={{fontSize:17,fontWeight:700}}>{user.name}</div><div style={{fontSize:13,color:"#888"}}>📱 +91 {user.phone}</div></div></div><button onClick={()=>setPage("orders")} style={{width:"100%",padding:10,borderRadius:6,border:"1.5px solid #ddd",background:"#fff",fontSize:14,fontWeight:600,cursor:"pointer"}}>📦 View Orders</button></div><div style={{background:"#fff",borderRadius:10,padding:16,border:"1px solid #eee",marginBottom:12}}><h3 style={{fontSize:15,fontWeight:700,margin:"0 0 10px"}}>Saved Addresses ({api.getSavedAddresses().length})</h3>{api.getSavedAddresses().length===0?<p style={{fontSize:13,color:"#999"}}>No saved addresses yet</p>:api.getSavedAddresses().map((a,i)=><div key={i} style={{padding:10,background:"#f9f9f9",borderRadius:6,marginBottom:5,fontSize:13}}><span style={{fontWeight:600}}>{a.name}</span> — {a.address}, {a.city} - {a.pincode}</div>)}</div><button onClick={onSignOut} style={{width:"100%",padding:12,borderRadius:8,border:"1.5px solid #ef4444",background:"#fff",color:"#ef4444",fontSize:14,fontWeight:600,cursor:"pointer"}}>Sign Out</button></div>;}

function AboutPage(){return<div style={{maxWidth:520,margin:"0 auto",padding:"24px 14px"}}><h2 style={{fontSize:22,fontWeight:700,margin:"0 0 6px",fontFamily:"'DM Serif Display',Georgia,serif"}}>About PrintKaaro</h2><p style={{fontSize:14,color:"#888",marginBottom:14}}>Your online print partner</p><div style={{background:"#fff",borderRadius:10,padding:16,border:"1px solid #eee",marginBottom:12}}><p style={{fontSize:14,color:"#555",lineHeight:1.7,margin:0}}>PrintKaaro makes printing easy. Documents, photos, booklets, binding — delivered to your doorstep in West Bengal. Double-sided printing starts at just ₹0.70/page!</p></div><div style={{background:"#fff",borderRadius:10,padding:16,border:"1px solid #eee"}}><h3 style={{fontSize:15,fontWeight:700,color:"#FF6B35",margin:"0 0 10px"}}>Why Us?</h3>{[{i:"⚡",t:"Fast — 24hr printing"},{i:"💰",t:"B&W ₹0.75/pg both sides, Color ₹2/pg both sides"},{i:"📄",t:"Single side: B&W ₹1, Color ₹3"},{i:"📷",t:"Photo printing with frame & lamination"},{i:"🔒",t:"Secure files"},{i:"🚚",t:"Free delivery — first order + ₹499+"}].map((x,i)=><div key={i} style={{display:"flex",gap:10,marginBottom:10}}><span style={{fontSize:16}}>{x.i}</span><span style={{fontSize:14,color:"#444"}}>{x.t}</span></div>)}</div></div>;}

function ContactPage(){const[sent,setSent]=useState(false);const I={width:"100%",padding:"12px 14px",borderRadius:8,border:"1.5px solid #ddd",fontSize:16,outline:"none",boxSizing:"border-box"};return<div style={{maxWidth:480,margin:"0 auto",padding:"24px 14px"}}><h2 style={{fontSize:22,fontWeight:700,margin:"0 0 6px",fontFamily:"'DM Serif Display',Georgia,serif"}}>Contact Us</h2><p style={{fontSize:14,color:"#888",marginBottom:14}}>We'd love to hear from you</p><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>{[{i:"💬",l:"WhatsApp",c:"#25D366",h:"https://wa.me/91XXXXXXXXXX"},{i:"📞",l:"Call",c:"#3b82f6",h:"tel:+91XXXXXXXXXX"},{i:"✉️",l:"Email",c:"#FF6B35",h:"mailto:hello@printkaaro.in"},{i:"📍",l:"Balurghat",c:"#333"}].map((x,idx)=>x.h?<a key={idx} href={x.h} target="_blank" rel="noopener noreferrer" style={{padding:14,background:"#fff",borderRadius:10,border:"1px solid #eee",textAlign:"center",textDecoration:"none"}}><div style={{fontSize:22,marginBottom:2}}>{x.i}</div><div style={{fontSize:13,fontWeight:600,color:x.c}}>{x.l}</div></a>:<div key={idx} style={{padding:14,background:"#fff",borderRadius:10,border:"1px solid #eee",textAlign:"center"}}><div style={{fontSize:22,marginBottom:2}}>{x.i}</div><div style={{fontSize:13,fontWeight:600,color:x.c}}>{x.l}</div></div>)}</div><div style={{background:"#fff",borderRadius:10,padding:16,border:"1px solid #eee"}}><h3 style={{fontSize:15,fontWeight:700,margin:"0 0 10px"}}>Send message</h3>{sent?<div style={{textAlign:"center",padding:12}}><span style={{fontSize:28}}>✅</span><p style={{fontSize:14,fontWeight:600,color:"#16a34a",margin:"6px 0 0"}}>Sent! We'll reply soon.</p></div>:<><input placeholder="Name" style={{...I,marginBottom:8}}/><input placeholder="Phone or email" style={{...I,marginBottom:8}}/><textarea rows={3} placeholder="Message" style={{...I,resize:"none",marginBottom:10}}/><button onClick={()=>setSent(true)} style={{width:"100%",padding:12,borderRadius:8,border:"none",background:"linear-gradient(135deg,#FF6B35,#FF8C42)",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer"}}>Send</button></>}</div></div>;}

export default function App(){const[page,setPage]=useState("home");const[user,setUser]=useState(null);const[order,setOrder]=useState(null);const[address,setAddress]=useState(null);const[pend,setPend]=useState(null);const[fileObj,setFileObj]=useState(null);

useEffect(()=>{
  if(api.isLoggedIn()){api.getProfile().then(u=>setUser(u)).catch(()=>api.signout());}
  // Track visit with unique visitor ID
  let vid=localStorage.getItem("pk_vid");
  if(!vid){vid="v_"+Date.now()+"_"+Math.random().toString(36).slice(2);localStorage.setItem("pk_vid",vid);}
  try{fetch(api.API_URL+"/api/visit",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({vid})});}catch(e){}
},[]);

const proceed=(d,fileOrFiles)=>{
  // fileOrFiles can be array of File objects for multi-upload
  setFileObj(Array.isArray(fileOrFiles)?fileOrFiles:fileOrFiles?[fileOrFiles]:[]);
  if(!user){setPend(d);setPage("signin");}else{setOrder(d);setPage("address");}
};
const out=()=>{api.signout();setUser(null);setPage("home");};
const authAndProceed=u=>{setUser(u);if(pend){setOrder(pend);setPend(null);setPage("address");}else setPage("home");};

const[orderLoading,setOrderLoading]=useState(false);
const[orderMsg,setOrderMsg]=useState("");
const[uploadPct,setUploadPct]=useState(0);

const handlePay=async(paymentMethod)=>{
  setOrderLoading(true);setOrderMsg("Uploading your files...");setUploadPct(0);
  
  const tryOrder=async(attempt)=>{
    try{
      // Upload all files - ALL must succeed
      let filePaths=[];
      let failedFiles=[];
      if(fileObj&&fileObj.length>0){
        for(let i=0;i<fileObj.length;i++){
          const f=fileObj[i];
          const sizeMB=(f.size/(1024*1024)).toFixed(1);
          setOrderMsg(`Uploading ${f.name} (${sizeMB} MB)`);
          setUploadPct(0);
          
          // Check file size before upload (200MB limit)
          if(f.size>MAX_FILE_MB*1024*1024){
            failedFiles.push(`${f.name} (too large - max ${MAX_FILE_MB}MB)`);
            continue;
          }
          
          try{
            const up=await api.uploadPDF(f,(pct)=>{
              setUploadPct(pct);
              setOrderMsg(`Uploading ${f.name} — ${pct}%`);
            });
            if(up.filePath) filePaths.push(up.filePath);
            else failedFiles.push(f.name);
          }catch(e){
            failedFiles.push(`${f.name} (${e.message})`);
          }
        }
      }
      
      // Block order if any file failed
      if(failedFiles.length>0){
        setOrderLoading(false);setOrderMsg("");
        alert(`These files could not be uploaded:\n\n${failedFiles.join("\n")}\n\nPlease remove them or compress at ilovepdf.com (max ${MAX_FILE_MB}MB each). Order was NOT placed.`);
        return;
      }
      
      // Block order if no files uploaded at all
      if(fileObj&&fileObj.length>0&&filePaths.length===0){
        setOrderLoading(false);setOrderMsg("");
        alert("No files could be uploaded. Please check your files and try again. Order was NOT placed.");
        return;
      }
      
      setOrderMsg("Placing your order...");setUploadPct(100);
      const pm=paymentMethod||"upi";
      const created=await api.createOrder({fileName:order.file,filePath:filePaths.join(","),fileSize:0,pages:order.pages,copies:order.copies,colorMode:order.colorMode,paperSize:order.paperSize,sided:order.sided,binding:order.binding,notes:order.files?JSON.stringify(order.files):"",price:order.price,deliveryAddress:address,paymentMethod:pm==="cod"?"cash":pm});
      const msg=encodeURIComponent(`🆕 New Order!\n📋 ${created.orderId||"Order"}\n👤 ${address.name} (${address.phone})\n📄 ${order.file}\n💰 ₹${created.totalPrice||order.price} (${pm==="cod"?"COD":pm})\n📍 ${address.city} - ${address.pincode}`);
      try{fetch(`https://api.callmebot.com/whatsapp.php?phone=918104780153&text=${msg}&apikey=YOUR_API_KEY`,{mode:"no-cors"});}catch(e){}
      setOrderLoading(false);setOrderMsg("");
      setPage("status");
    }catch(e){
      if(attempt<3&&(e.message.includes("fetch")||e.message.includes("Network")||e.message.includes("Failed"))){
        setOrderMsg(`Server is waking up... Retry ${attempt}/3`);setUploadPct(0);
        await new Promise(r=>setTimeout(r,5000));
        return tryOrder(attempt+1);
      }
      setOrderLoading(false);setOrderMsg("");
      alert("Order failed: "+e.message+"\n\nPlease try again.");
    }
  };
  
  try{await fetch(api.API_URL+"/",{mode:"no-cors"});}catch(e){}
  await new Promise(r=>setTimeout(r,1000));
  tryOrder(1);
};

return<div style={{minHeight:"100vh",background:"#FAFAFA",fontFamily:"'DM Sans','Segoe UI',sans-serif",overflowX:"hidden",maxWidth:"100vw"}}>
{orderLoading&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center"}}>
<div style={{background:"#fff",borderRadius:16,padding:"28px 24px",maxWidth:340,width:"90%",textAlign:"center"}}>
<div style={{fontSize:36,marginBottom:10}}>{uploadPct>=100?"✅":"📄"}</div>
<p style={{fontSize:15,fontWeight:700,color:"#1a1a2e",margin:"0 0 4px"}}>{uploadPct>=100?"Placing Order...":"Uploading PDF..."}</p>
<p style={{fontSize:12,color:"#888",margin:"0 0 16px",wordBreak:"break-all"}}>{orderMsg}</p>
<div style={{background:"#f0f0f0",borderRadius:20,height:22,overflow:"hidden",position:"relative"}}>
<div style={{background:"linear-gradient(90deg,#FF6B35,#FF8C42)",height:"100%",borderRadius:20,transition:"width 0.3s ease",width:`${uploadPct}%`,minWidth:uploadPct>0?"30px":"0"}}/>
<span style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:uploadPct>45?"#fff":"#666"}}>{uploadPct}%</span>
</div>
<p style={{fontSize:11,color:"#bbb",marginTop:12}}>Please don't close this page</p>
</div>
</div>}
<Nav user={user} setPage={setPage} page={page} onSignOut={out}/>
{page==="home"&&<HomePage onProceed={proceed}/>}
{page==="signin"&&<AuthPage onAuth={authAndProceed}/>}
{page==="address"&&order&&<AddressPage onConfirm={a=>{setAddress(a);setPage("payment");}} onBack={()=>setPage("home")} user={user}/>}
{page==="payment"&&order&&<PaymentPage order={order} onPay={handlePay} onBack={()=>setPage("address")}/>}
{page==="status"&&order&&address&&<StatusPage order={order} address={address} setPage={setPage}/>}
{page==="orders"&&<OrdersPage setPage={setPage} user={user}/>}
{page==="account"&&<AccountPage user={user} setPage={setPage} onSignOut={out}/>}
{page==="about"&&<AboutPage/>}
{page==="contact"&&<ContactPage/>}
<a href="https://wa.me/91XXXXXXXXXX" target="_blank" rel="noopener noreferrer" style={{position:"fixed",bottom:14,right:14,width:46,height:46,borderRadius:"50%",background:"#25D366",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,color:"#fff",boxShadow:"0 3px 12px rgba(37,211,102,.4)",zIndex:99,textDecoration:"none"}}>💬</a>
<footer style={{borderTop:"1px solid #eee",padding:14,textAlign:"center",marginTop:20}}><p style={{fontSize:10,color:"#bbb",margin:0}}>© 2026 PrintKaaro</p></footer>
</div>;}
