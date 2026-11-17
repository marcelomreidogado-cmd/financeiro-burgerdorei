// Teste visual automático do Financeiro: abre as 12 telas com DADOS FICTÍCIOS (tests/dados-ficticios.js),
// sem acesso ao Firebase real, em 390, 768, 1024 e 1440 px.
// Falha se algo passar da largura da tela (a DRE é larga de propósito e só é conferida pela largura da página)
// ou se der erro de script. Uso: node tests/visual.cjs   (FOTOS=pasta salva uma foto de cada tela)
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const raiz = path.join(__dirname, '..');
const fake = fs.readFileSync(path.join(__dirname, 'dados-ficticios.js'), 'utf8');
const TELAS = [...fs.readFileSync(path.join(raiz, 'index.html'), 'utf8').matchAll(/<div class="ni[^"]*" data-m="([a-z]+)"/g)].map(m => m[1]);
const LARGURAS = [390, 768, 1024, 1440];
const DESLIZA = { dre: Infinity }; // telas largas de propósito (a DRE desliza também no computador)
const FOTOS = process.env.FOTOS;
(async () => {
  const falhas = [];
  const b = await chromium.launch();
  for (const w of LARGURAS) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } });
    p.on('pageerror', e => falhas.push(`${w}px: erro de script: ${e.message.slice(0, 120)}`));
    await p.route(/^https?:/, r => r.fulfill({ contentType: 'text/javascript', body: '' })); // nada sai para a internet
    await p.addInitScript(fake);
    await p.goto('file://' + path.join(raiz, 'index.html'));
    await p.waitForTimeout(3000);
    for (const t of TELAS) {
      await p.evaluate(m => { document.querySelector(`#sb .ni[data-m="${m}"]`).click(); }, t);
      await p.waitForTimeout(500);
      const r = await p.evaluate(() => {
        const c = document.getElementById('content'), W = document.documentElement.clientWidth;
        let pior = 0; // elementos fora de áreas que deslizam
        c.querySelectorAll('*').forEach(e => {
          for (let q = e.parentElement; q && q !== c; q = q.parentElement) { const s = getComputedStyle(q); if (s.overflowX === 'auto' || s.overflowX === 'scroll') return; }
          pior = Math.max(pior, e.getBoundingClientRect().right - c.getBoundingClientRect().right);
        });
        return { pagina: document.documentElement.scrollWidth - W, conteudo: c.scrollWidth - c.clientWidth, pior: Math.round(pior) };
      });
      const desliza = DESLIZA[t] && w < DESLIZA[t];
      if (r.pagina > 1) falhas.push(`${w}px · ${t}: a página passa ${r.pagina}px da largura da tela`);
      if (!desliza && r.conteudo > 2) falhas.push(`${w}px · ${t}: o conteúdo passa ${r.conteudo}px da área visível`);
      if (FOTOS) { fs.mkdirSync(FOTOS, { recursive: true }); await p.screenshot({ path: path.join(FOTOS, `${t}-${w}.png`) }); }
    }
    await p.close();
  }
  await b.close();
  if (falhas.length) { console.error('Visual com problemas:\n- ' + [...new Set(falhas)].join('\n- ')); process.exit(1); }
  console.log(`Visual OK: ${TELAS.length} telas em ${LARGURAS.join(', ')} px, nada passa da tela.`);
})().catch(e => { console.error(e); process.exit(1); });
