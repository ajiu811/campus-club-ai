/* 团团 AI 助手 · 扣子智能体代理服务（零依赖，Node 18+）
 *
 * 作用：把个人访问令牌（PAT）留在服务端，前端只调用本机 /api/chat，
 *      页面源码里不再出现任何令牌，避免被直接扒走刷额度。
 *
 * 启动：node server/server.js
 * 访问：http://localhost:8787
 * 配置：在 server/token.json 填 {"bot_id":"...","pat":"pat_xxx"}
 *      或用环境变量 COZE_BOT_ID / COZE_PAT 覆盖
 * 调试：MOCK=1 node server/server.js  —— 不调扣子，返回固定回复，便于先调界面
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PORT = +(process.env.PORT || 8787);
const API_BASE = process.env.COZE_API_BASE || 'https://api.coze.cn';
const MOCK = process.env.MOCK === '1';

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.webp': 'image/webp',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.md': 'text/markdown; charset=utf-8'
};

function loadCfg() {
  let f = {};
  try { f = JSON.parse(fs.readFileSync(path.join(__dirname, 'token.json'), 'utf8')); } catch (e) {}
  return {
    bot_id: String(process.env.COZE_BOT_ID || f.bot_id || '').trim(),
    pat: String(process.env.COZE_PAT || f.pat || '').trim()
  };
}

/* ---- 令牌自助配置页：在浏览器里粘贴 PAT，服务端即时校验并落盘 ---- */
const SETUP_HTML = `<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>团团 · 令牌配置</title>
<style>
:root{--brand:#2f6bd8;--line:#e2e8f4;--ink:#1d2740;--sub:#63718f}
*{box-sizing:border-box}
body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f4f7fd;color:var(--ink);
 font:15px/1.6 -apple-system,"Segoe UI","Microsoft YaHei",sans-serif}
.card{width:min(680px,92vw);background:#fff;border:1px solid var(--line);border-radius:18px;
 box-shadow:0 12px 40px rgba(30,60,110,.08);padding:30px 32px 26px}
h1{margin:0 0 6px;font-size:20px}
p.sub{margin:0 0 20px;color:var(--sub);font-size:13.5px}
label{display:block;font-size:13px;color:var(--sub);margin:16px 0 6px}
input{width:100%;padding:11px 13px;border:1px solid var(--line);border-radius:10px;font:14px/1.4 ui-monospace,Consolas,monospace;outline:none}
input:focus{border-color:var(--brand);box-shadow:0 0 0 3px rgba(47,107,216,.12)}
button{margin-top:20px;width:100%;padding:12px;border:0;border-radius:10px;background:var(--brand);color:#fff;
 font-size:15px;font-weight:600;cursor:pointer}
button:disabled{opacity:.6;cursor:default}
#out{margin-top:18px;padding:13px 15px;border-radius:10px;font-size:13.5px;display:none;white-space:pre-wrap;word-break:break-all}
#out.ok{display:block;background:#eefaf1;border:1px solid #c8ecd4;color:#1c6b3a}
#out.bad{display:block;background:#fdf0f0;border:1px solid #f3d2d2;color:#a23a3a}
#out.wait{display:block;background:#f1f6ff;border:1px solid #d6e3fb;color:#2a5bb5}
.tip{margin-top:16px;font-size:12.5px;color:var(--sub);line-height:1.75}
code{background:#f3f6fc;padding:1px 5px;border-radius:4px;font-size:12.5px}
</style></head><body>
<div class="card">
  <h1>团团 · 令牌配置</h1>
  <p class="sub">粘贴扣子「个人访问令牌」（以 <code>pat_</code> 开头）。令牌只写入本机 server/token.json，不会出现在网页源码里。</p>
  <label>个人访问令牌 (PAT)</label>
  <input id="pat" type="text" spellcheck="false" autocomplete="off" placeholder="pat_...">
  <label>智能体 ID (bot_id)</label>
  <input id="bot" type="text" spellcheck="false" value="7706515043776938025">
  <button id="go">保存并校验</button>
  <div id="out"></div>
  <div class="tip">
    校验会真的调用一次扣子接口：返回「团团」的名字说明令牌可用；返回 4100/4101 说明令牌本身不被接受，
    需要回 <code>https://www.coze.cn/open/oauth/pats</code> 重新生成（有效期选 30 天，工作空间勾选该智能体所在空间）。
  </div>
</div>
<script>
var btn=document.getElementById('go'), out=document.getElementById('out');
function show(cls,txt){ out.className=cls; out.textContent=txt; }
btn.addEventListener('click', function(){
  var pat=document.getElementById('pat').value.trim();
  var bot=document.getElementById('bot').value.trim();
  if(!pat){ show('bad','请先粘贴令牌'); return; }
  btn.disabled=true; show('wait','正在保存并校验…');
  fetch('/api/token',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({pat:pat,bot_id:bot})})
    .then(function(r){ return r.json(); })
    .then(function(d){
      btn.disabled=false;
      if(d.ok){ show('ok','已保存，令牌有效。\\n智能体：'+(d.name||'（未返回名称）')+'\\n指纹：'+(d.fp||'')+'\\n现在回到 http://localhost:8787 点右下角团团球即可真实对话。'); }
      else { show('bad','已保存，但校验失败。\\n错误码：'+d.code+'\\n详情：'+d.msg+'\\n本页收到的令牌指纹：'+(d.fp||'')); }
    })
    .catch(function(e){ btn.disabled=false; show('bad','请求失败：'+e.message); });
});
</script></body></html>`;

async function verifyPat(pat, botId) {
  try {
    const r = await fetch(API_BASE + '/v1/bot/get_online_info?bot_id=' + encodeURIComponent(botId), {
      headers: { Authorization: 'Bearer ' + pat }
    });
    const txt = await r.text();
    let d = {}; try { d = JSON.parse(txt); } catch (e) {}
    if (d.code === 0) return { ok: true, name: (d.data && d.data.name) || '' };
    return { ok: false, code: d.code || r.status, msg: d.msg || txt.slice(0, 200) };
  } catch (e) {
    return { ok: false, code: 'NET', msg: e.message };
  }
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400'
};

function json(res, code, obj) {
  const s = JSON.stringify(obj);
  res.writeHead(code, Object.assign({ 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(s) }, CORS));
  res.end(s);
}

function staticFile(req, res, pathname) {
  let rel = decodeURIComponent(pathname.split('?')[0]);
  if (rel === '/' || rel === '') rel = '/index.html';
  const full = path.normalize(path.join(ROOT, rel));
  if (!full.startsWith(ROOT)) return json(res, 403, { error: 'forbidden' });
  fs.stat(full, (err, st) => {
    if (err || !st.isFile()) return json(res, 404, { error: 'not found' });
    res.writeHead(200, { 'Content-Type': MIME[path.extname(full).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    fs.createReadStream(full).pipe(res);
  });
}

/* ---- 对话代理：把扣子的 SSE 简化成 {t:'d'|'done'|'err'} 事件 ---- */
function sse(res, obj) { res.write('data: ' + JSON.stringify(obj) + '\n\n'); }

function mockReply(res, msg) {
  const canned = '（演示模式）我听到你说：「' + msg + '」。\n\n' +
    '现在还没有接入真实令牌，所以这条是本地固定回复。把 server/token.json 里的 pat 换成有效令牌后重启服务，我就能用真实智能体回答你了。';
  let i = 0;
  const timer = setInterval(() => {
    if (res.writableEnded) return clearInterval(timer);
    sse(res, { t: 'd', v: canned.slice(i, i + 6) }); i += 6;
    if (i >= canned.length) { clearInterval(timer); sse(res, { t: 'done', cid: 'mock-' + Date.now() }); res.end(); }
  }, 45);
}

async function proxyChat(req, res, body) {
  const cfg = loadCfg();
  let msg = '', cid = '';
  try { const p = JSON.parse(body || '{}'); msg = String(p.message || '').trim(); cid = String(p.conversation_id || '').trim(); } catch (e) {}
  if (!msg) return json(res, 400, { error: 'message 不能为空' });

  res.writeHead(200, Object.assign({ 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-cache, no-transform', Connection: 'keep-alive', 'X-Accel-Buffering': 'no' }, CORS));
  res.write(': ok\n\n');

  if (MOCK) return mockReply(res, msg);
  if (!cfg.bot_id || !cfg.pat) { sse(res, { t: 'err', msg: '服务端尚未配置令牌：请在 server/token.json 填写 bot_id 与 pat 后重启。' }); return res.end(); }

  const payload = {
    bot_id: cfg.bot_id,
    user_id: 'tt-web-' + (req.headers['x-tt-uid'] || 'demo'),
    stream: true,
    auto_save_history: true,
    additional_messages: [{ role: 'user', content: msg, content_type: 'text' }]
  };
  if (cid) payload.conversation_id = cid;

  let up;
  try {
    up = await fetch(API_BASE + '/v3/chat', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + cfg.pat, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (e) {
    sse(res, { t: 'err', msg: '无法连接扣子接口：' + e.message }); return res.end();
  }

  const ctype = up.headers.get('content-type') || '';
  if (!up.ok || ctype.includes('application/json')) {
    let detail = '';
    try { detail = await up.text(); } catch (e) {}
    let code = up.status, hint = '';
    const m = detail.match(/"code"\s*:\s*(\d+)/); if (m) code = +m[1];
    if (code === 4100) hint = '令牌无效（4100）：请确认 server/token.json 里的 pat 是以 pat_ 开头、未过期的个人访问令牌。';
    else if (code === 4101) hint = '令牌有问题（4101）：可能是令牌字符串不对/已过期，也可能是该令牌没有授权这个智能体所在的 工作空间 与「对话」权限。';
    else if (code === 4200) hint = '找不到智能体（4200）：请确认 bot_id 正确，且智能体已发布到 Chat SDK 渠道。';
    else if (code === 4028 || code === 4022) hint = '扣子账号积分/额度不足（' + code + '）。';
    else hint = '扣子接口返回 ' + code + '：' + detail.slice(0, 200);
    sse(res, { t: 'err', msg: hint }); return res.end();
  }

  const reader = up.body.getReader();
  const dec = new TextDecoder();
  let buf = '', outCid = cid, wrote = false, acc = '';

  const handle = (chunk) => {
    const lines = chunk.split('\n');
    let ev = '', data = '';
    for (const ln of lines) {
      if (ln.startsWith('event:')) ev = ln.slice(6).trim();
      else if (ln.startsWith('data:')) data += ln.slice(5).trim();
    }
    if (!data) return;
    let d = null;
    try { d = JSON.parse(data); } catch (e) { return; }
    if (d.conversation_id && !outCid) outCid = d.conversation_id;
    if (ev === 'done' || d.event === 'done') return;
    if (d.type === 'answer' && typeof d.content === 'string' && d.content) {
      const txt = d.content;
      if (ev === 'conversation.message.completed') {
        /* 增量已推送过的内容不再补发，避免同一段回答出现两遍 */
        if (!acc) { wrote = true; sse(res, { t: 'd', v: txt }); acc = txt; }
      } else {
        wrote = true; sse(res, { t: 'd', v: txt }); acc += txt;
      }
    } else if (d.type === 'follow_up' && d.content) {
      try { const arr = JSON.parse(d.content); if (Array.isArray(arr) && arr.length) sse(res, { t: 'sug', v: arr.slice(0, 3) }); } catch (e) {}
    }
  };

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      let i;
      while ((i = buf.indexOf('\n\n')) >= 0) { handle(buf.slice(0, i)); buf = buf.slice(i + 2); }
    }
    if (buf.trim()) handle(buf);
    if (!wrote) sse(res, { t: 'err', msg: '智能体没有返回内容，请稍后重试，或检查智能体是否已发布。' });
    else sse(res, { t: 'done', cid: outCid });
  } catch (e) {
    sse(res, { t: 'err', msg: '读取回复时出错：' + e.message });
  }
  res.end();
}

const server = http.createServer((req, res) => {
  const u = new URL(req.url, 'http://' + (req.headers.host || 'localhost'));
  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS);
    return res.end();
  }
  if (u.pathname === '/setup') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' });
    return res.end(SETUP_HTML);
  }
  if (u.pathname === '/api/token' && req.method === 'POST') {
    let body = '';
    req.on('data', c => { body += c; if (body.length > 1e5) req.destroy(); });
    req.on('end', async () => {
      let p = {}; try { p = JSON.parse(body || '{}'); } catch (e) {}
      const pat = String(p.pat || '').replace(/[\s"'`]/g, '');
      const bot = String(p.bot_id || '').trim() || loadCfg().bot_id;
      if (!pat) return json(res, 400, { ok: false, code: 'EMPTY', msg: '令牌为空' });
      if (!bot) return json(res, 400, { ok: false, code: 'EMPTY', msg: 'bot_id 为空' });
      fs.writeFileSync(path.join(__dirname, 'token.json'), JSON.stringify({ bot_id: bot, pat: pat }, null, 2) + '\n', 'utf8');
      const v = await verifyPat(pat, bot);
      const fp = 'len=' + pat.length + ' · sha1=' + require('crypto').createHash('sha1').update(pat).digest('hex').slice(0, 10) +
        ' · ' + pat.slice(0, 8) + '…' + pat.slice(-4);
      json(res, 200, Object.assign({ bot_id: bot, pat_len: pat.length, fp: fp }, v));
    });
    return;
  }
  if (u.pathname === '/api/health') {
    const cfg = loadCfg();
    return json(res, 200, { ok: true, mock: MOCK, configured: !!(cfg.bot_id && cfg.pat), bot_id: cfg.bot_id ? cfg.bot_id.slice(0, 6) + '…' : '' });
  }
  if (u.pathname === '/api/chat' && req.method === 'POST') {
    let body = '';
    req.on('data', c => { body += c; if (body.length > 1e6) req.destroy(); });
    req.on('end', () => proxyChat(req, res, body));
    return;
  }
  if (req.method === 'GET' || req.method === 'HEAD') return staticFile(req, res, u.pathname);
  json(res, 405, { error: 'method not allowed' });
});

server.listen(PORT, () => {
  const cfg = loadCfg();
  console.log('团团代理已启动：http://localhost:' + PORT);
  console.log('  bot_id : ' + (cfg.bot_id || '（未配置）'));
  console.log('  token  : ' + (cfg.pat ? '已配置（' + cfg.pat.slice(0, 3) + '…' + cfg.pat.slice(-4) + '）' : '（未配置，去填 server/token.json）'));
  if (MOCK) console.log('  模式：MOCK（返回固定回复，不调用扣子）');
});
