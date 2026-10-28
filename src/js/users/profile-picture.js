/* Profile pictures are scoped to the connected account in this browser. */
document.addEventListener('DOMContentLoaded', () => {
  const $ = id => document.getElementById(id);
  const input = $('profilePictureFile'), status = $('profilePictureStatus');
  const avatar = $('myProfileAvatar'), initials = avatar.textContent;
  const userId = window.TMIS_SESSION?.userId || window.TMIS_SESSION?.user?.id || sessionStorage.getItem('tmis-current-user-id');
  const key = userId ? `tmis-profile-picture:${userId}` : null;
  let saved = '', pending = '', revision = 0;
  const valid = value => /^data:image\/(jpeg|png|webp);base64,/.test(value);
  function render() {
    const preview = $('profilePicturePreview');
    preview.replaceChildren();
    if (pending) {
      const img = document.createElement('img'); img.src = pending; img.alt = 'Selected profile picture'; preview.append(img);
    } else {
      const icon = document.createElement('i'); icon.className = 'bi bi-person'; icon.setAttribute('aria-hidden', 'true'); preview.append(icon);
    }
    avatar.textContent = initials;
    if (saved) {
      const img = document.createElement('img'); img.src = saved; img.alt = ''; avatar.replaceChildren(img);
    }
    $('saveProfilePicture').disabled = !key || pending === saved || !pending;
    $('cancelProfilePicture').disabled = pending === saved;
    $('removeProfilePicture').disabled = !key || !saved;
  }
  try { const value = key && localStorage.getItem(key); saved = valid(value || '') ? value : ''; }
  catch { status.textContent = 'Saved pictures could not be loaded from this browser.'; }
  pending = saved;
  input.disabled = !key;
  if (!key) status.textContent = 'Connect your account to change your profile picture.';
  input.addEventListener('change', async () => {
    const current = ++revision, file = input.files[0];
    pending = saved; render();
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      status.textContent = 'Choose a JPG, PNG, or WebP image up to 5 MB.'; input.value = ''; return;
    }
    status.textContent = 'Preparing picture…';
    let url;
    try {
      url = URL.createObjectURL(file);
      const img = new Image(); img.src = url; await img.decode();
      const canvas = document.createElement('canvas'); canvas.width = canvas.height = 512;
      const size = Math.min(img.naturalWidth, img.naturalHeight);
      canvas.getContext('2d').drawImage(img, (img.naturalWidth - size) / 2, (img.naturalHeight - size) / 2, size, size, 0, 0, 512, 512);
      if (current !== revision) return;
      pending = canvas.toDataURL('image/png'); render(); status.textContent = 'Preview ready. Save to apply your picture.';
    } catch {
      if (current === revision) { status.textContent = 'This image could not be opened. Choose another picture.'; input.value = ''; }
    } finally { if (url) URL.revokeObjectURL(url); }
  });
  $('saveProfilePicture').addEventListener('click', () => {
    if (!key || !pending) return;
    try { localStorage.setItem(key, pending); saved = pending; render(); status.textContent = 'Profile picture saved in this browser.'; }
    catch { status.textContent = 'Picture could not be saved. Browser storage may be full or unavailable.'; }
  });
  $('cancelProfilePicture').addEventListener('click', () => {
    revision++; pending = saved; input.value = ''; render(); status.textContent = 'Picture selection cancelled.';
  });
  $('removeProfilePicture').addEventListener('click', () => {
    if (!key) return;
    try { localStorage.removeItem(key); revision++; saved = pending = ''; input.value = ''; render(); status.textContent = 'Profile picture removed.'; }
    catch { status.textContent = 'Picture could not be removed. Browser storage is unavailable.'; }
  });
  render();
});
