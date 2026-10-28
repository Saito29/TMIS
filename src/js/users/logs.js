document.addEventListener('DOMContentLoaded', () => {
  const $ = id => document.getElementById(id);
  const modules = { dashboard:'Dashboard', participants:'Participants', training:'Training', evaluation:'Evaluation', administration:'Administration', users:'My account', system:'System' };
  const icons = { view:'bi-eye', create:'bi-plus-circle', update:'bi-pencil-square', status:'bi-arrow-left-right', delete:'bi-trash3', restore:'bi-arrow-counterclockwise', approve:'bi-check-circle', reject:'bi-x-circle', attachment:'bi-paperclip', export:'bi-download', refresh:'bi-arrow-clockwise', filter:'bi-funnel' };
  const filters = ['logSearch','logModule','logAction','logResult','logFrom','logTo'];
  let records = [], filtered = [], page = 1, size = '20';
  const make = (tag, className, text) => { const node = document.createElement(tag); if (className) node.className = className; if (text !== undefined) node.textContent = text; return node; };
  const date = value => new Intl.DateTimeFormat('en-PH', { dateStyle:'medium',timeStyle:'short',timeZone:'Asia/Manila' }).format(new Date(value));
  const day = value => {
    const parts = new Intl.DateTimeFormat('en-CA', { year:'numeric',month:'2-digit',day:'2-digit',timeZone:'Asia/Manila' }).formatToParts(new Date(value));
    return ['year','month','day'].map(type => parts.find(part => part.type === type).value).join('-');
  };
  function feedback(message, error = false) { $('journalFeedback').textContent = message; $('journalFeedback').hidden = !message; $('journalFeedback').dataset.type = error ? 'error' : 'info'; }
  let selectedReference = '';
  function details(entry) {
    $('activityDetailsTitle').textContent = entry.title;
    $('activityDetailsDescription').textContent = entry.description || 'No additional description was recorded for this event.';
    $('activityDetailsArea').textContent = modules[entry.module] || entry.module;
    const status = ['success','info','warning','error'].includes(entry.status) ? entry.status : 'info';
    $('activityDetailsResult').className = `journal-result ${status}`;
    $('activityDetailsResult').textContent = status === 'info' ? 'Information' : status.charAt(0).toUpperCase() + status.slice(1);
    $('activityDetailsIcon').replaceChildren(make('i', `bi ${icons[entry.action] || 'bi-activity'}`));
    $('activityDetailsActor').textContent = entry.actor || 'Actor not recorded';
    $('activityDetailsAvatar').textContent = String(entry.actor || 'User').split(/\s+/).filter(Boolean).slice(0,2).map(part=>part.charAt(0)).join('').toUpperCase();
    $('activityDetailsWhen').textContent = date(entry.date);
    const groups = [
      ['Event context', 'bi-journal-text', [['Action', entry.action.charAt(0).toUpperCase()+entry.action.slice(1)], ['Reference', entry.reference || 'Not recorded'], ['User ID', entry.actorId || 'Not recorded'], ['Source', entry.source === 'saved' ? 'Saved record history' : 'Browser activity']]],
      ['Record information', 'bi-fingerprint', [['Activity ID', entry.id || 'Not recorded'], ['Page', entry.page || 'Not recorded'], ['Date & time', date(entry.date)]]],
    ];
    $('activityDetailsFields').replaceChildren(...groups.map(([title,icon,fields])=>{
      const section=make('section','journal-modal-group'),heading=make('h3','');
      const symbol=make('i',`bi ${icon}`);symbol.setAttribute('aria-hidden','true');heading.append(symbol,document.createTextNode(title));
      const list=make('dl','');
      fields.forEach(([label,value])=>{const row=make('div','');row.append(make('dt','',label),make('dd','',value));list.append(row);});
      section.append(heading,list);return section;
    }));
    const changes=make('section','journal-modal-group journal-modal-changes');
    changes.append(make('h3','','Changed fields'));
    const list=make('div','journal-field-tags');
    if(entry.fields?.length) entry.fields.forEach(field=>list.append(make('span','',field.replace(/([a-z])([A-Z])/g,'$1 $2').replace(/_/g,' '))));
    else list.append(make('p','','No field-level changes were recorded for this activity.'));
    changes.append(list);$('activityDetailsFields').append(changes);
    $('activityDetailsNote').textContent = entry.source === 'saved' ? 'This event was imported from saved history attributed to your user record.' : status === 'info' ? 'This event records a page visit or request. It does not confirm that a record was changed.' : 'This activity was recorded in your browser. Only event metadata and changed field names are shown.';
    selectedReference=entry.reference || '';
    $('copyActivityReference').disabled=!selectedReference;
    $('activityCopyFeedback').textContent='';
    $('activityDetailsDialog').showModal();
  }
  $('copyActivityReference').addEventListener('click', async()=>{
    if(!selectedReference)return;
    try { await navigator.clipboard.writeText(selectedReference); $('activityCopyFeedback').textContent='Reference copied.'; }
    catch { $('activityCopyFeedback').textContent='Copy unavailable. Select the reference text to copy it.'; }
  });
  function render() {
    const query = $('logSearch').value.trim().toLowerCase(), from = $('logFrom').value, to = $('logTo').value;
    const invalidDates = from && to && from > to;
    if (invalidDates) feedback('The From date must be on or before the To date.',true);
    filtered = records.filter(entry => !invalidDates && (!$('logModule').value || entry.module === $('logModule').value)
      && (!$('logAction').value || entry.action === $('logAction').value) && (!$('logResult').value || entry.status === $('logResult').value)
      && (!from || day(entry.date) >= from) && (!to || day(entry.date) <= to)
      && (!query || [entry.title,entry.description,entry.reference,entry.actor,entry.action,modules[entry.module]].join(' ').toLowerCase().includes(query)));
    const pageSize = size === 'all' ? Math.max(1,filtered.length) : Number(size), pages = Math.max(1,Math.ceil(filtered.length / pageSize));
    page = Math.min(page,pages);
    $('activityLogTableBody').replaceChildren(...filtered.slice((page-1)*pageSize,page*pageSize).map(entry => {
      const row=make('tr',''), activity=make('td',''), identity=make('div','journal-activity'), symbol=make('span',`journal-entry-icon ${entry.action}`);
      const icon=make('i',`bi ${icons[entry.action] || 'bi-activity'}`);icon.setAttribute('aria-hidden','true');symbol.append(icon);
      const text=make('div','');text.append(make('strong','',entry.title),make('p','',entry.description));identity.append(symbol,text);activity.append(identity);row.append(activity);
      row.append(make('td','',modules[entry.module] || entry.module),make('td','journal-reference',entry.reference || '-'));
      const result=make('td',''), badge=make('span',`journal-result ${['success','info','warning','error'].includes(entry.status)?entry.status:'info'}`,entry.status === 'info' ? 'Information' : entry.status.charAt(0).toUpperCase()+entry.status.slice(1));result.append(badge);row.append(result,make('td','journal-date',date(entry.date)));
      const action=make('td',''), button=make('button','btn journal-detail-button');button.type='button';button.title='View activity details';button.setAttribute('aria-label',`View details: ${entry.title}`);
      const eye=make('i','bi bi-eye');eye.setAttribute('aria-hidden','true');button.append(eye);button.addEventListener('click',()=>details(entry));action.append(button);row.append(action);return row;
    }));
    $('logResultCount').textContent=`${filtered.length} matching ${filtered.length===1?'activity':'activities'}`;
    $('journalEmpty').hidden=filtered.length>0;
    $('journalEmptyText').textContent=records.length?'Change the search or filters to see more activity.':'No activity has been recorded for your user in this browser yet.';
    for(const suffix of ['', 'Top']) {
      $(`logPageSize${suffix}`).value=size;
      $(`logPageText${suffix}`).textContent=`Page ${page} of ${pages}`;
      $(`logPrevious${suffix}`).disabled=page<=1;$(`logNext${suffix}`).disabled=page>=pages;
    }
  }
  function refresh() {
    try {
      const user=window.TmisActivity?.actor();
      $('journalIdentity').textContent=user?`Showing activity for ${[user.firstName,user.middleName,user.lastName,user.suffix].filter(Boolean).join(' ')}.`:'Your user-table identity is not connected. Activity from other users is not displayed.';
      records=(window.TmisActivity?.entries() || []).filter(entry=>entry && entry.date && !Number.isNaN(Date.parse(entry.date))).map(entry=>({...entry,title:String(entry.title || 'Recorded activity'),description:String(entry.description || ''),reference:String(entry.reference || ''),actor:String(entry.actor || 'Not recorded'),actorId:String(entry.actorId || ''),module:String(entry.module || 'system'),action:String(entry.action || 'update'),status:['success','info','warning','error'].includes(entry.status)?entry.status:'info',fields:Array.isArray(entry.fields)?entry.fields.map(String):[]})).sort((a,b)=>Date.parse(b.date)-Date.parse(a.date));
      $('logTotalCount').textContent=records.length;
      $('logTodayCount').textContent=records.filter(entry=>Date.parse(entry.date)>=Date.now()-86400000).length;
      $('logChangeCount').textContent=records.filter(entry=>entry.status==='success' && ['create','update','status','delete','restore','approve','reject','attachment'].includes(entry.action)).length;
      $('logDeleteCount').textContent=records.filter(entry=>entry.action==='delete').length;
      render();
    } catch { feedback('Activity history could not be read from this browser.',true); }
  }
  filters.forEach(id=>$(id).addEventListener(id==='logSearch'?'input':'change',()=>{page=1;feedback('');render();}));
  $('clearLogFilters').addEventListener('click',()=>{filters.forEach(id=>{$(id).value='';});page=1;feedback('');render();});
  $('refreshActivityLogs').addEventListener('click',()=>{feedback('');refresh();});
  for(const suffix of ['', 'Top']) {
    $(`logPageSize${suffix}`).addEventListener('change',event=>{size=event.target.value;page=1;render();});
    $(`logPrevious${suffix}`).addEventListener('click',()=>{if(page>1)page--;render();});
    $(`logNext${suffix}`).addEventListener('click',()=>{page++;render();});
  }
  $('exportActivityLogs').addEventListener('click',()=>{
    if(!filtered.length){feedback('There are no matching activities to export.');return;}
    const cell=value=>{let text=String(value??'');if(/^[=+\-@\t\r]/.test(text))text="'"+text;return '"'+text.replace(/"/g,'""')+'"';};
    const rows=[['Activity','Description','System area','Action','Reference','Result','Actor','User ID','Date & time','Page'],...filtered.map(entry=>[entry.title,entry.description,modules[entry.module]||entry.module,entry.action,entry.reference,entry.status,entry.actor,entry.actorId,date(entry.date),entry.page])];
    const url=URL.createObjectURL(new Blob(['\uFEFF'+rows.map(row=>row.map(cell).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'}));
    const link=make('a','');link.href=url;link.download='my-activity-logs.csv';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    // Exporting the journal does not create a record-change log.
    feedback('The filtered activity was exported to CSV.');
  });
  window.addEventListener('tmis:activity-ready',refresh);window.addEventListener('tmis:activity',refresh);
  window.addEventListener('storage',event=>{if(!event.key||['tmis-user-activity','tmis-users'].includes(event.key))refresh();});
  window.addEventListener('tmis:activity-storage-error',()=>feedback('Browser storage is full or unavailable. Some activity could not be recorded.',true));
  refresh();
});
