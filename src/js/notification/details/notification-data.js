export function buildNotifications(user, users = [], supplied = []) {
  if (!user?.id) return [];
  const result = Array.isArray(supplied) ? supplied.filter(item => item && (item.recipientId || item.userId) === user.id && item.id).map(item => ({ ...item, type: ['account','training','participants','evaluation','system'].includes(item.type) ? item.type : 'system', title: String(item.title || 'System notification'), message: String(item.message || item.description || ''), reference: String(item.reference || ''), date: item.createdAt || item.date || null, href: String(item.href || ''), action: String(item.action || 'View related page') })) : [];
  if (user.role === 'System Administrator' && Array.isArray(users)) users.filter(record => record?.id && ['Pending approval','For Review'].includes(record.status) && record.id !== user.id).forEach(record => {
    const name = [record.firstName,record.lastName].filter(Boolean).join(' ') || 'A user';
    result.push({ id:`approval:${record.id}`, type:'account', title:'User account awaiting approval', message:`${name} registered${record.role ? ` as ${record.role}` : ''}. Review the registration before granting access.`, reference:record.id, date:record.createdAt || null, href:'administration/update/for-approval.html', action:'Review user accounts' });
  });
  if (['Pending approval','For Review'].includes(user.status)) result.push({ id:`account-pending:${user.id}`, type:'account', title:'Your account is awaiting approval', message:'Your registration is waiting for an administrator to review the requested access.', reference:user.id, date:user.createdAt || null, href:'users/profile.html', action:'View your profile' });
  if (user.decidedAt) result.push({ id:`account-decision:${user.id}:${user.decidedAt}`, type:'account', title:'Your account access was reviewed', message:`Your account status is ${user.status || 'updated'}. Check your profile for details.`, reference:user.id, date:user.decidedAt, href:'users/profile.html', action:'View your profile' });
  else if (user.updatedAt && user.updatedAt !== user.createdAt) result.push({ id:`account-updated:${user.id}:${user.updatedAt}`, type:'account', title:'Your account details were updated', message:'Your registration or account details changed. Review your profile to check the latest information.', reference:user.id, date:user.updatedAt, href:'users/profile.html', action:'View your profile' });
  return [...new Map(result.map(item => [String(item.id), { ...item,id:String(item.id) }])).values()].sort((a,b)=>(Date.parse(b.date)||0)-(Date.parse(a.date)||0));
}
export function previewNotifications(now = Date.now()) {
  return [
    { id:'preview-approval',type:'account',title:'Account ready for review',message:'A sample user registration is ready for an administrator to review.',reference:'PREVIEW-USR-001',date:new Date(now-1800000).toISOString(),href:'administration/update/for-approval.html',action:'View approval queue' },
    { id:'preview-training',type:'training',title:'Training information updated',message:'A sample training schedule was updated. Open the training list to review its details.',reference:'PREVIEW-TRN-001',date:new Date(now-7200000).toISOString(),href:'training/details/all-status.html',action:'View trainings' },
    { id:'preview-participant',type:'participants',title:'Participant record updated',message:'A sample participant registration has new information available for review.',reference:'PREVIEW-FRM-001',date:new Date(now-86400000).toISOString(),href:'participants/details/all-with-status.html',action:'View participants' },
    { id:'preview-evaluation',type:'evaluation',title:'Evaluation results available',message:'A sample submitted evaluation is available in the encoded results list.',reference:'PREVIEW-EVAL-001',date:new Date(now-172800000).toISOString(),href:'evaluation/details/encoded-training-evaluation.html',action:'View evaluations' },
  ];
}
export function safeNotificationLink(href, adminRoot) {
  if (!href) return null;
  try { const root=new URL(adminRoot),link=new URL(href,root);return link.origin===root.origin && link.pathname.startsWith(root.pathname) && !link.username && !link.password && /\.html$/.test(link.pathname) ? link.href : null; } catch { return null; }
}
