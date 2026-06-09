'use strict';

//terminal linux animado
(function initTerminal() {
  const body = document.getElementById('term-body');
  if (!body) return;

  const PROMPT =
    '<span class="t-prompt-user">caio</span>' +
    '<span class="t-prompt-at">@</span>' +
    '<span class="t-prompt-host">blueteam</span>' +
    '<span class="t-prompt-colon">:</span>' +
    '<span class="t-prompt-path">~/tools</span>' +
    '<span class="t-prompt-dollar">$</span>';

  //sequência curta pra ficar legal no terminal
  const sequence = [
    { type: 'cmd',   text: './aegis-watch.sh --mode watcher', delay: 600 },
    { type: 'blank', delay: 160 },
    { type: 'out', cls: 't-dim',   text: '╔══════════════════════════════════════════╗', delay: 55 },
    { type: 'out', cls: 't-dim',   text: '║    AEGIS-WATCH  v2.4.1  — Blue Team      ║', delay: 55 },
    { type: 'out', cls: 't-dim',   text: '╚══════════════════════════════════════════╝', delay: 55 },
    { type: 'blank', delay: 80 },
    { type: 'out', cls: 't-info',  text: '[*] Initializing runtime environment...', delay: 130 },
    { type: 'out', cls: 't-ok',    text: '[✔] Config parsed: /etc/aegis/watcher.conf', delay: 80 },
    { type: 'out', cls: 't-ok',    text: '[✔] Sigma ruleset loaded (critical: 312)', delay: 80 },
    { type: 'out', cls: 't-ok',    text: '[✔] Elastic SIEM → 192.168.10.5:9200 [TLS OK]', delay: 80 },
    { type: 'out', cls: 't-warn',  text: '[!] Anomaly detector: warm-up (60 s)', delay: 80 },
    { type: 'blank', delay: 100 },
    { type: 'out', cls: 't-dim',   text: '──────────────────────────────────────────', delay: 55 },
    { type: 'out', cls: 't-ok',    text: '[✔] All systems nominal. Monitoring active.', delay: 80 },
    { type: 'out', cls: 't-dim',   text: '──────────────────────────────────────────', delay: 55 },
    { type: 'blank', delay: 160 },
    { type: 'out', cls: 't-motto', text: '"A defesa é a base de toda a sua empresa."', delay: 0 },
    { type: 'blank', delay: 160 },
    { type: 'cursor' },           //pausa com cursor piscando antes de reiniciar
  ];

  //quanto tempo o cursor espera antes de reiniciar o loop
  const LOOP_PAUSE = 2800;

  //helpers pequenos para montar as linhas do terminal
  function makeOutLine(cls, text) {
    const div = document.createElement('div');
    div.className = 't-line';
    const span = document.createElement('span');
    span.className = cls;
    span.textContent = text;
    div.appendChild(span);
    return div;
  }

  function makePromptLine(typed, showCursor) {
    const div = document.createElement('div');
    div.className = 't-line';
    div.innerHTML = PROMPT + ' ';
    const code = document.createElement('span');
    code.className   = 't-cmd';
    code.textContent = typed;
    div.appendChild(code);
    if (showCursor) {
      const cur = document.createElement('span');
      cur.className = 't-cursor';
      div.appendChild(cur);
    }
    return div;
  }

  function makeBlank() {
    const div = document.createElement('div');
    div.style.height = '0.45em';
    return div;
  }

  let stepIndex = 0;
  let cmdLine = null;
  let cmdText = '';

  //apaga tudo no terminal e reinicia a animação
  function restart() {
    body.innerHTML = '';
    stepIndex = 0;
    cmdLine = null;
    cmdText = '';
    setTimeout(runStep, 500);
  }

  //executa cada passo da sequência do terminal
  function runStep() {
    if (stepIndex >= sequence.length) return;
    const step = sequence[stepIndex++];

    if (step.type === 'blank') {
      body.appendChild(makeBlank());
      setTimeout(runStep, step.delay);

    } else if (step.type === 'out') {
      body.appendChild(makeOutLine(step.cls, step.text));
      setTimeout(runStep, step.delay + 30);

    } else if (step.type === 'cmd') {
      cmdText = '';
      cmdLine = makePromptLine('', true);
      body.appendChild(cmdLine);
      setTimeout(() => typeCmd(step.text), step.delay);

    } else if (step.type === 'cursor') {
      //cursor parado, depois volta pro início
      const line = makePromptLine('', true);
      body.appendChild(line);
      setTimeout(restart, LOOP_PAUSE);
    }
  }

  //digita cada caractere do comando no terminal
  function typeCmd(fullText) {
    let i = 0;
    function typeChar() {
      if (i >= fullText.length) {
        cmdLine.querySelector('.t-cursor')?.remove();
        setTimeout(runStep, 260);
        return;
      }
      cmdText += fullText[i++];
      const code = cmdLine.querySelector('.t-cmd');
      if (code) code.textContent = cmdText;
      const ch = fullText[i - 1];
      const speed = ch === ' ' ? 90 + Math.random() * 40 : 42 + Math.random() * 55;
      setTimeout(typeChar, speed);
    }
    typeChar();
  }

  setTimeout(runStep, 800);
})();

//validação do formulário de contato
(function initForm() {
  const submitBtn = document.getElementById('submit-btn');
  const successMsg = document.getElementById('form-success');
  if (!submitBtn) return;

  function validate(field) {
    const value = field.value.trim();
    if (field.required && !value) return 'Campo obrigatório.';
    if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'E-mail inválido !';
    }
    return '';
  }

  function setError(id, msg) {
    const field = document.getElementById(id);
    const error = document.getElementById(id + '-error');
    if (!field) return;
    field.classList.toggle('input--error', !!msg);
    if (error) error.textContent = msg;
  }

  //envia o formulário apenas se todos os campos estiverem válidos
  submitBtn.addEventListener('click', () => {
    const fields = ['name', 'email', 'message'];
    let hasError = false;
    fields.forEach(id => {
      const field = document.getElementById(id);
      if (!field) return;
      const err = validate(field);
      setError(id, err);
      if (err) hasError = true;
    });
    if (hasError) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando…';

    setTimeout(() => {
      ['name', 'email', 'subject', 'message'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar mensagem';
      if (successMsg) {
        successMsg.classList.remove('visually-hidden');
        setTimeout(() => successMsg.classList.add('visually-hidden'), 5000);
      }
    }, 1200);
  });

  //limpa erros ao digitar nos campos do formulário
  ['name', 'email', 'message'].forEach(id => {
    const field = document.getElementById(id);
    if (field) { 
      field.addEventListener('input', () => setError(id, '')); 
    } 
  });
})();
