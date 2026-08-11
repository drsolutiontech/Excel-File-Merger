// ---- State ----
let fileAData = null; // { name, rows: [ {col:val,...} ], columns: [] }
let fileBData = null;
let mergedRows = [];
let mergedColumns = [];

// ---- Elements ----
const dz1 = document.getElementById('dz1');
const dz2 = document.getElementById('dz2');
const input1 = document.getElementById('file1');
const input2 = document.getElementById('file2');
const dz1Name = document.getElementById('dz1-name');
const dz2Name = document.getElementById('dz2-name');

const panelConfig = document.getElementById('panelConfig');
const panelResults = document.getElementById('panelResults');
const key1Select = document.getElementById('key1');
const key2Select = document.getElementById('key2');
const preview1 = document.getElementById('preview1');
const preview2 = document.getElementById('preview2');
const mergeBtn = document.getElementById('mergeBtn');

const statMatched = document.getElementById('statMatched');
const statUnmatchedA = document.getElementById('statUnmatchedA');
const statUnmatchedB = document.getElementById('statUnmatchedB');
const previewTable = document.getElementById('previewTable');
const downloadBtn = document.getElementById('downloadBtn');
const restartBtn = document.getElementById('restartBtn');

const stepDots = document.querySelectorAll('.step-dot');

// ---- Helpers ----
function setStep(n){
  stepDots.forEach(d=>{
    const s = parseInt(d.dataset.step,10);
    d.classList.remove('active','done');
    if(s < n) d.classList.add('done');
    if(s === n) d.classList.add('active');
  });
}

function normalizeKey(v){
  if(v === null || v === undefined) return '';
  return String(v).trim().toLowerCase();
}

function guessKeyColumn(columns){
  const emailCol = columns.find(c => c.toLowerCase().includes('email'));
  if(emailCol) return emailCol;
  const idCol = columns.find(c => /id|number|reference|admission|application/i.test(c));
  if(idCol) return idCol;
  return columns[0];
}

function readFile(file){
  return new Promise((resolve, reject)=>{
    const reader = new FileReader();
    reader.onload = (e)=>{
      try{
        const data = new Uint8Array(e.target.result);
        const wb = XLSX.read(data, { type:'array' });
        const sheetName = wb.SheetNames[0];
        const ws = wb.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(ws, { defval:'' });
        const columns = rows.length ? Object.keys(rows[0]) : [];
        resolve({ name:file.name, rows, columns, sheetName });
      }catch(err){ reject(err); }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

function populateSelect(select, columns, guessed){
  select.innerHTML = '';
  columns.forEach(c=>{
    const opt = document.createElement('option');
    opt.value = c; opt.textContent = c;
    if(c === guessed) opt.selected = true;
    select.appendChild(opt);
  });
}

function showPreview(el, data, keyCol){
  const sampleVals = data.rows.slice(0,4).map(r => r[keyCol]);
  el.innerHTML = `<strong>${data.rows.length} rows loaded</strong><br>` +
    sampleVals.map(v => `• ${v === '' ? '<em>(empty)</em>' : v}`).join('<br>');
}

function maybeShowConfig(){
  if(fileAData && fileBData){
    populateSelect(key1Select, fileAData.columns, guessKeyColumn(fileAData.columns));
    populateSelect(key2Select, fileBData.columns, guessKeyColumn(fileBData.columns));
    showPreview(preview1, fileAData, key1Select.value);
    showPreview(preview2, fileBData, key2Select.value);
    panelConfig.classList.remove('hidden');
    setStep(2);
  }
}

key1Select && key1Select.addEventListener('change', ()=> fileAData && showPreview(preview1, fileAData, key1Select.value));
key2Select && key2Select.addEventListener('change', ()=> fileBData && showPreview(preview2, fileBData, key2Select.value));

// ---- Upload wiring ----
function wireDropzone(dz, input, nameEl, onLoaded){
  dz.addEventListener('click', ()=> input.click());
  input.addEventListener('change', ()=>{
    if(input.files[0]) handleFile(input.files[0]);
  });
  dz.addEventListener('dragover', (e)=>{ e.preventDefault(); dz.classList.add('drag-over'); });
  dz.addEventListener('dragleave', ()=> dz.classList.remove('drag-over'));
  dz.addEventListener('drop', (e)=>{
    e.preventDefault();
    dz.classList.remove('drag-over');
    if(e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  });

  function handleFile(file){
    readFile(file).then(data=>{
      onLoaded(data);
      nameEl.textContent = `${file.name} — ${data.rows.length} rows`;
      dz.classList.add('loaded');
      maybeShowConfig();
    }).catch(err=>{
      alert('Could not read that file. Make sure it is a valid .xlsx/.xls/.csv export.\n\n' + err.message);
    });
  }
}

wireDropzone(dz1, input1, dz1Name, (data)=> fileAData = data);
wireDropzone(dz2, input2, dz2Name, (data)=> fileBData = data);

// ---- Merge ----
mergeBtn.addEventListener('click', ()=>{
  const keyA = key1Select.value;
  const keyB = key2Select.value;

  const bByKey = new Map();
  fileBData.rows.forEach(row=>{
    const k = normalizeKey(row[keyB]);
    if(!bByKey.has(k)) bByKey.set(k, []);
    bByKey.get(k).push(row);
  });

  const usedBIndexes = new Set();
  const colsA = fileAData.columns.map(c => `A: ${c}`);
  const colsB = fileBData.columns.map(c => `B: ${c}`);
  mergedColumns = ['Match Status', ...colsA, ...colsB];

  const matchedRows = [];
  const unmatchedA = [];

  fileAData.rows.forEach(rowA=>{
    const k = normalizeKey(rowA[keyA]);
    const candidates = bByKey.get(k);
    const rowBMatch = (candidates && candidates.length) ? candidates.find((rb, idx)=>{
      const tag = k + '::' + idx;
      return !usedBIndexes.has(tag);
    }) : null;

    if(candidates && candidates.length && rowBMatch !== undefined && rowBMatch !== null && k !== ''){
      const idx = candidates.indexOf(rowBMatch);
      usedBIndexes.add(k + '::' + idx);
      const merged = { 'Match Status': 'Matched' };
      fileAData.columns.forEach(c => merged[`A: ${c}`] = rowA[c]);
      fileBData.columns.forEach(c => merged[`B: ${c}`] = rowBMatch[c]);
      matchedRows.push(merged);
    } else {
      const merged = { 'Match Status': 'No match in File B' };
      fileAData.columns.forEach(c => merged[`A: ${c}`] = rowA[c]);
      fileBData.columns.forEach(c => merged[`B: ${c}`] = '');
      unmatchedA.push(merged);
    }
  });

  // Any File B rows never consumed = unmatched from B
  const unmatchedB = [];
  fileBData.rows.forEach((rowB, idx)=>{
    const k = normalizeKey(rowB[keyB]);
    const tag = k + '::' + (bByKey.get(k) ? bByKey.get(k).indexOf(rowB) : idx);
    if(k === '' || !usedBIndexes.has(tag)){
      const merged = { 'Match Status': 'No match in File A' };
      fileAData.columns.forEach(c => merged[`A: ${c}`] = '');
      fileBData.columns.forEach(c => merged[`B: ${c}`] = rowB[c]);
      unmatchedB.push(merged);
    }
  });

  mergedRows = [...matchedRows, ...unmatchedA, ...unmatchedB];

  statMatched.textContent = matchedRows.length;
  statUnmatchedA.textContent = unmatchedA.length;
  statUnmatchedB.textContent = unmatchedB.length;

  renderPreviewTable();
  panelResults.classList.remove('hidden');
  setStep(3);
  panelResults.scrollIntoView({ behavior:'smooth', block:'start' });
});

function renderPreviewTable(){
  const rowsToShow = mergedRows.slice(0, 60);
  let html = '<thead><tr>' + mergedColumns.map(c=>`<th>${c}</th>`).join('') + '</tr></thead><tbody>';
  rowsToShow.forEach(r=>{
    const isMatched = r['Match Status'] === 'Matched';
    html += `<tr class="${isMatched ? 'row-matched' : 'row-unmatched'}">`;
    mergedColumns.forEach(c=>{
      const cls = c === 'Match Status' ? 'status-cell' : '';
      html += `<td class="${cls}">${r[c] === '' || r[c] === undefined ? '' : r[c]}</td>`;
    });
    html += '</tr>';
  });
  html += '</tbody>';
  previewTable.innerHTML = html;
  if(mergedRows.length > 60){
    const note = document.createElement('p');
    note.style.cssText = 'color:var(--text-dim);font-size:12px;margin-top:10px;';
    note.textContent = `Showing first 60 of ${mergedRows.length} rows. The full set is included in the download.`;
    previewTable.parentElement.after(note);
  }
}

// ---- Download ----
downloadBtn.addEventListener('click', ()=>{
  const ws = XLSX.utils.json_to_sheet(mergedRows, { header: mergedColumns });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Merged');
  XLSX.writeFile(wb, 'merged-records.xlsx');
});

// ---- Restart ----
restartBtn.addEventListener('click', ()=> location.reload());
