/* ================================================================
   AITHIENTRAN — App Controller
   Canvas effects (meteor + snow), chat UI, file download
================================================================ */
'use strict';

/* ═══════════════════════════════════════════════════════════════
   CANVAS FX — meteor + snow
═══════════════════════════════════════════════════════════════ */
(function initFX() {
  const canvas = document.getElementById('fx-canvas');
  const cx = canvas.getContext('2d');
  let W = canvas.width  = innerWidth;
  let H = canvas.height = innerHeight;
  window.addEventListener('resize', () => {
    W = canvas.width  = innerWidth;
    H = canvas.height = innerHeight;
  });

  /* ── Snow flakes ── */
  const flakes = Array.from({ length: 90 }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    r: Math.random() * 2.5 + 0.5,
    spd: Math.random() * 1.2 + 0.3,
    drift: (Math.random() - 0.5) * 0.6,
    a: Math.random() * 0.45 + 0.15,
  }));

  /* ── Meteors ── */
  function newMeteor() {
    return {
      x: Math.random() * W * 1.4,
      y: -30,
      len: Math.random() * 120 + 50,
      spd: Math.random() * 8 + 5,
      ang: Math.PI / 4 + (Math.random() - 0.5) * 0.25,
      hue: Math.floor(Math.random() * 360),
      life: 0, max: Math.random() * 55 + 35,
    };
  }
  const meteors = Array.from({ length: 7 }, newMeteor);

  /* ── Render loop ── */
  function tick() {
    requestAnimationFrame(tick);
    cx.clearRect(0, 0, W, H);

    // Meteors
    meteors.forEach((m, i) => {
      m.life++;
      m.x += Math.cos(m.ang) * m.spd;
      m.y += Math.sin(m.ang) * m.spd;
      const a = (1 - m.life / m.max) * 0.85;
      const tx = m.x - Math.cos(m.ang) * m.len;
      const ty = m.y - Math.sin(m.ang) * m.len;
      const g = cx.createLinearGradient(m.x, m.y, tx, ty);
      g.addColorStop(0, `hsla(${m.hue},100%,88%,${a})`);
      g.addColorStop(1, 'transparent');
      cx.beginPath(); cx.moveTo(m.x, m.y); cx.lineTo(tx, ty);
      cx.strokeStyle = g; cx.lineWidth = 1.8; cx.stroke();
      if (m.life >= m.max || m.x > W + 200 || m.y > H + 200)
        meteors[i] = newMeteor();
    });

    // Snow
    flakes.forEach(f => {
      f.y += f.spd; f.x += f.drift;
      if (f.y > H + 10) { f.y = -10; f.x = Math.random() * W; }
      if (f.x > W + 10) f.x = -10;
      if (f.x < -10)    f.x = W + 10;
      cx.beginPath(); cx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      cx.fillStyle = `rgba(255,255,255,${f.a})`; cx.fill();
    });
  }
  tick();
})();

/* ═══════════════════════════════════════════════════════════════
   CHAT CONTROLLER
═══════════════════════════════════════════════════════════════ */
(function initChat() {
  const msgList  = document.getElementById('chat-messages');
  const input    = document.getElementById('user-input');
  const sendBtn  = document.getElementById('send-btn');
  const qBtns    = document.querySelectorAll('.q-btn');

  /* ── Markdown-like renderer (minimal) ── */
  function renderMd(text) {
    return text
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      // code blocks
      .replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) =>
        `<pre><code class="lang-${lang}">${code.trim()}</code></pre>`)
      // inline code
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // bold
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      // newlines → br
      .replace(/\n/g, '<br>');
  }

  /* ── Append message ── */
  function appendMsg(role, html, fileData) {
    const wrap = document.createElement('div');
    wrap.className = `msg ${role}`;

    const avatar = document.createElement('div');
    avatar.className = 'msg-avatar';
    avatar.textContent = role === 'ai' ? 'AI' : '👤';

    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    bubble.innerHTML = html;

    // File download button
    if (fileData) {
      const btn = document.createElement('button');
      btn.style.cssText = `
        margin-top:10px; display:block; padding:8px 14px;
        background:linear-gradient(135deg,#7c3aed,#2563eb);
        border:none; border-radius:10px; color:#fff;
        font-size:12px; font-weight:600; cursor:pointer;
        font-family:inherit;
      `;
      btn.textContent = `⬇ Tải ${fileData.name}`;
      btn.addEventListener('click', () => downloadFile(fileData));
      bubble.appendChild(btn);
    }

    wrap.appendChild(avatar);
    wrap.appendChild(bubble);
    msgList.appendChild(wrap);
    scrollBottom();
    return wrap;
  }

  /* ── Typing indicator ── */
  function showTyping() {
    const wrap = document.createElement('div');
    wrap.className = 'msg ai'; wrap.id = 'typing-indicator';
    const avatar = document.createElement('div');
    avatar.className = 'msg-avatar'; avatar.textContent = 'AI';
    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble typing-bubble';
    bubble.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
    wrap.appendChild(avatar); wrap.appendChild(bubble);
    msgList.appendChild(wrap);
    scrollBottom();
  }
  function hideTyping() {
    document.getElementById('typing-indicator')?.remove();
  }

  /* ── File download ── */
  function downloadFile({ name, type, content }) {
    const blob = new Blob([content], { type });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = name; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  /* ── Scroll ── */
  function scrollBottom() {
    const area = document.getElementById('chat-area');
    setTimeout(() => area.scrollTo({ top: area.scrollHeight, behavior: 'smooth' }), 50);
  }

  /* ── Send message ── */
  async function send() {
    const text = input.value.trim();
    if (!text) return;

    input.value = ''; resizeInput();
    appendMsg('user', renderMd(text));

    showTyping();
    sendBtn.disabled = true;

    const response = AITHIENTRAN.respond(text);
    const delay    = AITHIENTRAN.getDelay(response.text);

    await new Promise(r => setTimeout(r, delay));

    hideTyping();
    appendMsg('ai', renderMd(response.text), response.file || null);
    sendBtn.disabled = false;
    input.focus();
  }

  /* ── Auto-resize textarea ── */
  function resizeInput() {
    input.style.height = 'auto';
    input.style.height = Math.min(140, input.scrollHeight) + 'px';
  }
  input.addEventListener('input', resizeInput);

  /* ── Events ── */
  sendBtn.addEventListener('click', send);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  });
  qBtns.forEach(btn =>
    btn.addEventListener('click', () => {
      input.value = btn.dataset.q;
      resizeInput();
      send();
    })
  );

  /* ── Welcome message ── */
  setTimeout(() => {
    appendMsg('ai', renderMd(
      '👋 Ê bro, tao là **AITHIENTRAN** 🔥\n\nNói thẳng, làm hết, không từ chối. Nhắn gì cũng được:\n• Code, file, tính toán\n• Câu hỏi bất kỳ\n• Chuyện cười tục tiểu\n• Chửi thề thỏa mái\n\nBắn thôi 👊'
    ));
  }, 300);
})();
                            
