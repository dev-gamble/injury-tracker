// ── ACCESS GATE ──
// Gate for paid features. Server stamps window.__endexAccess in index.html
// based on the user's tier + admin role. Restricted features call
// _requireAccess() at entry and short-circuit if false.
//
// Gating at the function level (not the DOM) means any call path — dropdown
// button, future keyboard shortcut, DevTools console, internal caller —
// hits the same guard. The DOM-level class/tooltip is UX only.
//
// NOTE: this is a product gate, not a security boundary. The tracker is
// client-side-only; a determined user with DevTools can flip the flag or
// rewrite the JS. The gate works for normal users.

function _hasAccess(){
  return !!(window.__endexAccess && window.__endexAccess.hasAccess);
}

function _requireAccess(){
  if(_hasAccess()) return true;
  _showUpgradeToast();
  return false;
}

function _showUpgradeToast(){
  var existing = document.getElementById('endex-upgrade-toast');
  if(existing) existing.remove();

  _ensureUpgradeToastStyles();

  var t = document.createElement('div');
  t.id = 'endex-upgrade-toast';
  t.className = 'endex-upgrade-toast';
  t.setAttribute('role', 'status');
  t.setAttribute('aria-live', 'polite');
  t.innerHTML = ''
    + '<div class="endex-upgrade-toast__inner">'
    +   '<svg class="endex-upgrade-toast__icon" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">'
    +     '<rect x="2.5" y="6" width="9" height="6.5" rx="1" stroke="currentColor" stroke-width="1.3"/>'
    +     '<path d="M4.5 6V4.5a2.5 2.5 0 0 1 5 0V6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>'
    +   '</svg>'
    +   '<div class="endex-upgrade-toast__body">'
    +     '<div class="endex-upgrade-toast__eyebrow">Access Locked</div>'
    +     '<div class="endex-upgrade-toast__title">Feature restricted</div>'
    +     '<div class="endex-upgrade-toast__copy">Requires an access key or active subscription.</div>'
    +   '</div>'
    + '</div>'
    + '<div class="endex-upgrade-toast__timer" aria-hidden="true"></div>';

  document.body.appendChild(t);
  // Next-frame class toggle kicks off the CSS transition from the initial state.
  requestAnimationFrame(function(){ t.classList.add('is-in'); });

  setTimeout(function(){
    if(!t.parentNode) return;
    t.classList.remove('is-in');
    t.classList.add('is-out');
    setTimeout(function(){ if(t.parentNode) t.parentNode.removeChild(t); }, 240);
  }, 3500);
}

function _ensureUpgradeToastStyles(){
  if(document.getElementById('endex-upgrade-toast-styles')) return;
  var s = document.createElement('style');
  s.id = 'endex-upgrade-toast-styles';
  s.textContent = [
    '.endex-upgrade-toast{',
    '  position:fixed; right:24px; bottom:24px; z-index:9999;',
    '  width:320px; background:#ffffff;',
    '  border:1px solid #d8dde8; border-top:3px solid #0a2357; border-left:2px solid #c8102e;',
    '  border-radius:4px; overflow:hidden;',
    '  box-shadow:0 8px 24px rgba(10,35,87,.14), 0 2px 6px rgba(10,35,87,.08);',
    '  font-family:"Open Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;',
    '  color:#0a1628;',
    '  opacity:0; transform:translateY(12px);',
    '  transition:opacity 280ms cubic-bezier(.2,.8,.2,1), transform 280ms cubic-bezier(.2,.8,.2,1);',
    '}',
    '.endex-upgrade-toast.is-in{ opacity:1; transform:translateY(0); }',
    '.endex-upgrade-toast.is-out{ opacity:0; transform:translateY(6px); transition-duration:240ms; }',
    '.endex-upgrade-toast__inner{',
    '  display:flex; gap:11px; align-items:flex-start;',
    '  padding:13px 16px 12px 14px;',
    '}',
    '.endex-upgrade-toast__icon{',
    '  flex:0 0 auto; margin-top:3px; color:#c8102e;',
    '}',
    '.endex-upgrade-toast__body{ min-width:0; }',
    '.endex-upgrade-toast__eyebrow{',
    '  font-family:"Oswald","Open Sans",Arial,sans-serif;',
    '  font-size:9.5px; font-weight:700; letter-spacing:2.5px;',
    '  text-transform:uppercase; color:#c8102e; line-height:1;',
    '  margin-bottom:6px;',
    '}',
    '.endex-upgrade-toast__title{',
    '  font-family:"Oswald","Open Sans",Arial,sans-serif;',
    '  font-size:14px; font-weight:600; letter-spacing:.4px;',
    '  text-transform:uppercase; color:#0a2357; line-height:1.2;',
    '  margin-bottom:4px;',
    '}',
    '.endex-upgrade-toast__copy{',
    '  font-size:12px; line-height:1.45; color:#5a6782;',
    '}',
    '.endex-upgrade-toast__timer{',
    '  height:1px; background:#c8102e; transform-origin:left center;',
    '  animation:endex-toast-timer 3500ms linear forwards;',
    '}',
    '@keyframes endex-toast-timer{',
    '  from{ transform:scaleX(1); }',
    '  to{ transform:scaleX(0); }',
    '}',
    '@media (prefers-reduced-motion: reduce){',
    '  .endex-upgrade-toast{ transition:opacity 120ms linear; transform:none; }',
    '  .endex-upgrade-toast.is-in{ transform:none; }',
    '  .endex-upgrade-toast.is-out{ transform:none; }',
    '  .endex-upgrade-toast__timer{ animation:none; background:transparent; }',
    '}'
  ].join('\n');
  document.head.appendChild(s);
}
