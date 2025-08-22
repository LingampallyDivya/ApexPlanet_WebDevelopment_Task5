// ===== script.js =====

// Demo data (could be fetched from an API)
const DATA = [
  {id:1,title:'Aurora Hoodie', price:1299, cat:'Apparel',     img:'https://picsum.photos/seed/hoodie/600/400'},
  {id:2,title:'Orbit Mug',     price:399,  cat:'Home',        img:'https://picsum.photos/seed/mug/600/400'},
  {id:3,title:'Nebula Headphones', price:3499, cat:'Gadgets', img:'https://picsum.photos/seed/headphones/600/400'},
  {id:4,title:'Stellar Backpack',  price:1999, cat:'Accessories', img:'https://picsum.photos/seed/backpack/600/400'},
  {id:5,title:'Luna Lamp',     price:1499, cat:'Home',        img:'https://picsum.photos/seed/lamp/600/400'},
  {id:6,title:'Comet Tee',     price:699,  cat:'Apparel',     img:'https://picsum.photos/seed/tshirt/600/400'},
];

const state = {
  products: DATA.slice(),
  cart: JSON.parse(localStorage.getItem('cart') || '{}'),
};

const $ = s => document.querySelector(s);
const rupees = n => new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR'}).format(n);

function renderProducts(list){
  const host = $('#products'); host.innerHTML = '';
  const frag = document.createDocumentFragment();
  list.forEach(p=>{
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <div class="media">
        <img src="${p.img}" alt="${p.title}" loading="lazy" decoding="async" />
      </div>
      <div class="body">
        <div class="row"><strong>${p.title}</strong><span class="badge">${p.cat}</span></div>
        <div class="row"><span class="price">${rupees(p.price)}</span>
          <button class="btn" data-add="${p.id}">Add</button></div>
      </div>`;
    frag.append(card);
  });
  host.append(frag);
}

function renderCart(){
  const list = $('#cartItems'); list.innerHTML = '';
  let total = 0;
  const entries = Object.entries(state.cart);
  entries.forEach(([id,qty])=>{
    const p = state.products.find(x=>x.id==id); if(!p) return;
    total += p.price * qty;
    const row = document.createElement('div');
    row.className = 'item';
    row.innerHTML = `
      <div class="thumb"><img src="${p.img}" alt="" loading="lazy"></div>
      <div><div>${p.title}</div><div class="badge">${rupees(p.price)} × ${qty}</div></div>
      <div>
        <button class="btn" data-dec="${p.id}">-</button>
        <button class="btn" data-inc="${p.id}">+</button>
      </div>`;
    list.append(row);
  });
  if(entries.length===0){ list.innerHTML = '<p class="pill">Your cart is empty.</p>'; }
  $('#cartTotal').textContent = rupees(total);
  localStorage.setItem('cart', JSON.stringify(state.cart));
}

// Filter logic
function applyFilters(){
  const q = $('#q').value.trim().toLowerCase();
  const cat = $('#category').value;
  const filtered = state.products.filter(p =>
    (cat==='all' || p.cat===cat) &&
    (!q || p.title.toLowerCase().includes(q))
  );
  renderProducts(filtered);
}

// Events
document.addEventListener('click', e=>{
  const add = e.target.closest('[data-add]');
  const inc = e.target.closest('[data-inc]');
  const dec = e.target.closest('[data-dec]');
  if(add){ const id = add.dataset.add; state.cart[id] = (state.cart[id]||0)+1; renderCart(); }
  if(inc){ const id = inc.dataset.inc; state.cart[id] = (state.cart[id]||0)+1; renderCart(); }
  if(dec){ const id = dec.dataset.dec; if(state.cart[id]){ state.cart[id]--; if(state.cart[id]<=0) delete state.cart[id]; renderCart(); }}
});

$('#q').addEventListener('input', applyFilters);
$('#category').addEventListener('change', applyFilters);
$('#reset').addEventListener('click', ()=>{
  $('#q').value=''; $('#category').value='all'; applyFilters();
});

// Init
renderProducts(state.products);
renderCart();
$('#year').textContent = new Date().getFullYear();
