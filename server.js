const express = require('express');
const crypto = require('crypto');
const app = express();
app.use(express.json({ limit: '1mb' }));
app.use((req,res,next)=>{ res.set('Access-Control-Allow-Origin','*'); res.set('Access-Control-Allow-Headers','Content-Type, Authorization, x-webhook-secret'); res.set('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE,OPTIONS'); if(req.method==='OPTIONS') return res.sendStatus(204); next(); });

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'development-only-change-me';
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'demo-webhook-secret';
const users = new Map(), sessions = new Map(), carts = new Map(), orders = new Map(), payments = new Map();
const areas = [
  { id:'a1', name:'Menteng', etaMinutes:25, deliveryFee:8000 }, { id:'a2', name:'Senayan', etaMinutes:25, deliveryFee:8000 },
  { id:'a3', name:'Kemang', etaMinutes:30, deliveryFee:8000 }, { id:'a4', name:'Tebet', etaMinutes:30, deliveryFee:8000 },
  { id:'a5', name:'Grogol', etaMinutes:30, deliveryFee:8000 }, { id:'a6', name:'Cilandak', etaMinutes:35, deliveryFee:10000 },
  { id:'a7', name:'Kelapa Gading', etaMinutes:35, deliveryFee:10000 }, { id:'a8', name:'Pantai Indah Kapuk', etaMinutes:40, deliveryFee:12000 }
];
const menu = [
['n1','Rice','Nasi Goreng Kampung','Shrimp-paste fried rice with egg, pickles, and crackers.',28000,10],
['n2','Rice','Nasi Ayam Penyet','Smashed fried chicken with sambal, tempeh, and vegetables.',32000,15],
['n3','Rice','Nasi Rendang Padang','Slow-cooked beef rendang with cassava leaves.',42000,12],
['n4','Rice','Nasi Uduk Komplit','Coconut rice with vermicelli, egg, and fried shallots.',26000,10],
['m1','Noodles & Meatballs','Bakso Urat Jumbo','Tendon meatballs, noodles, tofu, and beef broth.',30000,12],
['m2','Noodles & Meatballs','Mie Ayam Pangsit','Noodles, soy-glazed chicken, greens, and wontons.',24000,10],
['m3','Noodles & Meatballs','Soto Betawi','Creamy coconut broth with beef and crackers.',38000,14],
['m4','Noodles & Meatballs','Mie Goreng Jawa','Sweet-savory fried noodles with egg and pickles.',27000,10],
['s1','Satay & Grill','Sate Ayam Madura','Chicken satay with peanut sauce and rice cake.',34000,18],
['s2','Satay & Grill','Sate Taichan','Grilled chicken with chili sambal and lime.',32000,15],
['s3','Satay & Grill','Ikan Bakar Jimbaran','Grilled fish with sambal matah and rice.',48000,20],
['s4','Satay & Grill','Ayam Bakar Taliwang','Spicy grilled chicken with vegetables.',40000,20],
['c1','Snacks','Pisang Goreng Madu','Crispy fried bananas with honey.',16000,8],
['c2','Snacks','Batagor Bandung','Fried tofu and fish dumplings with peanut sauce.',22000,10],
['c3','Snacks','Martabak Telur Mini','Pastry filled with egg, meat, and spring onion.',25000,15],
['c4','Snacks','Risol Mayo','Rissoles filled with sausage, egg, and mayonnaise.',18000,8],
['d1','Drinks','Es Teh Tarik','Sweet milk tea with ice.',12000,5],
['d2','Drinks','Es Kopi Susu Gula Aren','Espresso, milk, and palm sugar.',20000,6],
['d3','Drinks','Es Cendol','Cendol jelly, coconut milk, and palm sugar.',16000,6],
['d4','Drinks','Jus Alpukat','Avocado blended with milk and chocolate.',18000,6]
].map(([id,category,name,description,price,cookMinutes])=>({id,category,name,description,price,stock:50,cookMinutes,available:true}));
const vouchers = {
  SAVE10:{ min:50000, type:'percent', value:10, maxDiscount:15000 },
  FREESHIP:{ min:40000, type:'shipping', value:0 },
  NEW20:{ min:60000, type:'fixed', value:20000, newOnly:true }
};
const ok=(res,data,status=200)=>res.status(status).json({status:'success',data});
const fail=(res,status,message,details)=>res.status(status).json({status:'error',message,...(details?{details}:{})});
const hashPassword=(password,salt)=>crypto.scryptSync(password,salt,64).toString('hex');
function tokenFor(user){ const token=crypto.randomBytes(32).toString('hex'); sessions.set(token,user.email); return token; }
function auth(req,res,next){ const h=req.get('authorization')||''; const m=h.match(/^Bearer (.+)$/); const email=m&&sessions.get(m[1]); if(!email||!users.has(email)) return fail(res,401,'Missing or invalid bearer token'); req.user=users.get(email); next(); }
function priceCart(items){ return items.reduce((s,i)=>s+i.price*i.quantity,0); }
function cartItems(email){ const c=carts.get(email)||[]; return c.map(i=>({...i,menuItem:menu.find(m=>m.id===i.menuItemId)})).filter(i=>i.menuItem).map(i=>({menuItemId:i.menuItemId,name:i.menuItem.name,unitPrice:i.menuItem.price,quantity:i.quantity,customizations:i.customizations||[],lineTotal:i.menuItem.price*i.quantity})); }

app.get('/api/health',(req,res)=>ok(res,{service:'Dapur Antar API',version:'1.0.0',timestamp:new Date().toISOString()}));
app.post('/api/v1/auth/register',(req,res)=>{
 const {name,email,phone,password}=req.body||{};
 if(!name||!email||!phone||!password) return fail(res,400,'name, email, phone, and password are required');
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail(res,400,'Email address is invalid');
 if(String(password).length<8) return fail(res,400,'Password must be at least 8 characters');
 const key=String(email).toLowerCase().trim(); if(users.has(key)) return fail(res,409,'Email is already registered');
 const salt=crypto.randomBytes(16).toString('hex'); users.set(key,{id:'usr_'+crypto.randomBytes(5).toString('hex'),name:String(name).trim(),email:key,phone:String(phone),salt,passwordHash:hashPassword(String(password),salt),address:''});
 return ok(res,{userId:users.get(key).id},201);
});
app.post('/api/v1/auth/login',(req,res)=>{
 const {email,password}=req.body||{}; const u=users.get(String(email||'').toLowerCase().trim());
 if(!u||!password||hashPassword(String(password),u.salt)!==u.passwordHash) return fail(res,401,'Invalid email or password');
 return ok(res,{user:{id:u.id,name:u.name,email:u.email,phone:u.phone},token:tokenFor(u),tokenType:'Bearer',expiresIn:86400});
});
app.get('/api/v1/profile',auth,(req,res)=>ok(res,{id:req.user.id,name:req.user.name,email:req.user.email,phone:req.user.phone,address:req.user.address}));
app.put('/api/v1/profile',auth,(req,res)=>{ const {name,phone,address}=req.body||{}; if(name!==undefined)req.user.name=String(name); if(phone!==undefined)req.user.phone=String(phone); if(address!==undefined)req.user.address=String(address); ok(res,{id:req.user.id,name:req.user.name,email:req.user.email,phone:req.user.phone,address:req.user.address}); });
app.get('/api/v1/menu',(req,res)=>{
 let list=menu.filter(x=>x.available); const category=String(req.query.category||'').toLowerCase(), search=String(req.query.search||'').toLowerCase(), sort=req.query.sort;
 if(category&&category!=='all')list=list.filter(x=>x.category.toLowerCase()===category);
 if(search)list=list.filter(x=>(x.name+' '+x.description).toLowerCase().includes(search));
 if(sort==='price_asc')list.sort((a,b)=>a.price-b.price); else if(sort==='price_desc')list.sort((a,b)=>b.price-a.price);
 ok(res,{count:list.length,data:list});
});
app.get('/api/v1/menu/:id',(req,res)=>{const item=menu.find(x=>x.id===req.params.id); return item?ok(res,item):fail(res,404,'Menu item not found');});
app.get('/api/v1/cart',auth,(req,res)=>{const items=cartItems(req.user.email); ok(res,{items,subtotal:items.reduce((s,i)=>s+i.lineTotal,0)});});
app.post('/api/v1/cart/items',auth,(req,res)=>{
 const {menuItemId,quantity,customizations=[]}=req.body||{}; const item=menu.find(x=>x.id===menuItemId&&x.available);
 if(!item)return fail(res,404,'Menu item not found or unavailable');
 if(!Number.isInteger(quantity)||quantity<1||quantity>20)return fail(res,400,'quantity must be an integer from 1 to 20');
 const list=carts.get(req.user.email)||[]; const old=list.find(x=>x.menuItemId===menuItemId);
 if(old){if(old.quantity+quantity>20)return fail(res,400,'Maximum quantity per item is 20');old.quantity+=quantity;old.customizations=Array.isArray(customizations)?customizations:[];}
 else list.push({menuItemId,quantity,customizations:Array.isArray(customizations)?customizations:[]});
 carts.set(req.user.email,list); const items=cartItems(req.user.email); ok(res,{items,subtotal:items.reduce((s,i)=>s+i.lineTotal,0)},201);
});
app.patch('/api/v1/cart/items/:menuItemId',auth,(req,res)=>{
 const {quantity}=req.body||{}; if(!Number.isInteger(quantity)||quantity<0||quantity>20)return fail(res,400,'quantity must be an integer from 0 to 20');
 let list=carts.get(req.user.email)||[]; if(quantity===0)list=list.filter(i=>i.menuItemId!==req.params.menuItemId); else {const x=list.find(i=>i.menuItemId===req.params.menuItemId);if(!x)return fail(res,404,'Cart item not found');x.quantity=quantity;}
 carts.set(req.user.email,list); const items=cartItems(req.user.email);ok(res,{items,subtotal:items.reduce((s,i)=>s+i.lineTotal,0)});
});
app.delete('/api/v1/cart',(req,res)=>{const h=req.get('authorization')||'',m=h.match(/^Bearer (.+)$/),email=m&&sessions.get(m[1]);if(!email)return fail(res,401,'Missing or invalid bearer token');carts.set(email,[]);ok(res,{items:[],subtotal:0});});
app.post('/api/v1/promotions/apply',(req,res)=>{
 const {promoCode,cartSubtotal}=req.body||{}; const code=String(promoCode||'').toUpperCase(); const v=vouchers[code];
 if(!v)return fail(res,400,'Invalid promotion code');
 if(!Number.isFinite(Number(cartSubtotal))||Number(cartSubtotal)<v.min)return fail(res,400,'Cart subtotal does not meet the promotion minimum',{minimumSpend:v.min});
 let discountAmount=0,deliveryDiscount=0;
 if(v.type==='percent')discountAmount=Math.min(v.maxDiscount,Math.round(Number(cartSubtotal)*v.value/100));
 if(v.type==='fixed')discountAmount=Math.min(v.value,Number(cartSubtotal));
 if(v.type==='shipping')deliveryDiscount=1;
 ok(res,{valid:true,promoCode:code,discountAmount,deliveryDiscount,minimumSpend:v.min,finalSubtotal:Math.max(0,Number(cartSubtotal)-discountAmount)});
});
app.get('/api/v1/locations',(req,res)=>{let list=areas;if(req.query.area)list=list.filter(a=>a.name.toLowerCase().includes(String(req.query.area).toLowerCase()));ok(res,{count:list.length,data:list});});
app.post('/api/v1/orders',auth,(req,res)=>{
 const {deliveryAddress,area,paymentMethod,promoCode,deliveryInstructions}=req.body||{};
 if(!deliveryAddress||!area||!paymentMethod)return fail(res,400,'deliveryAddress, area, and paymentMethod are required');
 const method=String(paymentMethod).toUpperCase(); if(!['QRIS','GOPAY','OVO','DANA','SHOPEEPAY','CASH'].includes(method))return fail(res,400,'Unsupported payment method');
 const a=areas.find(x=>x.name.toLowerCase()===String(area).toLowerCase());if(!a)return fail(res,400,'Delivery area is not supported');
 const items=cartItems(req.user.email);if(!items.length)return fail(res,400,'Cart is empty');
 const subtotal=items.reduce((s,i)=>s+i.lineTotal,0);let discount=0,deliveryFee=subtotal>=75000?0:a.deliveryFee;
 if(promoCode){const v=vouchers[String(promoCode).toUpperCase()];if(!v)return fail(res,400,'Invalid promotion code');if(subtotal<v.min)return fail(res,400,'Cart subtotal does not meet promotion minimum');if(v.type==='percent')discount=Math.min(v.maxDiscount,Math.round(subtotal*v.value/100));if(v.type==='fixed')discount=Math.min(v.value,subtotal);if(v.type==='shipping')deliveryFee=0;}
 const serviceFee=2000,tax=Math.round((subtotal-discount)*0.0),totalAmount=Math.max(0,subtotal-discount+deliveryFee+serviceFee+tax);
 const id='DA-'+new Date().toISOString().slice(0,10).replaceAll('-','')+'-'+crypto.randomBytes(3).toString('hex').toUpperCase();
 const order={orderId:id,userId:req.user.id,email:req.user.email,items,deliveryAddress,area,deliveryInstructions:deliveryInstructions||'',paymentMethod:method,paymentStatus:method==='CASH'?'PAY_ON_DELIVERY':'PENDING',status:'CONFIRMED',createdAt:new Date().toISOString(),estimatedDeliveryMinutes:a.etaMinutes+Math.max(...items.map(i=>menu.find(m=>m.id===i.menuItemId).cookMinutes)),pricing:{subtotal,discount,tax,deliveryFee,serviceFee,totalAmount},tracking:{status:'CONFIRMED',events:[{status:'CONFIRMED',at:new Date().toISOString(),message:'Order received by Dapur Antar'}]}};
 orders.set(id,order);carts.set(req.user.email,[]);
 if(method!=='CASH') {const pid='PAY-'+crypto.randomBytes(4).toString('hex').toUpperCase();payments.set(pid,{paymentId:pid,orderId:id,method,amount:totalAmount,status:'PENDING',createdAt:new Date().toISOString()});order.paymentId=pid;order.demoPaymentInstructions=method==='QRIS'?'Demo only: connect a payment provider to generate a real QRIS QR.':`Demo only: no ${method} charge has been initiated.`;}
 ok(res,{orderId:id,status:order.status,paymentStatus:order.paymentStatus,paymentId:order.paymentId||null,estimatedDeliveryMinutes:order.estimatedDeliveryMinutes,pricing:order.pricing},201);
});
app.get('/api/v1/orders',auth,(req,res)=>{const list=[...orders.values()].filter(o=>o.email===req.user.email).sort((a,b)=>b.createdAt.localeCompare(a.createdAt));ok(res,{count:list.length,data:list});});
app.get('/api/v1/orders/:orderId',auth,(req,res)=>{const o=orders.get(req.params.orderId);if(!o)return fail(res,404,'Order not found');if(o.email!==req.user.email)return fail(res,403,'You cannot access this order');ok(res,o);});
app.get('/api/v1/orders/:orderId/tracking',auth,(req,res)=>{const o=orders.get(req.params.orderId);if(!o)return fail(res,404,'Order not found');if(o.email!==req.user.email)return fail(res,403,'You cannot access this order');ok(res,{orderId:o.orderId,status:o.tracking.status,events:o.tracking.events,deliveryAddress:o.deliveryAddress,liveCourierGpsAvailable:false,message:'Demo tracking only; live courier GPS is not connected.'});});
app.post('/api/v1/payments',(req,res)=>{const {orderId,method}=req.body||{};const o=orders.get(orderId);if(!o)return fail(res,404,'Order not found');if(!['QRIS','GOPAY','OVO','DANA','SHOPEEPAY'].includes(String(method||'').toUpperCase()))return fail(res,400,'Unsupported online payment method');const id='PAY-'+crypto.randomBytes(4).toString('hex').toUpperCase();const p={paymentId:id,orderId,method:String(method).toUpperCase(),amount:o.pricing.totalAmount,status:'PENDING',createdAt:new Date().toISOString(),sandbox:true};payments.set(id,p);o.paymentId=id;ok(res,{...p,message:'Sandbox placeholder only. No real payment was charged.'},201);});
app.get('/api/v1/payments/:paymentId',auth,(req,res)=>{const p=payments.get(req.params.paymentId);if(!p)return fail(res,404,'Payment not found');const o=orders.get(p.orderId);if(!o||o.email!==req.user.email)return fail(res,403,'You cannot access this payment');ok(res,p);});
app.post('/api/v1/webhooks/payment',(req,res)=>{if(req.get('x-webhook-secret')!==WEBHOOK_SECRET)return fail(res,401,'Invalid webhook secret');const {paymentId,status}=req.body||{};const p=payments.get(paymentId);if(!p)return fail(res,404,'Payment not found');if(!['PAID','FAILED','CANCELLED'].includes(status))return fail(res,400,'status must be PAID, FAILED, or CANCELLED');p.status=status;const o=orders.get(p.orderId);if(o)o.paymentStatus=status;ok(res,{paymentId,status,orderId:p.orderId});});
app.patch('/api/v1/orders/:orderId/status',(req,res)=>{if(req.get('x-webhook-secret')!==WEBHOOK_SECRET)return fail(res,401,'Admin/webhook secret required');const o=orders.get(req.params.orderId);if(!o)return fail(res,404,'Order not found');const {status,message}=req.body||{};if(!['CONFIRMED','PREPARING','PICKED_UP','ON_THE_WAY','DELIVERED','CANCELLED'].includes(status))return fail(res,400,'Unsupported order status');o.status=status;o.tracking.status=status;o.tracking.events.push({status,at:new Date().toISOString(),message:message||status.replaceAll('_',' ').toLowerCase()});ok(res,{orderId:o.orderId,status,tracking:o.tracking});});
app.use((req,res)=>fail(res,404,'Endpoint not found'));
app.use((err,req,res,next)=>{console.error(err);fail(res,500,'Internal server error');});
app.listen(PORT,()=>console.log(`Dapur Antar API running at http://localhost:${PORT}`));
