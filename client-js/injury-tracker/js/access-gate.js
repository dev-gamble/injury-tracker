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
  var t = document.createElement('div');
  t.id = 'endex-upgrade-toast';
  t.textContent = 'Requires key or subscription';
  t.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#dc2626;color:#fff;padding:12px 24px;border-radius:8px;font-family:var(--fh,sans-serif);font-size:14px;font-weight:700;letter-spacing:.3px;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,.25);';
  document.body.appendChild(t);
  setTimeout(function(){ if(t.parentNode) t.parentNode.removeChild(t); }, 3500);
}
