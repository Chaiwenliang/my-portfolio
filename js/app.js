// ============================================
// MINIMAL · 全部逻辑
// ============================================

const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];

// ---- Sheet ----
function openSheet(h){$('#sheetBody').innerHTML=h;$('#sheet').classList.add('on');$('#mask').classList.add('on');initSheetSwipe()}
function closeSheet(){$('#sheet').classList.remove('on');$('#mask').classList.remove('on')}
$('#mask').onclick=closeSheet;

// Sheet 下滑关闭（触摸手势）
function initSheetSwipe(){
  const sheet=$('#sheet');if(!sheet)return;
  let startY=0,curY=0,dragging=false;
  const onStart=e=>{startY=e.touches?e.touches[0].clientY:e.clientY;dragging=true;sheet.style.transition='none'};
  const onMove=e=>{if(!dragging)return;curY=(e.touches?e.touches[0].clientY:e.clientY)-startY;if(curY>0)sheet.style.transform='translateY('+curY+'px)'};
  const onEnd=()=>{if(!dragging)return;dragging=false;sheet.style.transition='';if(curY>80){closeSheet()}else{sheet.style.transform='';curY=0}};
  sheet.addEventListener('touchstart',onStart,{passive:true});
  sheet.addEventListener('touchmove',onMove,{passive:true});
  sheet.addEventListener('touchend',onEnd);
}

// ---- Toast ----
function toast(m,t='ok'){
  let w=$('.toast-w');if(!w){w=document.createElement('div');w.className='toast-w';document.body.appendChild(w)}
  const e=document.createElement('div');e.className=`toast toast--${t}`;
  e.innerHTML=`${t==='ok'?'<span style="color:var(--green)">✓</span>':'<span style="color:var(--red)">✗</span>'} ${m}`;
  w.appendChild(e);setTimeout(()=>{e.style.opacity='0';setTimeout(()=>e.remove(),300)},2500);
}

// ---- Tab ----
let cur='home';
$$('.tab').forEach(b=>b.onclick=()=>{
  const t=b.dataset.t;if(t===cur)return;
  $$('.tab').forEach(x=>x.classList.remove('on'));b.classList.add('on');
  cur=t;render();window.scrollTo({top:0,behavior:'smooth'});
});
function go(t){$$('.tab').forEach(b=>b.classList.toggle('on',b.dataset.t===t));cur=t;render();window.scrollTo({top:0,behavior:'smooth'})}

// ---- 渲染 ----
function render(){
  const d=DataManager.getAll();
  $('#app').innerHTML={home:vHome,works:vWorks,blog:vBlog,me:vMe}[cur](d);
  if(cur==='me')bindMe();
  if(cur==='me')setTimeout(()=>{$$('.sk__f').forEach(b=>{b.style.width=b.dataset.lv+'%'})},200);
}

// ==================== 首页 ====================
function vHome(d){
  const p=d.profile,proj=d.projects.filter(x=>x.featured).slice(0,3),posts=d.posts.filter(x=>x.published).slice(0,3);
  return `<div class="pg">
  <!-- Hero -->
  <div class="fi" style="text-align:center;padding:20px 0 32px">
    <div class="avatar avatar--lg" style="margin:0 auto 16px">${p.avatar?`<img src="${p.avatar}">`:p.name.charAt(0)}</div>
    <h1 style="font-size:1.6rem;font-weight:700;letter-spacing:-.03em">${p.name}</h1>
    <p style="color:var(--t2);font-size:.88rem;margin-top:4px;font-weight:500">${p.title}</p>
    <p style="color:var(--t3);font-size:.82rem;margin:12px auto 0;max-width:300px;line-height:1.7">${p.bio}</p>
    <div style="display:flex;gap:8px;justify-content:center;margin-top:20px">
      ${p.github?`<a href="${p.github}" target="_blank" class="btn btn--o btn--sm">GitHub</a>`:''}
      ${p.email?`<a href="mailto:${p.email}" class="btn btn--o btn--sm">邮箱</a>`:''}
    </div>
  </div>

  <!-- 快捷入口 -->
  <div class="fi d2" style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:28px">
    <button onclick="go('works')" class="cd" style="text-align:center;padding:16px 6px;transition:transform .15s"><div style="font-size:1.4rem;margin-bottom:4px">🚀</div><div style="font-size:.7rem;color:var(--t2);font-weight:500">项目</div></button>
    <button onclick="go('blog')" class="cd" style="text-align:center;padding:16px 6px;transition:transform .15s"><div style="font-size:1.4rem;margin-bottom:4px">📝</div><div style="font-size:.7rem;color:var(--t2);font-weight:500">博客</div></button>
    <button onclick="go('me')" class="cd" style="text-align:center;padding:16px 6px;transition:transform .15s"><div style="font-size:1.4rem;margin-bottom:4px">😊</div><div style="font-size:.7rem;color:var(--t2);font-weight:500">关于</div></button>
    <a href="mailto:${p.email}" class="cd" style="text-align:center;padding:16px 6px;transition:transform .15s"><div style="font-size:1.4rem;margin-bottom:4px">💬</div><div style="font-size:.7rem;color:var(--t2);font-weight:500">联系</div></a>
  </div>

  <!-- 精选项目 -->
  ${proj.length?`
  <div class="fi d3">
    <div class="hd"><h2>精选项目</h2><p>代表性项目</p></div>
    <div style="display:flex;gap:10px;overflow-x:auto;padding-bottom:8px;-webkit-overflow-scrolling:touch;scroll-snap-type:x mandatory">
      ${proj.map((pr,i)=>`
        <div class="cd" style="min-width:240px;flex-shrink:0;padding:0;overflow:hidden;scroll-snap-align:start;transition:transform .2s">
          <div style="height:120px;background:#f5f5f7;display:flex;align-items:center;justify-content:center;overflow:hidden">
            ${pr.image?`<img src="${pr.image}" style="width:100%;height:100%;object-fit:cover" loading="lazy">`:`<span style="font-size:2rem">${['🎨','🤖','📱','📊','🎮','🌐'][i%6]}</span>`}
          </div>
          <div style="padding:14px 16px">
            <h3 style="font-weight:600;font-size:.92rem">${pr.title}</h3>
            <p style="font-size:.78rem;color:var(--t2);margin-top:4px;line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${pr.description}</p>
            <div class="tags" style="margin-top:10px">${pr.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
          </div>
        </div>
      `).join('')}
    </div>
    <div style="text-align:center;margin-top:14px"><button onclick="go('works')" class="btn btn--g btn--sm">查看全部 →</button></div>
  </div>`:''}

  <!-- 最新文章 -->
  ${posts.length?`
  <div class="spacer"></div>
  <div class="fi d4">
    <div class="hd"><h2>最新文章</h2><p>技术分享</p></div>
    <div style="display:flex;flex-direction:column;gap:10px">
      ${posts.map(post=>`
        <div class="cd" style="padding:0;overflow:hidden;display:flex;gap:0">
          ${post.image?`<div style="width:120px;flex-shrink:0;overflow:hidden"><img src="${post.image}" style="width:100%;height:100%;object-fit:cover;min-height:110px" loading="lazy"></div>`:''}
          <div style="padding:14px;flex:1;min-width:0">
            <h3 style="font-weight:600;font-size:.9rem;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden">${post.title}</h3>
            <p style="font-size:.78rem;color:var(--t2);margin-top:5px;line-height:1.6;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${post.excerpt}</p>
            <div style="display:flex;align-items:center;gap:8px;margin-top:10px">
              <span style="font-size:.72rem;color:var(--t3)">${post.date}</span>
              <div class="tags">${post.tags.slice(0,2).map(t=>`<span class="tag">${t}</span>`).join('')}</div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
    <div style="text-align:center;margin-top:14px"><button onclick="go('blog')" class="btn btn--g btn--sm">查看全部 →</button></div>
  </div>`:''}
</div>`}

// ==================== 项目 ====================
function vWorks(d){
  const all=d.projects,tags=[...new Set(all.flatMap(p=>p.tags))];
  return `<div class="pg">
  <div class="hd fi"><h2>项目</h2><p>${all.length} 个项目</p></div>
  ${tags.length?`<div class="fi d1" style="display:flex;gap:6px;overflow-x:auto;padding-bottom:6px;-webkit-overflow-scrolling:touch;margin-bottom:14px">
    <button class="btn btn--sm btn--b fb on" data-f="all">全部</button>
    ${tags.map(t=>`<button class="btn btn--sm btn--o fb" data-f="${t}">${t}</button>`).join('')}
  </div>`:''}
  <div id="wL" style="display:flex;flex-direction:column;gap:10px">
    ${all.map((p,i)=>`
      <div class="cd fi d${Math.min(i+2,5)} wi" data-tags="${p.tags.join(',')}" style="padding:0;overflow:hidden">
        <div style="height:90px;background:#f5f5f7;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden">
          ${p.image?`<img src="${p.image}" style="width:100%;height:100%;object-fit:cover">`:`<span style="font-size:1.8rem">${['🎨','🤖','📱','📊','🎮','🌐'][i%6]}</span>`}
          ${p.featured?'<span style="position:absolute;top:10px;right:12px;font-size:.7rem;color:var(--t3)">精选</span>':''}
        </div>
        <div style="padding:14px 16px">
          <h3 style="font-weight:600;font-size:.92rem">${p.title}</h3>
          <p style="font-size:.8rem;color:var(--t2);margin-top:4px;line-height:1.5">${p.description}</p>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px">
            <div class="tags">${p.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
            <div style="display:flex;gap:6px">
              ${p.link&&p.link!=='#'?`<a href="${p.link}" target="_blank" class="btn btn--b btn--sm">预览</a>`:''}
              ${p.github&&p.github!=='#'?`<a href="${p.github}" target="_blank" class="btn btn--o btn--sm">源码</a>`:''}
            </div>
          </div>
        </div>
      </div>
    `).join('')}
  </div>
  ${all.length===0?'<div style="text-align:center;padding:48px 0;color:var(--t3)">暂无项目</div>':''}
</div>`}

// ==================== 博客 ====================
function vBlog(d){
  const posts=d.posts.filter(x=>x.published),tags=[...new Set(posts.flatMap(p=>p.tags))];
  return `<div class="pg">
  <div class="hd fi"><h2>博客</h2><p>${posts.length} 篇文章</p></div>
  ${tags.length?`<div class="fi d1" style="display:flex;gap:6px;overflow-x:auto;padding-bottom:6px;-webkit-overflow-scrolling:touch;margin-bottom:14px">
    <button class="btn btn--sm btn--b fb on" data-f="all">全部</button>
    ${tags.map(t=>`<button class="btn btn--sm btn--o fb" data-f="${t}">${t}</button>`).join('')}
  </div>`:''}
  <div id="bL" style="display:flex;flex-direction:column;gap:8px">
    ${posts.map((p,i)=>`
      <div class="cd fi d${Math.min(i+2,5)} bi" data-tags="${p.tags.join(',')}" data-id="${p.id}" style="${p.image?'padding:0;overflow:hidden;display:flex;gap:0':''}">
        ${p.image?`<div style="width:110px;flex-shrink:0;overflow:hidden"><img src="${p.image}" style="width:100%;height:100%;object-fit:cover;min-height:100px"></div><div style="padding:14px;flex:1;min-width:0">`:''}
        <div style="display:flex;justify-content:space-between;align-items:start;gap:8px">
          <h3 style="font-weight:600;font-size:.9rem;flex:1">${p.title}</h3>
          <span style="font-size:.75rem;color:var(--t3);flex-shrink:0;padding-top:2px;white-space:nowrap">${p.date}</span>
        </div>
        <p style="font-size:.8rem;color:var(--t2);margin-top:4px;line-height:1.6;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${p.excerpt}</p>
        <div class="tags" style="margin-top:8px">${p.tags.slice(0,3).map(t=>`<span class="tag">${t}</span>`).join('')}</div>
        ${p.image?'</div>':''}
      </div>
    `).join('')}
  </div>
  ${posts.length===0?'<div style="text-align:center;padding:48px 0;color:var(--t3)">暂无文章</div>':''}
</div>`}

// 文章阅读
document.addEventListener('click',e=>{
  const it=e.target.closest('.bi');if(!it)return;
  const post=DataManager.get('posts').find(p=>p.id===+it.dataset.id);if(!post)return;
  openSheet(`
    <h3 style="font-weight:700;font-size:1.05rem;margin-bottom:8px">${post.title}</h3>
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px">
      <span style="font-size:.8rem;color:var(--t3)">${post.date}</span>
      <div class="tags">${post.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
    </div>
    <div class="sep"></div>
    <p style="font-size:.9rem;color:var(--t2);line-height:1.8;margin-top:14px">${post.content}</p>
  `);
});

// 标签筛选
document.addEventListener('click',e=>{
  const b=e.target.closest('.fb');if(!b)return;
  const list=b.closest('.pg')?.querySelector('#wL')||b.closest('.pg')?.querySelector('#bL');if(!list)return;
  b.parentElement.querySelectorAll('.fb').forEach(x=>{x.classList.remove('on','btn--b');x.classList.add('btn--o')});
  b.classList.add('on','btn--b');b.classList.remove('btn--o');
  const f=b.dataset.f;
  list.querySelectorAll('.wi,.bi').forEach(it=>{it.style.display=(f==='all'||it.dataset.tags.includes(f))?'':'none'});
});

// ==================== 我的 ====================
function vMe(d){
  const p=d.profile,skills=d.skills;
  return `<div class="pg">
  <div class="cd fi" style="text-align:center;padding:28px 16px">
    <div class="avatar avatar--lg" style="margin:0 auto 14px">${p.avatar?`<img src="${p.avatar}">`:p.name.charAt(0)}</div>
    <h2 style="font-size:1.15rem;font-weight:700">${p.name}</h2>
    <p style="color:var(--t2);font-size:.85rem;margin-top:3px">${p.title}</p>
    <p style="color:var(--t3);font-size:.8rem;margin-top:2px">${p.location}</p>
    <div style="display:flex;gap:8px;justify-content:center;margin-top:16px;flex-wrap:wrap">
      ${p.email?`<a href="mailto:${p.email}" class="btn btn--o btn--sm">邮箱</a>`:''}
      ${p.github?`<a href="${p.github}" target="_blank" class="btn btn--o btn--sm">GitHub</a>`:''}
    </div>
  </div>

  <div class="spacer"></div>
  <div class="fi d2">
    <div class="hd"><h2>技能</h2></div>
    <div class="cd">
      ${skills.map(s=>`<div class="sk"><div class="sk__h"><span class="sk__n">${s.icon} ${s.name}</span><span class="sk__v">${s.level}%</span></div><div class="sk__t"><div class="sk__f" style="width:0%" data-lv="${s.level}"></div></div></div>`).join('')}
      ${!skills.length?'<p style="color:var(--t3);font-size:.85rem;text-align:center;padding:12px 0">暂无</p>':''}
    </div>
  </div>

  <div class="spacer"></div>
  <div class="fi d3">
    <div class="hd"><h2>管理</h2></div>
    <div style="display:flex;flex-direction:column;gap:6px">
      ${[
        ['profile','👤','编辑资料','姓名、简介、社交链接'],
        ['skills','📊','技能管理','添加、编辑、删除'],
        ['projects','🚀','项目管理',d.projects.length+' 个项目'],
        ['posts','📝','文章管理',d.posts.length+' 篇文章'],
        ['settings','⚙️','系统设置','导出 / 导入 / 重置']
      ].map(([k,icon,title,sub])=>`
        <button class="cd ae" data-p="${k}" style="display:flex;align-items:center;gap:14px;text-align:left">
          <span style="font-size:1.2rem">${icon}</span>
          <div style="flex:1"><div style="font-weight:600;font-size:.88rem">${title}</div><div style="font-size:.75rem;color:var(--t3)">${sub}</div></div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--t3)" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      `).join('')}
    </div>
  </div>

  <div class="spacer"></div>
  <p style="text-align:center;color:var(--t3);font-size:.75rem;padding:16px 0">${d.site.footer}</p>
</div>`}

function bindMe(){$$('.ae').forEach(b=>b.onclick=()=>{if(checkAdminAuth())openAdmin(b.dataset.p)})}

// ==================== 管理密码锁 ====================
const ADMIN_PWD_KEY='admin_pwd';
const ADMIN_AUTH_KEY='admin_auth';

function checkAdminAuth(){
  // 已验证过（本次会话）
  if(sessionStorage.getItem(ADMIN_AUTH_KEY))return true;
  // 首次使用：设置密码
  if(!localStorage.getItem(ADMIN_PWD_KEY)){
    const pwd=prompt('🔐 首次使用，请设置管理密码（至少4位）：');
    if(!pwd||pwd.length<4){toast('密码不能少于4位','err');return false}
    localStorage.setItem(ADMIN_PWD_KEY,pwd);
    sessionStorage.setItem(ADMIN_AUTH_KEY,'1');
    toast('密码设置成功 ✅');
    return true;
  }
  // 验证密码
  const input=prompt('🔐 请输入管理密码：');
  if(input===localStorage.getItem(ADMIN_PWD_KEY)){
    sessionStorage.setItem(ADMIN_AUTH_KEY,'1');
    return true;
  }
  toast('密码错误','err');
  return false;
}

// ==================== 管理后台 ====================
function openAdmin(p){
  ({profile:adminProfile,skills:adminSkills,projects:adminProjects,posts:adminPosts,settings:adminSettings})[p]();
}

function adminProfile(){
  const p=DataManager.get('profile');
  openSheet(`<h3 style="font-weight:700;font-size:1rem;margin-bottom:16px">编辑资料</h3>
  <form id="f">
    <div class="fg"><label class="fl">姓名</label><input class="fi" name="name" value="${p.name}"></div>
    <div class="fg"><label class="fl">头衔</label><input class="fi" name="title" value="${p.title}"></div>
    <div class="fg"><label class="fl">头像 URL</label><input class="fi" name="avatar" value="${p.avatar}" placeholder="https://..."></div>
    <div class="fg"><label class="fl">简介</label><textarea class="ft" name="bio" rows="2">${p.bio}</textarea></div>
    <div class="fg"><label class="fl">位置</label><input class="fi" name="location" value="${p.location}"></div>
    <div class="fg"><label class="fl">邮箱</label><input class="fi" name="email" value="${p.email}"></div>
    <div class="fg"><label class="fl">GitHub</label><input class="fi" name="github" value="${p.github}"></div>
    <div class="fg"><label class="fl">Twitter</label><input class="fi" name="twitter" value="${p.twitter||''}"></div>
    <div class="fg"><label class="fl">LinkedIn</label><input class="fi" name="linkedin" value="${p.linkedin||''}"></div>
    <div class="fg"><label class="fl">个人网站</label><input class="fi" name="website" value="${p.website||''}"></div>
    <button type="submit" class="btn btn--b btn--full">保存</button>
  </form>`);
  $('#f').onsubmit=e=>{e.preventDefault();const fd=new FormData(e.target),u={...p};for(const[k,v]of fd.entries())u[k]=v;DataManager.update('profile',u);closeSheet();toast('已保存');render()};
}

function adminSkills(){
  const s=DataManager.get('skills');
  openSheet(`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
    <h3 style="font-weight:700;font-size:1rem">技能管理</h3>
    <button class="btn btn--b btn--sm" id="addS">添加</button>
  </div>
  ${s.map((x,i)=>`<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--border)">
    <div style="display:flex;align-items:center;gap:10px"><span>${x.icon}</span><div><div style="font-weight:600;font-size:.88rem">${x.name}</div><div style="font-size:.75rem;color:var(--t3)">${x.level}%</div></div></div>
    <div style="display:flex;gap:4px"><button class="btn btn--g btn--sm es" data-i="${i}">编辑</button><button class="btn btn--g btn--sm ds" data-i="${i}" style="color:var(--red)">删除</button></div>
  </div>`).join('')}
  ${!s.length?'<p style="text-align:center;color:var(--t3);padding:20px 0">暂无</p>':''}`);
  $('#addS').onclick=()=>skillForm();
  $$('.es').forEach(b=>b.onclick=()=>skillForm(+b.dataset.i));
  $$('.ds').forEach(b=>b.onclick=()=>{const s=DataManager.get('skills');s.splice(+b.dataset.i,1);DataManager.update('skills',s);closeSheet();toast('已删除');setTimeout(adminSkills,350)});
}

function skillForm(idx){
  const s=DataManager.get('skills'),x=idx!==undefined?s[idx]:{name:'',level:80,icon:'⚡'};
  openSheet(`<h3 style="font-weight:700;font-size:1rem;margin-bottom:16px">${idx!==undefined?'编辑':'添加'}技能</h3>
  <form id="f">
    <div class="fg"><label class="fl">名称</label><input class="fi" name="name" value="${x.name}" required></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
      <div class="fg"><label class="fl">图标</label><input class="fi" name="icon" value="${x.icon}"></div>
      <div class="fg"><label class="fl">熟练度</label><input class="fi" type="number" name="level" value="${x.level}" min="0" max="100"></div>
    </div>
    <button type="submit" class="btn btn--b btn--full">保存</button>
  </form>`);
  $('#f').onsubmit=e=>{e.preventDefault();const fd=new FormData(e.target),n={name:fd.get('name'),icon:fd.get('icon')||'⚡',level:+fd.get('level')||80};const s=DataManager.get('skills');if(idx!==undefined)s[idx]=n;else s.push(n);DataManager.update('skills',s);closeSheet();toast(idx!==undefined?'已更新':'已添加');setTimeout(adminSkills,350)};
}

function adminProjects(){
  const p=DataManager.get('projects');
  openSheet(`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
    <h3 style="font-weight:700;font-size:1rem">项目管理</h3>
    <button class="btn btn--b btn--sm" id="addP">添加</button>
  </div>
  ${p.map((x,i)=>`<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--border)">
    <div style="flex:1;min-width:0"><div style="font-weight:600;font-size:.88rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${x.title}</div><div style="font-size:.75rem;color:var(--t3)">${x.tags.join(', ')}${x.featured?' · 精选':''}</div></div>
    <div style="display:flex;gap:4px;flex-shrink:0"><button class="btn btn--g btn--sm ep" data-i="${i}">编辑</button><button class="btn btn--g btn--sm dp" data-i="${i}" style="color:var(--red)">删除</button></div>
  </div>`).join('')}
  ${!p.length?'<p style="text-align:center;color:var(--t3);padding:20px 0">暂无</p>':''}`);
  $('#addP').onclick=()=>projForm();
  $$('.ep').forEach(b=>b.onclick=()=>projForm(+b.dataset.i));
  $$('.dp').forEach(b=>b.onclick=()=>{const p=DataManager.get('projects');p.splice(+b.dataset.i,1);DataManager.update('projects',p);closeSheet();toast('已删除');setTimeout(adminProjects,350)});
}

function projForm(idx){
  const p=DataManager.get('projects'),x=idx!==undefined?p[idx]:{id:Date.now(),title:'',description:'',image:'',tags:[],link:'',github:'',featured:false};
  openSheet(`<h3 style="font-weight:700;font-size:1rem;margin-bottom:16px">${idx!==undefined?'编辑':'添加'}项目</h3>
  <form id="f">
    <div class="fg"><label class="fl">名称</label><input class="fi" name="title" value="${x.title}" required></div>
    <div class="fg"><label class="fl">描述</label><textarea class="ft" name="description" rows="2">${x.description}</textarea></div>
    <div class="fg"><label class="fl">封面图片 URL</label><input class="fi" name="image" value="${x.image}" placeholder="https://..."></div>
    <div class="fg"><label class="fl">标签（逗号分隔）</label><input class="fi" name="tags" value="${x.tags.join(', ')}"></div>
    <div class="fg"><label class="fl">预览链接</label><input class="fi" name="link" value="${x.link}"></div>
    <div class="fg"><label class="fl">GitHub 链接</label><input class="fi" name="github" value="${x.github}"></div>
    <div class="fg" style="display:flex;align-items:center;gap:8px"><input type="checkbox" name="featured" id="fc" ${x.featured?'checked':''}><label for="fc" style="font-size:.88rem;cursor:pointer">精选项目</label></div>
    <button type="submit" class="btn btn--b btn--full">保存</button>
  </form>`);
  $('#f').onsubmit=e=>{e.preventDefault();const fd=new FormData(e.target),n={id:x.id,title:fd.get('title'),description:fd.get('description'),image:fd.get('image'),tags:fd.get('tags').split(',').map(t=>t.trim()).filter(Boolean),link:fd.get('link'),github:fd.get('github'),featured:!!e.target.featured.checked};const p=DataManager.get('projects');if(idx!==undefined)p[idx]=n;else p.push(n);DataManager.update('projects',p);closeSheet();toast(idx!==undefined?'已更新':'已添加');setTimeout(adminProjects,350)};
}

function adminPosts(){
  const p=DataManager.get('posts');
  openSheet(`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
    <h3 style="font-weight:700;font-size:1rem">文章管理</h3>
    <button class="btn btn--b btn--sm" id="addP">发布</button>
  </div>
  ${p.map((x,i)=>`<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--border)">
    <div style="flex:1;min-width:0"><div style="font-weight:600;font-size:.88rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${x.title}</div><div style="font-size:.75rem;color:var(--t3)">${x.date} ${x.published?'· 已发布':'· 草稿'}</div></div>
    <div style="display:flex;gap:4px;flex-shrink:0"><button class="btn btn--g btn--sm ep" data-i="${i}">编辑</button><button class="btn btn--g btn--sm dp" data-i="${i}" style="color:var(--red)">删除</button></div>
  </div>`).join('')}
  ${!p.length?'<p style="text-align:center;color:var(--t3);padding:20px 0">暂无</p>':''}`);
  $('#addP').onclick=()=>postForm();
  $$('.ep').forEach(b=>b.onclick=()=>postForm(+b.dataset.i));
  $$('.dp').forEach(b=>b.onclick=()=>{const p=DataManager.get('posts');p.splice(+b.dataset.i,1);DataManager.update('posts',p);closeSheet();toast('已删除');setTimeout(adminPosts,350)});
}

function postForm(idx){
  const p=DataManager.get('posts'),x=idx!==undefined?p[idx]:{id:Date.now(),title:'',excerpt:'',content:'',image:'',date:new Date().toISOString().slice(0,10),tags:[],published:true};
  openSheet(`<h3 style="font-weight:700;font-size:1rem;margin-bottom:16px">${idx!==undefined?'编辑':'发布'}文章</h3>
  <form id="f">
    <div class="fg"><label class="fl">标题</label><input class="fi" name="title" value="${x.title}" required></div>
    <div class="fg"><label class="fl">封面图片 URL</label><input class="fi" name="image" value="${x.image||''}" placeholder="https://..."></div>
    <div class="fg"><label class="fl">摘要</label><textarea class="ft" name="excerpt" rows="2">${x.excerpt}</textarea></div>
    <div class="fg"><label class="fl">正文</label><textarea class="ft" name="content" rows="4">${x.content}</textarea></div>
    <div class="fg"><label class="fl">标签（逗号分隔）</label><input class="fi" name="tags" value="${x.tags.join(', ')}"></div>
    <div class="fg" style="display:flex;align-items:center;gap:8px"><input type="checkbox" name="published" id="pc" ${x.published?'checked':''}><label for="pc" style="font-size:.88rem;cursor:pointer">发布</label></div>
    <button type="submit" class="btn btn--b btn--full">保存</button>
  </form>`);
  $('#f').onsubmit=e=>{e.preventDefault();const fd=new FormData(e.target),n={id:x.id,title:fd.get('title'),excerpt:fd.get('excerpt'),content:fd.get('content'),image:fd.get('image'),date:x.date,tags:fd.get('tags').split(',').map(t=>t.trim()).filter(Boolean),published:!!e.target.published.checked};const p=DataManager.get('posts');if(idx!==undefined)p[idx]=n;else p.unshift(n);DataManager.update('posts',p);closeSheet();toast(idx!==undefined?'已更新':'已发布');setTimeout(adminPosts,350)};
}

function adminSettings(){
  const s=DataManager.get('site');
  openSheet(`<h3 style="font-weight:700;font-size:1rem;margin-bottom:16px">系统设置</h3>
  <form id="f">
    <div class="fg"><label class="fl">网站标题</label><input class="fi" name="title" value="${s.title}"></div>
    <div class="fg"><label class="fl">网站描述</label><input class="fi" name="description" value="${s.description}"></div>
    <div class="fg"><label class="fl">页脚文字</label><input class="fi" name="footer" value="${s.footer}"></div>
    <button type="submit" class="btn btn--b btn--full">保存</button>
  </form>
  <div class="sep"></div>
  <div style="display:flex;flex-direction:column;gap:8px">
    <button class="btn btn--o btn--full" id="chgpwd">修改管理密码</button>
    <button class="btn btn--o btn--full" id="exp">导出数据</button>
    <label class="btn btn--o btn--full" style="cursor:pointer">导入数据<input type="file" accept=".json" id="imp" style="display:none"></label>
    <button class="btn btn--full" id="rst" style="border:1px solid var(--red);color:var(--red)">重置所有数据</button>
  </div>`);
  $('#f').onsubmit=e=>{e.preventDefault();const fd=new FormData(e.target);DataManager.update('site',{title:fd.get('title'),description:fd.get('description'),footer:fd.get('footer')});toast('已保存');document.title=fd.get('title')||'我的个人网站';render()};
  $('#chgpwd').onclick=()=>{const old=prompt('请输入当前密码：');if(old!==localStorage.getItem(ADMIN_PWD_KEY)){toast('当前密码错误','err');return}const n=prompt('请输入新密码（至少4位）：');if(!n||n.length<4){toast('密码不能少于4位','err');return}localStorage.setItem(ADMIN_PWD_KEY,n);toast('密码已修改 ✅')};
  $('#exp').onclick=()=>{DataManager.exportData();toast('已导出')};
  $('#imp').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{await DataManager.importData(f);toast('导入成功');setTimeout(()=>location.reload(),1200)}catch(err){toast('失败: '+err.message,'err')}};
  $('#rst').onclick=()=>{if(confirm('确定重置？不可撤销！')){DataManager.reset();toast('已重置');setTimeout(()=>location.reload(),1200)}};
}

// ---- Init ----
(function(){const s=DataManager.get('site');if(s)document.title=s.title||'我的个人网站';render();initAI()})();

// ============================================
// AI 助手 - 全站检索 + RAG 数字分身
// ============================================

// 🔗 HF Space API 地址（已部署）
const AI_API_URL='https://Chaiwenliang-chaiwenliang.hf.space/chat';

function initAI(){
  const fab=$('#aiFab'),panel=$('#aiPanel'),close=$('#aiClose'),input=$('#aiInput'),send=$('#aiSend'),msgs=$('#aiMsgs');
  let open=false;
  // 对话历史（最多保留 20 轮）
  const history=[];
  const MAX_HISTORY=20;

  function toggle(){
    open=!open;
    panel.classList.toggle('open',open);
    fab.classList.toggle('hidden',open);
    if(open)setTimeout(()=>input.focus(),350);
  }
  fab.onclick=toggle;
  close.onclick=toggle;

  function handleSend(){
    const q=input.value.trim();if(!q)return;
    input.value='';
    addMsg('user',q);
    history.push({role:'user',content:q,time:Date.now()});
    if(history.length>MAX_HISTORY)history.shift();
    showTyping();
    processQuery(q);
  }
  send.onclick=handleSend;
  input.onkeydown=e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();handleSend()}};

  function addMsg(role,text){
    const d=document.createElement('div');
    d.className=`ai-msg ai-msg--${role}`;
    d.innerHTML=`<div class="ai-msg__avatar">${role==='bot'?'🤖':'👤'}</div><div class="ai-msg__bubble">${text}</div>`;
    msgs.appendChild(d);
    msgs.scrollTop=msgs.scrollHeight;
  }

  function showTyping(){
    const d=document.createElement('div');
    d.className='ai-msg ai-msg--bot';d.id='aiTyping';
    d.innerHTML='<div class="ai-msg__avatar">🤖</div><div class="ai-typing"><span></span><span></span><span></span></div>';
    msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;
  }
  function removeTyping(){const el=$('#aiTyping');if(el)el.remove()}

  // ==================== 核心查询处理 ====================
  async function processQuery(q){
    // API 地址优先级：localStorage 自定义 > HF Space 默认地址
    const API_URL=localStorage.getItem('ai_api_url')||AI_API_URL;

    // 🔌 模式一：RAG 数字分身（调用 HF Space API）
    try{
      const res=await fetch(API_URL,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          question:q,
          context:getSiteContext(),
          history:history.slice(0,-1),
          persona:getPersona()
        })
      });
      if(!res.ok)throw new Error(`HTTP ${res.status}`);
      const data=await res.json();
      const reply=data.reply||data.response||data.answer||data.message||data.content||'暂时无法回答，请稍后再试。';
      removeTyping();
      addMsg('bot',reply);
      history.push({role:'assistant',content:reply,time:Date.now()});
      if(history.length>MAX_HISTORY)history.shift();
      return;
    }catch(err){
      console.warn('API failed, fallback to local search:',err);
      removeTyping();
      addMsg('bot','🤖 AI 服务暂时不可用，已切换到本地搜索模式。');
    }

    // 🔍 模式二：本地全站检索（降级方案）
    const result=localSearch(q);
    removeTyping();
    addMsg('bot',result);
    history.push({role:'assistant',content:result,time:Date.now()});
    if(history.length>MAX_HISTORY)history.shift();
  }

  // ==================== 数据接口 ====================

  // 全站上下文（供 RAG API 使用）
  function getSiteContext(){
    const d=DataManager.getAll();
    return{
      profile:d.profile,
      projects:d.projects.map(p=>({id:p.id,title:p.title,description:p.description,tags:p.tags,link:p.link,github:p.github,featured:p.featured})),
      posts:d.posts.filter(x=>x.published).map(p=>({id:p.id,title:p.title,excerpt:p.excerpt,content:p.content,tags:p.tags,date:p.date})),
      skills:d.skills.map(s=>({name:s.name,level:s.level})),
      site:d.site
    };
  }

  // 数字分身人设（供 RAG API 使用，可在管理后台自定义）
  function getPersona(){
    const d=DataManager.getAll();
    const p=d.profile;
    // 优先从 localStorage 读取自定义人设
    const custom=localStorage.getItem('ai_persona');
    if(custom)try{return JSON.parse(custom)}catch(e){}
    // 默认人设：根据网站数据自动生成
    return{
      name:p.name,
      role:p.title,
      bio:p.bio,
      tone:'友好、专业、简洁',
      guidelines:[
        '以第一人称回答，你是'+p.name,
        '回答要基于网站上的真实信息',
        '如果不确定，诚实说明',
        '保持简洁，避免冗长',
        '适当使用 emoji 增加亲和力'
      ]
    };
  }

  // ==================== 本地智能搜索 ====================
  function localSearch(q){
    const d=DataManager.getAll();
    const p=d.profile;

    // 精确关键词匹配
    const rules=[
      {p:'你是谁|关于你|介绍|你是',fn:()=>`我是 <strong>${p.name}</strong>，${p.title}。${p.bio}`},
      {p:'联系|邮箱|email|怎么找|怎么联系',fn:()=>p.email?`你可以通过邮箱联系我：<a href="mailto:${p.email}">${p.email}</a>${p.github?`<br>GitHub：<a href="${p.github}" target="_blank">${p.github}</a>`:''}`:'暂未设置联系方式。'},
      {p:'github|代码|开源',fn:()=>p.github?`我的 GitHub：<a href="${p.github}" target="_blank">${p.github}</a>`:'暂未设置 GitHub。'},
      {p:'位置|在哪|哪里|住哪',fn:()=>p.location||'暂未设置位置信息。'},
      {p:'技能|会什么|擅长|技术栈|技术',fn:()=>{const s=d.skills;return s.length?`我的技能：<br>${s.map(x=>`• ${x.icon} ${x.name} (${x.level}%)`).join('<br>')}`:'暂未设置技能信息。'}},
      {p:'项目|作品|做过什么|portfolio',fn:()=>{const l=d.projects;return l.length?`共 ${l.length} 个项目：${l.map(x=>`<br><strong>${x.title}</strong> — ${x.description}<br><span style="color:var(--t3);font-size:.78rem">技术：${x.tags.join(' / ')}</span>`).join('')}`:'暂无项目。'}},
      {p:'文章|博客|写了什么|最近|分享|post',fn:()=>{const l=d.posts.filter(x=>x.published);return l.length?`共 ${l.length} 篇文章：${l.map(x=>`<br><strong>${x.title}</strong> <span style="color:var(--t3);font-size:.78rem">(${x.date})</span><br><span style="font-size:.82rem;color:var(--t2)">${x.excerpt}</span>`).join('')}`:'暂无文章。'}},
      {p:'帮助|help|能做什么|功能|怎么用',fn:()=>`我可以帮你：<br>• 🔍 <strong>搜索</strong> — 输入关键词搜索全站内容<br>• 👤 <strong>了解我</strong> — 问我「你是谁」<br>• 🚀 <strong>查项目</strong> — 问我「有哪些项目」<br>• 📝 <strong>看文章</strong> — 问我「最近的文章」<br>• 💬 <strong>联系方式</strong> — 问我「怎么联系」<br>• 🤖 <strong>AI 模式</strong> — 配置 API 后可作为我的数字分身回答问题`},
      {p:'api|接口|向量|数据库|rag|数字分身|配置',fn:()=>`<strong>🔧 AI 数字分身配置</strong><br><br>已默认对接 Hugging Face Space：<br><code style="background:#f5f5f4;padding:4px 8px;border-radius:6px;font-size:.78rem;display:block;word-break:break-all">${AI_API_URL}</code><br><br>在 HF Space 的 <strong>Settings → Variables and secrets</strong> 中配置：<br>• <code>LLM_API_KEY</code> — 你的 LLM API Key<br>• <code>LLM_BASE_URL</code> — API 地址（默认 OpenAI）<br>• <code>LLM_MODEL</code> — 模型名称<br><br>💡 如需切换到其他 API，在控制台执行：<br><code style="background:#f5f5f4;padding:4px 8px;border-radius:6px;font-size:.78rem;display:block;white-space:pre-wrap">localStorage.setItem("ai_api_url", "https://your-api.com/chat")</code><br><br>自定义人设：<br><code style="background:#f5f5f4;padding:4px 8px;border-radius:6px;font-size:.78rem;display:block;white-space:pre-wrap">localStorage.setItem("ai_persona", JSON.stringify({
  name: "你的名字",
  role: "你的角色",
  bio: "你的简介",
  tone: "说话风格",
  guidelines: ["规则1", "规则2"]
}))</code>`},
    ];

    for(const r of rules){
      if(new RegExp(r.p,'i').test(q))return r.fn();
    }

    // 模糊搜索
    const mp=d.projects.filter(x=>x.title.toLowerCase().includes(q)||x.tags.some(t=>t.toLowerCase().includes(q))||x.description.toLowerCase().includes(q));
    const mps=d.posts.filter(x=>x.title.toLowerCase().includes(q)||x.tags.some(t=>t.toLowerCase().includes(q))||x.excerpt.toLowerCase().includes(q));
    const ms=d.skills.filter(x=>x.name.toLowerCase().includes(q));

    let parts=[];
    if(mp.length)parts.push(`<strong>相关项目：</strong>${mp.map(x=>`<br>• <strong>${x.title}</strong> — ${x.description}`).join('')}`);
    if(mps.length)parts.push(`<strong>相关文章：</strong>${mps.map(x=>`<br>• <strong>${x.title}</strong> (${x.date})`).join('')}`);
    if(ms.length)parts.push(`<strong>相关技能：</strong><br>${ms.map(x=>`• ${x.icon} ${x.name} (${x.level}%)`).join('<br>')}`);

    if(parts.length)return parts.join('<br><br>');
    return`没有找到与「${q}」相关的内容。试试：<br>• 「有哪些项目」<br>• 「最近的文章」<br>• 「怎么联系」`;
  }
}
