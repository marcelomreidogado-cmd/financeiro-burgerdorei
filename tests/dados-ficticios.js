(function(){
let s=9;const r=()=>{s=(s*9301+49297)%233280;return s/233280};
const cats=[['Fornecedores','Carnes',18000],['Fornecedores','Pães',4200],['Folha','Salários',16000],['Ocupação','Aluguel',7500],['Ocupação','Energia',2100],['Impostos','Simples',5200],['Marketing','Anúncios',1500],['Taxas','iFood',6800],['Taxas','Cartão',2400]];
const L=[];let n=0;
for(const m of ['2026-09','2026-10','2026-11']){
 for(const [c,sc,v] of cats){const d=m+'-'+String(5+Math.floor(r()*20)).padStart(2,'0');const pago=d<'2026-11-14';L.push({id:'l'+(n++),descricao:sc.toUpperCase(),valor:Math.round(v*(0.85+r()*0.3)),categoria:c,subcategoria:sc,rec_desp:'Contas a pagar',data_vencimento:d,data_competencia:m+'-01',data_efetivacao:pago?d:'',status:pago?'Baixado':'Pendente',forma_pagamento:'PIX'});}
 for(let d=1;d<=(m==='2026-11'?14:30);d++){const dd=m+'-'+String(d).padStart(2,'0');for(const [f,v] of [['iFood',1400],['Cartão',1100],['PIX',600],['Dinheiro',300]])L.push({id:'l'+(n++),descricao:'VENDAS '+f.toUpperCase(),valor:Math.round(v*(0.6+r()*0.8)),categoria:'Receitas',subcategoria:'Vendas '+f,rec_desp:'Contas a receber',data_vencimento:dd,data_competencia:dd,data_efetivacao:dd<'2026-11-14'?dd:'',status:dd<'2026-11-14'?'Baixado':'Pendente',forma_pagamento:f});}
}
const data={lancamentos:L,agenda_financeira:[],centrocusto:[],patrimonio:[],clientes_mes:[],config:[],extratos_bancarios:[],burger_finance_access:[{id:'u1',username:'marcelo',role:'admin',active:true}],burger_finance_login:[{id:'marcelo',uid:'u1',email:'x@y'}]};
const meta={fromCache:false,hasPendingWrites:false};
const user={uid:'u1',email:'teste@burger.com.br'};
function snap(id,d){return {id,exists:!!d,data:()=>d?JSON.parse(JSON.stringify(d)):undefined,metadata:meta}}
function qsnap(col){const docs=(data[col]||[]).map(x=>({...snap(x.id,x),ref:doc(col,x.id)}));return {docs,empty:!docs.length,size:docs.length,metadata:meta,forEach:f=>docs.forEach(f),docChanges:()=>docs.map(d=>({type:'added',doc:d}))}}
function find(col,id){return (data[col]||[]).find(x=>x.id===id)}
function doc(col,id){return {id,path:col+'/'+id,get:async()=>snap(id,find(col,id)),onSnapshot:(...a)=>{const cb=a.find(x=>typeof x==='function');setTimeout(()=>cb(snap(id,find(col,id))),20);return()=>{}},set:async()=>{},update:async()=>{},delete:async()=>{},collection:c=>coll(col+'/'+id+'/'+c)}}
function coll(col){const q={id:col,doc:id=>doc(col,id),get:async()=>qsnap(col),where(){return q},orderBy(){return q},limit(){return q},onSnapshot:(...a)=>{const cb=a.find(x=>typeof x==='function');setTimeout(()=>cb(qsnap(col)),20);return()=>{}},add:async()=>({id:'n'})};return q}
const fsInst={collection:coll,doc:p=>doc(p.split('/')[0],p.split('/')[1]),batch:()=>({set(){},update(){},delete(){},commit:async()=>{}}),runTransaction:async f=>f({get:async d=>d.get(),set(){},update(){},delete(){}}),enablePersistence:async()=>{},enableMultiTabIndexedDbPersistence:async()=>{},settings(){},enableNetwork:async()=>{},disableNetwork:async()=>{},waitForPendingWrites:async()=>{}};
const fs=()=>fsInst;fs.FieldValue={serverTimestamp:()=>Date.now(),delete:()=>null,increment:x=>x,arrayUnion:(...x)=>x};fs.Timestamp={now:()=>({toDate:()=>new Date(),toMillis:()=>Date.now()}),fromDate:d=>({toDate:()=>d})};
const authInst={currentUser:user,languageCode:'',setPersistence:async()=>{},onAuthStateChanged:(cb)=>{setTimeout(()=>cb(user),20);return()=>{}},signInWithEmailAndPassword:async()=>({user}),signOut:async()=>{}};
const auth=()=>authInst;auth.Auth={Persistence:{LOCAL:'l',SESSION:'s',NONE:'n'}};auth.EmailAuthProvider={credential:()=>({})};
const app={firestore:fs,auth,name:'[DEFAULT]'};
window.firebase={apps:[],initializeApp(){this.apps.push(app);return app},app:()=>app,firestore:fs,auth};
})();
