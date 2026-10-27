import { renderMessage, setupMessageEditor } from './message-editor.js';
﻿import { NOTIFICATION_TYPES, RELATED_PAGES, activeRecipients, resolveRecipients, composeNotifications } from './notification-data.js';
function init(){
 const $=id=>document.getElementById(id),form=$('notificationComposeForm');
 setupMessageEditor($('notificationMessage'));
 let users=[],selected=new Set(),draftId=null,loadedFor=null,pending=null,busy=false;
 const make=(tag,cls,text)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node;};
 const currentActor=()=>window.TmisActivity?.actor()||null;
 const draftKey=user=>`tmis-notification-draft:${user.id}`;
 const name=user=>[user.firstName,user.middleName,user.lastName,user.suffix].filter(Boolean).join(' ')||'Unnamed user';
 const readUsers=()=>{const data=JSON.parse(localStorage.getItem('tmis-users')||'[]');if(!Array.isArray(data))throw new Error('User-table data could not be read.');return data;};
 function feedback(message,error=false){$('composeFeedback').textContent=message;$('composeFeedback').hidden=!message;$('composeFeedback').dataset.type=error?'error':'success';}
 function data(){return {title:$('notificationTitle').value.trim(),message:$('notificationMessage').value.trim(),type:$('notificationType').value,priority:$('notificationPriority').value,reference:$('notificationReference').value.trim(),relatedPage:$('notificationRelatedPage').value,audience:form.querySelector('input[name="notificationAudience"]:checked')?.value||'users',role:$('notificationRole').value,recipientIds:[...selected]};}
 function preview(){
  const item=data(),recipients=resolveRecipients(item,users),target=RELATED_PAGES[item.relatedPage]||RELATED_PAGES[''];
  $('notificationTitleCount').textContent=`${$('notificationTitle').value.length} / 100`;$('notificationMessageCount').textContent=`${$('notificationMessage').value.length} / 1,000`;
  $('notificationPreviewTitle').textContent=item.title||'Your notification title';renderMessage($('notificationPreviewMessage'),item.message||'Your message will appear here as you type.');
  $('notificationPreviewType').textContent=NOTIFICATION_TYPES[item.type]||'System';$('notificationPreviewPriority').hidden=item.priority!=='high';
  $('notificationPreviewIcon').className=`bi ${{system:'bi-bell',account:'bi-person-check',training:'bi-journal-text',participants:'bi-people',evaluation:'bi-clipboard-check'}[item.type]||'bi-bell'}`;
  $('notificationPreviewReference').hidden=!item.reference;$('notificationPreviewReference').textContent=item.reference;
  $('notificationPreviewAction').hidden=!target.href;$('notificationPreviewAction').textContent=target.href?`Open ${target.label.toLowerCase()}`:'';
  $('notificationPreviewRecipients').textContent=`${recipients.length} ${recipients.length===1?'user':'users'}`;
  $('notificationAudienceSummary').textContent=recipients.length?`${recipients.length} active ${recipients.length===1?'recipient':'recipients'} selected${item.audience==='role'?` for ${item.role}`:''}.`:'No active recipients selected.';
 }
 function dirty(){ $('notificationDraftStatus').textContent='Unsaved changes';preview(); }
 function renderRecipients(){
  const query=$('notificationRecipientSearch').value.trim().toLowerCase();
  const shown=activeRecipients(users).filter(user=>!query||[name(user),user.email,user.office].join(' ').toLowerCase().includes(query));
  $('notificationRecipientList').replaceChildren(...shown.map(user=>{
   const label=make('label','compose-recipient'),checkbox=make('input','');checkbox.type='checkbox';checkbox.value=user.id;checkbox.checked=selected.has(user.id);
   checkbox.addEventListener('change',()=>{checkbox.checked?selected.add(user.id):selected.delete(user.id);dirty();});
   const avatar=make('span','compose-recipient-avatar',[user.firstName,user.lastName].map(part=>String(part||'').charAt(0)).join('').toUpperCase()||'U');
   const text=make('span','compose-recipient-copy');text.append(make('strong','',name(user)),make('small','',[user.role,user.office].filter(Boolean).join(' - ')));
   label.append(checkbox,avatar,text);return label;
  }));
  $('notificationRecipientsEmpty').hidden=shown.length>0;
 }
 function audience(){
  const mode=data().audience;
  $('notificationRoleField').hidden=mode!=='role';$('notificationRole').disabled=mode!=='role';$('notificationRole').required=mode==='role';$('notificationUserPicker').hidden=mode!=='users';
  preview();
 }
 function load(){
  try{
   users=readUsers();const actor=currentActor();
   if(actor && loadedFor!==actor.id){
    loadedFor=actor.id;
    const raw=localStorage.getItem(draftKey(actor)),draft=raw?JSON.parse(raw):null;
    if(draft?.actorId===actor.id && draft.data){
     const item=draft.data;draftId=draft.id||null;
     $('notificationTitle').value=String(item.title||'').slice(0,100);$('notificationMessage').value=String(item.message||'').slice(0,1000);
     $('notificationType').value=Object.hasOwn(NOTIFICATION_TYPES,item.type)?item.type:'system';$('notificationPriority').value=item.priority==='high'?'high':'normal';
     $('notificationReference').value=String(item.reference||'').slice(0,80);$('notificationRelatedPage').value=Object.hasOwn(RELATED_PAGES,item.relatedPage)?item.relatedPage:'';
     const radio=form.querySelector(`input[name="notificationAudience"][value="${['users','role','all'].includes(item.audience)?item.audience:'users'}"]`);radio.checked=true;
     $('notificationRole').value=String(item.role||'');selected=new Set(Array.isArray(item.recipientIds)?item.recipientIds.filter(id=>typeof id==='string'):[]);
     $('notificationDraftStatus').textContent='Draft restored from this browser';
    }
   }
   renderRecipients();audience();
  }catch{feedback('User data or your saved draft could not be loaded. Check browser storage and try again.',true);}
 }
 function reset(clearDraft=false){
  const actor=currentActor();
  if(clearDraft && actor)localStorage.removeItem(draftKey(actor));
  form.reset();selected.clear();draftId=null;$('notificationRecipientSearch').value='';$('notificationDraftStatus').textContent='No draft saved';renderRecipients();audience();
 }
 form.addEventListener('input',event=>{if(event.target.id==='notificationRecipientSearch')return;dirty();});
 form.addEventListener('change',event=>{if(event.target.name==='notificationAudience')audience();dirty();});
 $('notificationRecipientSearch').addEventListener('input',renderRecipients);
 $('saveNotificationDraft').addEventListener('click',()=>{
  try{
   const actor=currentActor();if(!actor)throw new Error('Connect your user-table profile before saving a draft.');
   const item=data();if(!item.title&&!item.message)throw new Error('Enter a title or message before saving a draft.');
   const existed=!!localStorage.getItem(draftKey(actor));draftId ||= crypto.randomUUID();
   localStorage.setItem(draftKey(actor),JSON.stringify({id:draftId,actorId:actor.id,savedAt:new Date().toISOString(),data:item}));
   $('notificationDraftStatus').textContent='Draft saved in this browser';feedback('Your notification draft was saved locally.');
   window.TmisActivity?.record({action:existed?'update':'create',module:'users',title:existed?'Notification draft updated':'Notification draft created',description:'A local notification draft was saved.',reference:draftId});
  }catch(error){feedback(error.message||'The draft could not be saved.',true);}
 });
 $('resetNotificationForm').addEventListener('click',()=>{
  if(!window.confirm('Clear this form and its saved draft?'))return;
  try{reset(true);feedback('The form and saved draft were cleared.');}catch{feedback('The saved draft could not be cleared.',true);}
 });
 form.addEventListener('submit',event=>{
  event.preventDefault();if(busy||!form.reportValidity())return;
  try{
   users=readUsers();const actor=currentActor(),item=data();
   const composed=composeNotifications(item,users,actor);
   pending={actorId:actor.id,data:item,recipientIds:composed.map(entry=>entry.recipientId)};
   $('confirmNotificationDescription').textContent=`Create this ${item.priority==='high'?'important ':''}notification for ${composed.length} active ${composed.length===1?'recipient':'recipients'}?`;
   const entries=[['Title',item.title],['Type',NOTIFICATION_TYPES[item.type]],['Audience',item.audience==='all'?'All active users':item.audience==='role'?item.role:'Selected users'],['Delivery','Local browser inbox']];
   $('confirmNotificationDetails').replaceChildren(...entries.map(([label,value])=>{const row=make('div','');row.append(make('dt','',label),make('dd','',value));return row;}));
   $('confirmNotificationDialog').showModal();
  }catch(error){feedback(error.message||'Review the notification details.',true);}
 });
 $('confirmNotificationDialog').addEventListener('close',()=>{pending=null;});
 $('confirmNotificationCreate').addEventListener('click',()=>{
  if(!pending||busy)return;busy=true;$('confirmNotificationCreate').disabled=true;
  try{
   const actor=currentActor();if(!actor||actor.id!==pending.actorId)throw new Error('The current account changed. Review the recipients and try again.');
   const latestUsers=readUsers(),items=composeNotifications(pending.data,latestUsers,actor);
   if(JSON.stringify(items.map(item=>item.recipientId).sort())!==JSON.stringify([...pending.recipientIds].sort()))throw new Error('The active recipient list changed. Review your selection and confirm again.');
   const existing=JSON.parse(localStorage.getItem('tmis-notifications')||'[]');if(!Array.isArray(existing))throw new Error('The notification inbox data could not be read.');
   localStorage.setItem('tmis-notifications',JSON.stringify([...existing,...items]));
   // The inbox write has completed; draft cleanup must not misreport a successful create.
   let draftCleared=true;try{localStorage.removeItem(draftKey(actor));}catch{draftCleared=false;}
   const batchId=items[0].batchId;reset(false);$('notificationDraftStatus').textContent='Notification created locally';
   $('confirmNotificationDialog').close();feedback(`Created ${items.length} local inbox ${items.length===1?'notification':'notifications'}. No email or push was sent.${draftCleared?'':' The old draft could not be cleared.'}`);
   window.TmisActivity?.record({action:'create',module:'users',title:'Notification created',description:`A local notification was created for ${items.length} recipients.`,reference:batchId});
  }catch(error){$('confirmNotificationDialog').close();feedback(error.message||'The notification could not be created.',true);}
  finally{busy=false;$('confirmNotificationCreate').disabled=false;}
 });
 window.addEventListener('tmis:activity-ready',load);
 window.addEventListener('storage',event=>{if(!event.key||event.key==='tmis-users')load();});
 load();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
