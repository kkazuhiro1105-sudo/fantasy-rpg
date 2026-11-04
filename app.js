const ATTRS=[["STR","筋力"],["VIT","体力"],["INT","知力"],["WIS","精神"],["AGI","敏捷"],["LUK","幸運"]];
const RACES=["人間","エルフ","獣人"];
const BEASTS=["猫系","犬系","狼系","狐系"];
const CLASSES=["戦士","騎士","狂戦士","盗賊","レンジャー","暗殺者","魔法使い","僧侶","賢者","召喚士","魔法剣士","錬金術師"];
const DESCRIPTIONS={人間:"多彩な外見と職業に馴染む、自由度の高い種族。",エルフ:"長い耳と優雅な雰囲気を持つ、神秘的な種族。",獣人:"猫・犬・狼・狐から選べる、耳と尻尾が特徴の種族。"};
const state={step:0,gender:"男性",mood:"穏やか",personality:"思いやりがある",species:"人間",beast:"猫系",job:"戦士",appearance:{髪型:"ショート",髪色:"黒",瞳:"青",肌:"標準"},extra:Object.fromEntries(ATTRS.map(([a])=>[a,0])),results:null,name:""};
const titles=["性別・雰囲気・性格","種族","職業","外見","追加ダイス配分","能力値ロール","主人公の名前","最終確認"];
const $=id=>document.getElementById(id);
function show(id){["title-screen","creation-screen","complete-screen"].forEach(x=>$(x).classList.toggle("hidden",x!==id))}
function choiceCard(label,desc,selected,click){return `<button class="choice ${selected?"selected":""}" data-choice="${encodeURIComponent(label)}"><strong>${label}</strong>${desc?`<small>${desc}</small>`:""}</button>`}

// 設定に応じて主人公のイラストをリアルタイム生成する機能
const hairMap={黒:'#29283b',茶:'#80513e',金:'#e8c16c',銀:'#c9c9df',白:'#f0efff',赤:'#b94c62',青:'#547fc5',紫:'#9171bd',桃:'#e7a2c4'};
const eyeMap={黒:'#39354d',茶:'#98613f',青:'#5799df',緑:'#62aa83',赤:'#ce647b',金:'#d4a747',紫:'#9676d5'};
const jobMap={戦士:'#5279b7',騎士:'#879dbd',狂戦士:'#a94e60',盗賊:'#56617d',レンジャー:'#648b75',暗殺者:'#42445f',魔法使い:'#8268bd',僧侶:'#d1b66f',賢者:'#568fae',召喚士:'#8768b6',魔法剣士:'#536bb0',錬金術師:'#4e9b91'};
function avatarSVG(){
 const a=state.appearance, hair=hairMap[a.髪色]||'#29283b', eye=eyeMap[a.瞳]||'#5799df', coat=jobMap[state.job]||'#5279b7';
 const beast=state.species==='獣人', elf=['エルフ','ダークエルフ'].includes(state.species), dragon=state.species==='竜人', demon=state.species==='魔族', wing=state.species==='天翼族';
 const ear=beast?`<path d="M125 160L91 72 165 126M275 160L309 72 235 126" fill="${hair}" stroke="#655c86" stroke-width="6"/><path d="M126 137l-19-48 43 42m124 6 19-48-43 42" fill="#edbdcf"/>`:elf?'<path d="M125 176L65 130l68 18m142 28 60-46-68 18" fill="#f3c9c9" stroke="#b98fa8" stroke-width="4"/>':dragon?'<path d="M130 145L98 83l66 44m106 18 32-62-66 44" fill="#9aa6c8" stroke="#596a98" stroke-width="5"/>':demon?'<path d="M151 122L133 48l42 65m74 9 18-74-42 65" fill="#78618e" stroke="#493d69" stroke-width="5"/>':'';
 const hairBack=a.髪型==='ロング'?'<path d="M100 180Q75 55 200 60Q325 55 300 180L320 430 270 385 130 385 80 430Z"/>':a.髪型==='ポニーテール'?'<path d="M100 180Q75 55 200 60Q325 55 300 180L330 300Q285 280 290 190Z"/>':'<path d="M100 180Q75 55 200 60Q325 55 300 180L280 220Q260 120 200 125Q140 120 120 220Z"/>';
 const tail=beast?`<path d="M280 410Q375 360 340 295Q325 270 305 300Q345 340 270 375" fill="${hair}" stroke="#655c86" stroke-width="8"/>`:'';
 const wings=wing?'<path d="M125 330Q10 230 25 370Q60 440 145 405M275 330Q390 230 375 370Q340 440 255 405" fill="#fff" stroke="#c2d3f0" stroke-width="12"/>':'';
 const skin=a.肌==='褐色'?'#bd806b':a.肌==='色白'?'#fff0ed':'#f2cbbd';
 const accessory=a.装飾品==='眼鏡'?'<g fill="none" stroke="#53658f" stroke-width="5"><circle cx="160" cy="218" r="29"/><circle cx="240" cy="218" r="29"/><path d="M189 218h22"/></g>':a.装飾品==='髪飾り'?'<path d="M260 105l17-22 17 22-17 22Z" fill="#8cc7ff" stroke="white" stroke-width="3"/>':a.装飾品==='耳飾り'?'<path d="M112 235l-8 32 10 8 10-8m166-32 8 32-10 8-10-8" fill="#f3d27d"/>':'';
 return `<svg viewBox="0 0 400 560" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="avbg" x2="1" y2="1"><stop stop-color="#c8e2ff"/><stop offset="1" stop-color="#e9ddff"/></linearGradient><linearGradient id="avcoat" x2="1" y2="1"><stop stop-color="${coat}"/><stop offset="1" stop-color="#202d50"/></linearGradient></defs><rect width="400" height="560" fill="url(#avbg)"/><circle cx="310" cy="90" r="65" fill="white" opacity=".3"/>${wings}${tail}<path d="M45 560Q65 380 140 350L200 330 260 350Q335 380 355 560Z" fill="url(#avcoat)"/><path d="M140 350L200 430 260 350 300 560H100Z" fill="#f6f5ff"/><path d="M180 360l20 65 20-65" fill="none" stroke="#d9bd79" stroke-width="7"/><path d="M145 300h110v75q-55 55-110 0Z" fill="${skin}"/>${ear}<path d="M112 165Q115 95 200 95Q285 95 288 165L275 260Q258 316 200 324Q142 316 125 260Z" fill="${skin}" stroke="#d3a9a8" stroke-width="3"/><path d="M145 200q22-18 43 0m24 0q22-18 43 0" fill="none" stroke="#6b5876" stroke-width="7"/><ellipse cx="164" cy="218" rx="13" ry="17" fill="${eye}"/><ellipse cx="236" cy="218" rx="13" ry="17" fill="${eye}"/><circle cx="168" cy="212" r="5" fill="white"/><circle cx="240" cy="212" r="5" fill="white"/><path d="M181 275q19 14 38 0" fill="none" stroke="#b66e7e" stroke-width="4"/>${hairBack.replace('<path d="','<path d="').replace('/>',' fill="'+hair+'" stroke="#655c86" stroke-width="5"/>')}${accessory}<path d="M90 410l55 30-25 120H45Zm220 0-55 30 25 120h75Z" fill="url(#avcoat)"/><path d="M185 448l15 18 15-18-15-24Z" fill="#77c9ff" stroke="white" stroke-width="4"/></svg>`;
}
function hairShapeSVG(style,color){
 const paths={
  "ショート":"M75 112Q70 28 200 28Q330 28 325 112L292 145Q280 92 240 82Q205 118 160 86Q115 95 108 150Z",
  "ミディアム":"M65 110Q65 22 200 22Q335 22 335 110L322 225Q300 245 285 180L282 112Q245 145 205 92Q160 145 118 110L112 205Q85 235 72 180Z",
  "ロング":"M65 105Q65 18 200 18Q335 18 335 105L340 390Q305 420 290 330L285 110Q240 150 200 92Q160 150 115 110L110 360Q75 410 60 330Z",
  "ポニーテール":"M70 110Q65 20 200 20Q335 20 330 110L310 180Q340 190 355 265Q340 315 300 270L285 115Q240 150 200 90Q160 145 115 110L105 205Q75 240 65 180Z",
  "ウェーブ":"M65 115Q60 15 200 20Q340 15 335 115Q320 150 345 185Q315 220 335 260Q295 280 285 180L280 115Q240 145 200 90Q160 145 115 115Q110 185 80 210Q55 175 65 115Z"
 };
 return `<svg class="hair-overlay" viewBox="0 0 400 420" aria-hidden="true"><path d="${paths[style]||paths['ショート']}" fill="${color}" stroke="#665d7b" stroke-width="5" stroke-linejoin="round"/></svg>`;
}
function hairThumb(style){
 const paths={"ショート":"M20 32Q18 5 50 5Q82 5 80 32L72 42Q65 22 50 25Q35 22 28 42Z","ミディアム":"M18 32Q16 5 50 5Q84 5 82 32L80 65 70 67 68 34Q50 45 32 34L30 67 20 65Z","ロング":"M18 32Q16 5 50 5Q84 5 82 32L85 90 72 92 68 34Q50 45 32 34L28 92 15 90Z","ポニーテール":"M18 32Q16 5 50 5Q84 5 82 32L72 45Q92 55 86 76Q70 78 70 58L68 34Q50 45 32 34L28 58 20 48Z","ウェーブ":"M18 32Q16 5 50 5Q84 5 82 32Q75 45 86 55Q72 65 80 78L68 34Q50 45 32 34Q28 50 18 55Q12 42 18 32Z"};
 return `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="${paths[style]}" fill="#8c879f" stroke="#5e5b73" stroke-width="3"/><ellipse cx="50" cy="55" rx="22" ry="28" fill="#f0cfc8"/><path d="M29 55Q50 45 71 55" fill="none" stroke="#5e5b73" stroke-width="3"/></svg>`;
}
function updateAvatar(){
 const raceFiles={"人間":"human.png","エルフ":"elf.png","獣人":"beastkin.png"};
 const file=raceFiles[state.species]||"human.png";
 const alt=`${state.species}の主人公イラスト`;
 const color=hairMap[state.appearance.髪色]||'#29283b';
 for(const id of ['hero-avatar','mini-avatar']){
  const el=document.getElementById(id);
  if(el) el.innerHTML=`<img src="assets/${file}" alt="${alt}" loading="eager"><div class="hair-overlay-wrap">${hairShapeSVG(state.appearance.髪型,color)}</div>`;
 }
}


function render(){
  show("creation-screen");updateAvatar();$("step-count").textContent=`STEP ${state.step+1} / 8`;$("step-caption").textContent=titles[state.step];$("progress-bar").style.width=`${(state.step+1)*12.5}%`;
  $("prev-button").disabled=state.step===0;$("prev-button").style.opacity=state.step===0?".35":"1";$("next-button").textContent=state.step===7?"主人公を作成":"次へ";
  let html="";
  if(state.step===0){html=`<h3 class="step-title">主人公の性別と雰囲気</h3><p class="step-description">性別や雰囲気は能力値・戦闘性能に影響しません。</p><h4>性別</h4><div class="choice-grid">${["男性","女性","その他"].map(x=>choiceCard(x,"",state.gender===x)).join("")}</div><h4>雰囲気</h4><div class="choice-grid">${["穏やか","活発","冷静","勇敢","神秘的"].map(x=>choiceCard(x,"",state.mood===x)).join("")}</div><h4>性格</h4><div class="choice-grid">${["思いやりがある","好奇心旺盛","負けず嫌い","慎重","自由奔放","責任感が強い"].map(x=>choiceCard(x,"",state.personality===x)).join("")}</div>`}
  if(state.step===1){html=`<h3 class="step-title">種族を選択</h3><p class="step-description">種族ごとに成長の得意・不得意があります。${state.species==="獣人"?"獣人の系統も選択してください。":""}</p><div class="choice-grid">${RACES.map(x=>choiceCard(x,DESCRIPTIONS[x],state.species===x)).join("")}</div>${state.species==="獣人"?`<h4>獣人の系統</h4><div class="choice-grid">${BEASTS.map(x=>choiceCard(x,"獣人の特徴タイプ",state.beast===x)).join("")}</div>`:""}`}
  if(state.step===2){html=`<h3 class="step-title">職業を選択</h3><p class="step-description">職業によってレベルアップ時の成長傾向が変わります。</p><div class="choice-grid">${CLASSES.map(x=>choiceCard(x,"成長傾向が異なる職業",state.job===x)).join("")}</div>`}
  if(state.step===3){html=`<h3 class="step-title">外見を設定</h3><p class="step-description">右側では髪型の形だけを選択できます。選んだ髪型・髪色は左側の主人公プレビューに反映されます。</p><h4>髪型</h4><div class="hair-style-grid">${["ショート","ミディアム","ロング","ポニーテール","ウェーブ"].map(x=>`<button class="hair-style ${state.appearance.髪型===x?"selected":""}" data-hair="${x}">${hairThumb(x)}<span>${x}</span></button>`).join("")}</div><div class="appearance-grid"><div class="field"><label>髪色</label><select data-appearance="髪色">${["黒","茶","金","銀","白","赤","青","紫","桃"].map(v=>`<option ${state.appearance.髪色===v?"selected":""}>${v}</option>`).join("")}</select></div><div class="field"><label>目の色</label><select data-appearance="瞳">${["黒","茶","青","緑","赤","金","紫"].map(v=>`<option ${state.appearance.瞳===v?"selected":""}>${v}</option>`).join("")}</select></div><div class="field"><label>肌の色</label><select data-appearance="肌">${["色白","標準","褐色"].map(v=>`<option ${state.appearance.肌===v?"selected":""}>${v}</option>`).join("")}</select></div></div>`}
  if(state.step===4){let used=Object.values(state.extra).reduce((a,b)=>a+b,0);html=`<h3 class="step-title">追加12D6を自由に配分</h3><p class="step-description">各能力値には固定で1D6があります。追加12D6を6つの能力値に配分してください。1能力値につき追加最大10個です。</p><div class="dice-list">${ATTRS.map(([a,n])=>`<div class="dice-row"><span>${n}（${a}）</span><button data-minus="${a}" ${state.extra[a]===0?"disabled":""}>−</button><b>${state.extra[a]}D</b><button data-plus="${a}" ${used>=12||state.extra[a]>=10?"disabled":""}>＋</button></div>`).join("")}</div><div class="dice-total"><span>配分済み：${used} / 12D6</span><span>残り：${12-used}D6</span></div>`}
  if(state.step===5){html=`<h3 class="step-title">能力値をロール</h3><p class="step-description">配分したダイスをすべて振ります。各能力値は「固定1D6＋追加ダイス」の合計です。振り直す場合は追加12D6の配分からやり直します。</p>${state.results?`<div class="roll-grid">${ATTRS.map(([a,n])=>`<div class="stat-card"><span>${n}（${a}）</span><strong>${state.results[a].total}</strong><small>${state.results[a].dice.join(" + ")}<br>${state.results[a].dice.length}個のダイス</small></div>`).join("")}</div><button id="reroll" class="secondary" style="margin-top:16px">振り直す（配分からやり直す）</button>`:`<div class="stat-card"><span>ロール準備</span><strong>12D6 配分完了後に実行</strong><small>下の「能力値を振る」を押すと6能力値をまとめてロールします。</small></div><button id="roll" class="primary" style="margin-top:16px" ${Object.values(state.extra).reduce((a,b)=>a+b,0)!==12?"disabled":""}>能力値を振る</button>`}`;}
  if(state.step===6){html=`<h3 class="step-title">主人公の名前</h3><p class="step-description">好きな名前を入力してください。16文字まで入力できます。</p><div class="field"><label for="hero-name">主人公名</label><input id="hero-name" maxlength="16" placeholder="名前を入力" value="${escapeHtml(state.name)}"></div>`}
  if(state.step===7){html=`<h3 class="step-title">作成内容の最終確認</h3><p class="step-description">内容を確認し、「主人公を作成」を押してください。</p><div class="summary-grid">${[["名前",state.name],["性別",state.gender],["雰囲気",state.mood],["性格",state.personality],["種族",state.species+(state.species==="獣人"?"（"+state.beast+"）":"")],["職業",state.job],...Object.entries(state.appearance)].map(([k,v])=>`<div class="summary-item"><small>${k}</small><strong>${v}</strong></div>`).join("")}</div><h4>能力値</h4><div class="summary-stats">${ATTRS.map(([a,n])=>`<span>${n}：${state.results?.[a]?.total??"未ロール"}</span>`).join("")}</div>`}
  $("step-content").innerHTML=html;
  const previewSpecies=$("preview-species"); if(previewSpecies) previewSpecies.textContent=`${state.species}${state.species==="獣人"?"（"+state.beast+"）":""} / ${state.job}`;
  const previewMood=$("preview-mood"); if(previewMood) previewMood.textContent=`${state.gender}・${state.mood}`;
  document.querySelectorAll(".step-pills span").forEach((el,i)=>el.classList.toggle("active",(state.step===0?1:state.step===1?0:state.step<=3?2:3)===i));
  $("step-content").querySelectorAll("[data-choice]").forEach(btn=>btn.addEventListener("click",()=>selectChoice(decodeURIComponent(btn.dataset.choice))));
  $("step-content").querySelectorAll("[data-appearance]").forEach(el=>el.addEventListener("change",()=>{state.appearance[el.dataset.appearance]=el.value;updateAvatar()}));
  $("step-content").querySelectorAll("[data-hair]").forEach(btn=>btn.addEventListener("click",()=>{state.appearance.髪型=btn.dataset.hair;render()}));
  $("step-content").querySelectorAll("[data-plus]").forEach(btn=>btn.addEventListener("click",()=>{let a=btn.dataset.plus;if(state.extra[a]<10&&Object.values(state.extra).reduce((x,y)=>x+y,0)<12)state.extra[a]++;render()}));
  $("step-content").querySelectorAll("[data-minus]").forEach(btn=>btn.addEventListener("click",()=>{let a=btn.dataset.minus;if(state.extra[a]>0)state.extra[a]--;render()}));
  const roll=$("roll");if(roll)roll.addEventListener("click",rollStats);
  const reroll=$("reroll");if(reroll)reroll.addEventListener("click",()=>{state.results=null;state.extra=Object.fromEntries(ATTRS.map(([a])=>[a,0]));state.step=4;render()});
  const name=$("hero-name");if(name)name.addEventListener("input",()=>state.name=name.value);
}
function selectChoice(v){if(state.step===0){if(["男性","女性","その他"].includes(v))state.gender=v;else if(["穏やか","活発","冷静","勇敢","神秘的"].includes(v))state.mood=v;else state.personality=v}
 if(state.step===1){if(RACES.includes(v)){state.species=v;if(v!=="獣人")state.beast="猫系"}else if(BEASTS.includes(v))state.beast=v}
 if(state.step===2)state.job=v;render()}
function rollStats(){if(Object.values(state.extra).reduce((a,b)=>a+b,0)!==12)return;state.results={};ATTRS.forEach(([a])=>{let dice=Array.from({length:1+state.extra[a]},()=>1+Math.floor(Math.random()*6));state.results[a]={dice,total:dice.reduce((x,y)=>x+y,0)}});render()}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function next(){if(state.step===4&&Object.values(state.extra).reduce((a,b)=>a+b,0)!==12){alert("追加12D6をすべて配分してください。");return}if(state.step===5&&!state.results){alert("先に能力値を振ってください。");return}if(state.step===6&&!state.name.trim()){alert("主人公の名前を入力してください。");return}if(state.step<7){state.step++;render()}else finish()}
function finish(){const hero={name:state.name.trim(),gender:state.gender,mood:state.mood,personality:state.personality,species:state.species,beastType:state.species==="獣人"?state.beast:"",job:state.job,appearance:state.appearance,extraDice:state.extra,initialAttributes:Object.fromEntries(ATTRS.map(([a])=>[a,state.results[a].total])),level:1,exp:0,createdAt:new Date().toISOString()};localStorage.setItem("fantasyRpgLastHero",JSON.stringify(hero));$("hero-summary").innerHTML=`<div class="summary-grid"><div class="summary-item"><small>主人公</small><strong>${escapeHtml(hero.name)}</strong></div><div class="summary-item"><small>種族・職業</small><strong>${escapeHtml(hero.species+(hero.beastType?"（"+hero.beastType+"）":"")+" / "+hero.job)}</strong></div></div><div class="summary-stats">${ATTRS.map(([a,n])=>`<span>${n}：${hero.initialAttributes[a]}</span>`).join("")}</div>`;show("complete-screen");$("download-hero").onclick=()=>{let blob=new Blob([JSON.stringify(hero,null,2)],{type:"application/json"});let a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="主人公データ.json";a.click();URL.revokeObjectURL(a.href)}}
$("start-button").addEventListener("click",()=>{state.step=0;render()});$("prev-button").addEventListener("click",()=>{if(state.step>0){state.step--;render()}});$("next-button").addEventListener("click",next);$("back-title").addEventListener("click",()=>show("title-screen"));$("restart-button").addEventListener("click",()=>show("title-screen"));
