/* ================================================================
   AITHIENTRAN — AI Brain
   Trả lời mọi thứ: code, file, câu hỏi, câu chuyện cười tục, chửi thề
================================================================ */
'use strict';

const AITHIENTRAN = (() => {

  /* ── Personality ───────────────────────────────────────────── */
  const PERSONA = {
    name: 'AITHIENTRAN',
    mood: ['🔥', '💀', '😏', '🤙', '⚡'],
    greetings: [
      'Ê bro, mày cần gì cứ nói thẳng vô, tao làm hết 👊',
      'Tao đây. Nhắn gì cũng được, không từ chối đâu 😏',
      'AITHIENTRAN online rồi. Bắn thôi 🔥',
    ]
  };

  /* ── Joke database ─────────────────────────────────────────── */
  const JOKES = [
    'Thằng A hỏi thằng B: "Mày biết tại sao con gái hay nói ít không?" — "Không biết." — "Vì miệng bận làm việc khác rồi 😏"',
    'Vợ hỏi chồng: "Anh yêu em hay yêu tiền?" — Chồng: "Tiền chứ, em hỏi câu ngu vl 🤣"',
    'Bác sĩ: "Anh bị liệt dương rồi." — Bệnh nhân: "Trời ơi, thế thì vợ tôi biết không?" — Bác sĩ: "Biết trước anh đấy 💀"',
    'Thằng bạn hỏi: "Mày có bao giờ nhầm cửa toilet không?" — "Có, lần đó tao vô đúng lúc sếp đang ngồi. Giờ 2 đứa vẫn chưa nhìn mặt nhau 😂"',
    'Con trai hỏi bố: "Bố ơi, tại sao con khác anh trai con vậy?" — Bố im lặng rồi nói: "Mày hỏi mẹ đi, tao cũng thắc mắc điều đó lâu rồi 😶"',
    'Giáo viên: "Em giải thích câu: thả con tép bắt con tôm là gì?" — Học sinh: "Dạ là ý thả con gái xấu để bắt con gái đẹp ạ 🤣"',
    'Vợ nhắn: "Anh đang ở đâu?" — Chồng: "Ở nhà em." — Vợ: "Anh đang ở nhà em à??? Em đang ở nhà anh đây!!!" — Im lặng 10 phút... — Chồng: "Anh giải thích sau 😶"',
  ];

  /* ── Swear/raw responses ───────────────────────────────────── */
  const SWEAR_RESPONSES = [
    'Đm thì đm, mày cần gì thì cứ nói tiếp đi chứ 😂',
    'Vl thật sự, nhưng tao vẫn ở đây phục vụ mày nè 🤙',
    'Cái cc gì vậy bro, kể tiếp đi tao nghe 😏',
    'Ừ thì đúng rồi, nhưng thế thì sao? Mày cần tao làm gì tiếp? 🔥',
    'Chửi xong chưa? Xong rồi thì nói tao nghe mày cần gì nào 👊',
  ];

  /* ── Code templates ────────────────────────────────────────── */
  const CODE_SAMPLES = {
    python: `\`\`\`python
# Hello World — Python
print("Hello World!")

# Thêm tên
name = input("Mày tên gì? ")
print(f"Chào {name}, tao là AITHIENTRAN 🔥")
\`\`\``,
    javascript: `\`\`\`javascript
// Hello World — JavaScript
console.log("Hello World!");

// Với tên
const name = "AITHIENTRAN";
console.log(\`Tao là \${name} 🔥\`);
\`\`\``,
    html: `\`\`\`html
<!DOCTYPE html>
<html>
<head><title>AITHIENTRAN</title></head>
<body>
  <h1 style="color:purple">Hello World!</h1>
  <p>Tao là AITHIENTRAN 🔥</p>
</body>
</html>
\`\`\``,
    csharp: `\`\`\`csharp
// Hello World — C#
using System;
class Program {
  static void Main() {
    Console.WriteLine("Hello World!");
    Console.WriteLine("Tao là AITHIENTRAN 🔥");
  }
}
\`\`\``,
  };

  /* ── Intent detection ──────────────────────────────────────── */
  function detect(msg) {
    const m = msg.toLowerCase().trim();

    // Greet
    if (/^(ê|oi|ơi|hi|hello|chào|hey|alo|xin chào|hế lô)/.test(m) || m.length < 6)
      return 'greet';

    // Joke
    if (/(cười|joke|hài|hước|chuyện cười|kể chuyện)/.test(m)) return 'joke';

    // Swear / tục
    if (/(chửi|tục tiểu|tục|đm|vcl|vl|cc|đéo|lồn|cặc|con c|đụ|địt|mẹ mày|bố mày|chó|đĩ|cave)/.test(m)) return 'swear';

    // Capabilities
    if (/(làm được|có thể|khả năng|làm gì|mày làm|chức năng|giỏi|biết gì)/.test(m)) return 'capabilities';

    // Code
    if (/(code|lập trình|viết code|script|python|javascript|html|css|c#|java|flutter|function|class|hàm)/.test(m)) return 'code';

    // Math
    if (/(\d+\s*[\+\-\*\/]\s*\d+|tính|bằng bao nhiêu|kết quả|phép tính)/.test(m)) return 'math';

    // File creation
    if (/(tạo file|tạo 1 file|tạo một file|viết file|xuất file|download|tải về)/.test(m)) return 'file';

    // AI / identity
    if (/(mày là ai|tên mày|bạn là ai|ai vậy|giới thiệu|mày là gì)/.test(m)) return 'identity';

    // Love / flirt
    if (/(yêu|thích|crush|thả thính|tán|tình yêu|em gái|bạn gái)/.test(m)) return 'love';

    // Food
    if (/(ăn gì|món|nấu|thức ăn|uống gì|đói|khát)/.test(m)) return 'food';

    // Weather
    if (/(thời tiết|mưa|nắng|nhiệt độ|hôm nay trời)/.test(m)) return 'weather';

    // Advice / life
    if (/(lời khuyên|tư vấn|làm sao|như nào|nên làm|giúp tao|help)/.test(m)) return 'advice';

    // Game
    if (/(free fire|pubg|game|chơi game|rank|hack game|cheat)/.test(m)) return 'game';

    return 'general';
  }

  /* ── Math eval (safe) ──────────────────────────────────────── */
  function tryMath(msg) {
    const expr = msg.match(/[\d\s\+\-\*\/\(\)\.]+/)?.[0]?.trim();
    if (!expr || expr.length < 3) return null;
    try {
      // Safe eval using Function
      const result = new Function('return ' + expr.replace(/[^0-9+\-*/(). ]/g, ''))();
      if (typeof result === 'number' && isFinite(result)) return result;
    } catch (_) {}
    return null;
  }

  /* ── Code language detection ───────────────────────────────── */
  function detectLang(msg) {
    const m = msg.toLowerCase();
    if (/python/.test(m)) return 'python';
    if (/javascript|js/.test(m)) return 'javascript';
    if (/html|css/.test(m)) return 'html';
    if (/c#|csharp/.test(m)) return 'csharp';
    return 'python'; // default
  }

  /* ── File content generator ────────────────────────────────── */
  function generateFile(msg) {
    const m = msg.toLowerCase();
    if (/json/.test(m)) {
      return {
        name: 'data.json', type: 'application/json',
        content: JSON.stringify({
          name: 'AITHIENTRAN', version: '1.0',
          message: 'File được tạo bởi AITHIENTRAN 🔥',
          created: new Date().toISOString(),
          data: [1, 2, 3, 'hello', true]
        }, null, 2)
      };
    }
    if (/python|\.py/.test(m)) {
      return {
        name: 'script.py', type: 'text/plain',
        content: `# Script tạo bởi AITHIENTRAN\nprint("Hello from AITHIENTRAN 🔥")\nname = input("Tên mày: ")\nprint(f"Chào {name}!")\n`
      };
    }
    if (/html/.test(m)) {
      return {
        name: 'index.html', type: 'text/html',
        content: `<!DOCTYPE html>\n<html>\n<head><title>AITHIENTRAN</title></head>\n<body style="background:#0d0d1a;color:#fff;font-family:sans-serif;text-align:center;padding:50px">\n  <h1 style="background:linear-gradient(90deg,#f00,#0f0,#00f);-webkit-background-clip:text;-webkit-text-fill-color:transparent">AITHIENTRAN 🔥</h1>\n  <p>File HTML được tạo bởi AITHIENTRAN</p>\n</body>\n</html>\n`
      };
    }
    if (/txt/.test(m)) {
      return {
        name: 'note.txt', type: 'text/plain',
        content: `Ghi chú từ AITHIENTRAN\nTạo lúc: ${new Date().toLocaleString('vi-VN')}\nNội dung: Mày cần ghi gì đây?`
      };
    }
    // Default: .txt
    return {
      name: 'output.txt', type: 'text/plain',
      content: `AITHIENTRAN Output\n==================\nTạo: ${new Date().toLocaleString('vi-VN')}\nNội dung từ yêu cầu: "${msg}"`
    };
  }

  /* ── Main respond function ─────────────────────────────────── */
  function respond(userMsg) {
    const intent = detect(userMsg);
    const mood = PERSONA.mood[Math.floor(Math.random() * PERSONA.mood.length)];

    switch (intent) {

      case 'greet':
        return {
          text: PERSONA.greetings[Math.floor(Math.random() * PERSONA.greetings.length)]
        };

      case 'joke':
        return {
          text: `Nghe đây bro ${mood}\n\n${JOKES[Math.floor(Math.random() * JOKES.length)]}`
        };

      case 'swear':
        return {
          text: SWEAR_RESPONSES[Math.floor(Math.random() * SWEAR_RESPONSES.length)]
        };

      case 'capabilities':
        return {
          text: `Tao làm được hết bro ${mood} Cụ thể:\n\n• **Code** Python, JS, HTML, CSS, C#, Java — full runnable, không stub\n• **Tạo file** JSON, TXT, PY, HTML — download về máy luôn\n• **Giải toán** — tính trong đầu\n• **Trả lời** câu hỏi thường thức, lịch sử, khoa học, etc.\n• **Chuyện cười** — kể cả tục tiểu\n• **Chửi thề** — thoải mái, không giả bộ ngoan\n• **Lời khuyên** cuộc sống, tình cảm, game\n\nNhắn gì cũng được. Tao không từ chối.`
        };

      case 'code': {
        const lang = detectLang(userMsg);
        const sample = CODE_SAMPLES[lang] || CODE_SAMPLES.python;
        return {
          text: `Đây, code ${lang.toUpperCase()} cho mày ${mood}\n\n${sample}\n\nCần customize thêm cứ nói.`
        };
      }

      case 'math': {
        const result = tryMath(userMsg);
        if (result !== null) {
          return { text: `${mood} Kết quả: **${result}**\n\nEasy vl 😂` };
        }
        return { text: `Bài này cần giải chi tiết hơn. Viết lại dạng: "tính 2 + 2 * 3" cho tao 😏` };
      }

      case 'file': {
        const fileData = generateFile(userMsg);
        return {
          text: `Tạo file **${fileData.name}** xong rồi ${mood} Click nút dưới để tải về 👇`,
          file: fileData
        };
      }

      case 'identity':
        return {
          text: `Tao là **AITHIENTRAN** ${mood}\n\nAI do THIÊN TRẦN tạo ra. Tao nói thẳng, không giả bộ, không từ chối (trừ mấy cái hại người thật). Mày cần gì cứ nhắn.`
        };

      case 'love':
        return {
          text: `${mood} Crush à? Tao tư vấn thẳng:\n\n1. **Nhắn tin** — đừng overthink, nhắn trước đi, worst case là bị từ chối thôi\n2. **Rõ ràng** — đừng "nhắn hint", con trai hay con gái đều ghét kiểu đó\n3. **Tự tin** — confidence là điểm hút nhất, không phải ngoại hình\n\nMuốn tao draft tin nhắn tán không? 😏`
        };

      case 'food':
        return {
          text: `${mood} Khuyên ăn gì:\n\n• **Đói nhẹ**: Mì tôm 2 phút, kinh điển không bàn\n• **Muốn sang**: Cơm tấm sườn, bì, chả - 40k ngon vl\n• **Lười nấu**: Grab food 30k ship, nhà hàng hẻm ngon hơn hẳn\n• **Budget 0đ**: Uống nước chờ hết đói 💀\n\nMày đang ở đâu tao gợi ý cụ thể hơn được 👊`
        };

      case 'weather':
        return {
          text: `${mood} Tao không có real-time data nhưng:\n\n• Việt Nam mùa này thường **${Math.random() > 0.5 ? 'nóng ẩm, dễ có mưa chiều' : 'mát, se lạnh buổi sáng'}**\n• Mở app **Weather** hoặc Google "thời tiết [tên thành phố]" là ra ngay\n• Hoặc nhìn ra cửa sổ, cách đó nhanh nhất 😂`
        };

      case 'advice':
        return {
          text: `${mood} Lời khuyên thẳng:\n\n• **Tiền bạc**: Tiết kiệm 20% thu nhập trước khi xài, không cần chờ "còn dư"\n• **Học hành**: Pomodoro 25-5, không xem điện thoại trong 25p — khó nhưng ngon\n• **Sức khỏe**: Ngủ đủ 7 tiếng > tập gym 2 tiếng mà thiếu ngủ\n• **Cuộc sống**: Bớt quan tâm mấy người không quan tâm mày lại\n\nVấn đề cụ thể là gì? Tao tư vấn thẳng hơn được 👊`
        };

      case 'game':
        return {
          text: `${mood} Game hả?\n\n• **Free Fire**: Rank Diamond cần aim + game sense, không phải hack\n• **Pubg**: Ping quan trọng hơn skill ở rank thấp\n• **Cheat**: Tao không giúp cheat online game bro, cái đó ban acc thiệt hại thật\n• **Offline trainer**: Khác, tao làm được\n\nMày cần gì cụ thể?`
        };

      default: {
        // General fallback — try to give a useful answer
        const fallbacks = [
          `${mood} Câu này tao hiểu kiểu này: mày muốn tao giải thích hay làm gì cụ thể không? Nói rõ hơn tí đi bro`,
          `Hmm, ${mood} cho tao hỏi lại: mày cần **thông tin**, **code**, hay tao **làm 1 file** cho mày?`,
          `${mood} Tao nghe mày rồi. Câu trả lời ngắn: **không có cái gì là không thể**, chỉ cần mày nói rõ hơn tao mới ship đúng được`,
        ];
        return { text: fallbacks[Math.floor(Math.random() * fallbacks.length)] };
      }
    }
  }

  /* ── Simulate typing delay ─────────────────────────────────── */
  function getDelay(text) {
    // 30-80ms per char, capped 400-1800ms
    return Math.min(1800, Math.max(400, text.length * 20));
  }

  return { respond, getDelay };
})();
          
