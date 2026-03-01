/* ===================================================
   Be Your Own AI — Certificate Generator (Canvas)
   =================================================== */

// ── Access Gate ───────────────────────────────────────────────────────
const passed = localStorage.getItem('byoa_exam_passed') === 'true';
if (!passed) {
  document.getElementById('lockedOverlay').style.display = 'flex';
  document.getElementById('certBody').style.display = 'none';
}

// ── Draw Certificate ──────────────────────────────────────────────────
const canvas = document.getElementById('certificateCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;

const studentName = localStorage.getItem('byoa_student_name') || 'Student';
const examScore = localStorage.getItem('byoa_exam_score') || '70';
const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

function drawCertificate() {
  if (!ctx) return;

  const W = canvas.width;
  const H = canvas.height;

  // Background
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#0f0a1e');
  bg.addColorStop(0.5, '#1a1035');
  bg.addColorStop(1, '#0f0a1e');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Outer border
  ctx.strokeStyle = '#7c3aed';
  ctx.lineWidth = 6;
  ctx.strokeRect(18, 18, W - 36, H - 36);

  // Inner border
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;
  ctx.strokeRect(30, 30, W - 60, H - 60);

  // Corner decorations
  const corners = [[48, 48], [W - 48, 48], [48, H - 48], [W - 48, H - 48]];
  corners.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b';
    ctx.fill();
  });

  // Stars decoration row
  ctx.font = '22px serif';
  ctx.fillStyle = '#f59e0b';
  for (let i = 0; i < 7; i++) {
    ctx.fillText('★', 120 + i * 110, 90);
  }

  // Emoji + Logo
  ctx.font = 'bold 48px serif';
  ctx.fillStyle = '#f5f3ff';
  ctx.textAlign = 'center';
  ctx.fillText('🤖', W / 2, 135);

  // Logo text
  ctx.font = 'bold 22px "Segoe UI", sans-serif';
  ctx.fillStyle = '#f59e0b';
  ctx.textAlign = 'center';
  ctx.fillText('BE YOUR OWN AI', W / 2, 175);

  // "Certificate of Completion"
  ctx.font = 'bold 15px "Segoe UI", sans-serif';
  ctx.fillStyle = '#a78bfa';
  ctx.letterSpacing = '4px';
  ctx.textAlign = 'center';
  ctx.fillText('CERTIFICATE OF COMPLETION', W / 2, 215);

  // Divider line
  ctx.beginPath();
  const grad = ctx.createLinearGradient(100, 230, W - 100, 230);
  grad.addColorStop(0, 'transparent');
  grad.addColorStop(0.5, '#7c3aed');
  grad.addColorStop(1, 'transparent');
  ctx.strokeStyle = grad;
  ctx.lineWidth = 1.5;
  ctx.moveTo(100, 235);
  ctx.lineTo(W - 100, 235);
  ctx.stroke();

  // "This certifies that"
  ctx.font = 'italic 18px Georgia, serif';
  ctx.fillStyle = '#a78bfa';
  ctx.textAlign = 'center';
  ctx.fillText('This certifies that', W / 2, 280);

  // Student Name
  ctx.font = 'bold 54px Georgia, serif';
  ctx.fillStyle = '#f5f3ff';
  ctx.textAlign = 'center';
  ctx.fillText(studentName, W / 2, 355);

  // Underline for name
  const nameWidth = ctx.measureText(studentName).width;
  ctx.beginPath();
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;
  ctx.moveTo(W / 2 - nameWidth / 2, 368);
  ctx.lineTo(W / 2 + nameWidth / 2, 368);
  ctx.stroke();

  // "has successfully completed"
  ctx.font = 'italic 18px Georgia, serif';
  ctx.fillStyle = '#a78bfa';
  ctx.textAlign = 'center';
  ctx.fillText('has successfully completed the course', W / 2, 405);

  // Course Name
  ctx.font = 'bold 30px "Segoe UI", sans-serif';
  const nameGrad = ctx.createLinearGradient(W / 2 - 200, 0, W / 2 + 200, 0);
  nameGrad.addColorStop(0, '#a78bfa');
  nameGrad.addColorStop(1, '#f59e0b');
  ctx.fillStyle = nameGrad;
  ctx.textAlign = 'center';
  ctx.fillText('Code Fundamentals & AI Prompting Mastery', W / 2, 450);

  // Score
  ctx.font = 'bold 18px "Segoe UI", sans-serif';
  ctx.fillStyle = '#10b981';
  ctx.textAlign = 'center';
  ctx.fillText(`Final Exam Score: ${examScore}%`, W / 2, 490);

  // Divider
  ctx.beginPath();
  ctx.strokeStyle = grad;
  ctx.lineWidth = 1.5;
  ctx.moveTo(100, 510);
  ctx.lineTo(W - 100, 510);
  ctx.stroke();

  // Date
  ctx.font = '15px "Segoe UI", sans-serif';
  ctx.fillStyle = '#6d5aa8';
  ctx.textAlign = 'center';
  ctx.fillText('Issued: ' + today, W / 2, 540);

  // Seal
  ctx.beginPath();
  ctx.arc(W / 2, 620, 55, 0, Math.PI * 2);
  const sealGrad = ctx.createRadialGradient(W / 2, 620, 10, W / 2, 620, 55);
  sealGrad.addColorStop(0, '#7c3aed');
  sealGrad.addColorStop(1, '#5b21b6');
  ctx.fillStyle = sealGrad;
  ctx.fill();
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Seal inner ring
  ctx.beginPath();
  ctx.arc(W / 2, 620, 45, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(245,158,11,0.5)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Seal text
  ctx.font = 'bold 22px serif';
  ctx.fillStyle = '#f5f3ff';
  ctx.textAlign = 'center';
  ctx.fillText('✓', W / 2, 627);

  ctx.font = 'bold 9px "Segoe UI", sans-serif';
  ctx.fillStyle = '#fde68a';
  ctx.textAlign = 'center';
  ctx.fillText('VERIFIED', W / 2, 645);

  // Footer
  ctx.font = '12px "Segoe UI", sans-serif';
  ctx.fillStyle = '#3d2b6e';
  ctx.textAlign = 'center';
  ctx.fillText('beyourownai.com  ·  Code Fundamentals & AI Prompting', W / 2, 695);
}

if (passed && ctx) {
  drawCertificate();
  launchConfetti();
}

// ── Download ──────────────────────────────────────────────────────────
function downloadCertificate() {
  if (!canvas) return;
  const link = document.createElement('a');
  link.download = `BeYourOwnAI_Certificate_${studentName.replace(/\s+/g, '_')}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// ── Congratulations voice ─────────────────────────────────────────────
function speakCongrats() {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const msg = `Congratulations, ${studentName}! You have successfully completed the Be Your Own AI course. You are now equipped to code and prompt AI like a pro. Be your own AI!`;
  const utterance = new SpeechSynthesisUtterance(msg);
  utterance.rate = 0.88;
  utterance.pitch = 1.1;
  utterance.volume = 1;
  const voices = window.speechSynthesis.getVoices();
  const v = voices.find(x => x.lang.startsWith('en') && /female|woman|zira|samantha|karen/i.test(x.name))
    || voices.find(x => x.lang.startsWith('en'));
  if (v) utterance.voice = v;
  window.speechSynthesis.speak(utterance);
}

// ── Auto-speak congrats once per session ──────────────────────────────
if (passed) {
  window.addEventListener('load', () => {
    if (!sessionStorage.getItem('byoa_cert_greeted')) {
      sessionStorage.setItem('byoa_cert_greeted', '1');
      setTimeout(speakCongrats, 800);
    }
  });
}

// ── Confetti ──────────────────────────────────────────────────────────
function launchConfetti() {
  const colors = ['#7c3aed', '#f59e0b', '#10b981', '#a78bfa', '#fde68a', '#6ee7b7'];
  for (let i = 0; i < 80; i++) {
    setTimeout(() => {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.cssText = `
        left: ${Math.random() * 100}vw;
        top: -10px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        width: ${6 + Math.random() * 10}px;
        height: ${6 + Math.random() * 10}px;
        animation-duration: ${2 + Math.random() * 3}s;
        animation-delay: ${Math.random() * 2}s;
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      `;
      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), 6000);
    }, i * 60);
  }
}
