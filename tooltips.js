let dismissActiveTooltip;

document.querySelectorAll('.term-help').forEach((help) => {
  const button = help.querySelector('.term-help-button');
  const tooltip = help.querySelector('[role="tooltip"]');
  let closeTimer;
  let hovered = false;
  let pinned = false;

  function position() {
    if (tooltip.hidden) return;
    const anchor = button.getBoundingClientRect();
    const left = Math.max(12, Math.min(anchor.left - 10, window.innerWidth - tooltip.offsetWidth - 12));
    const above = anchor.top - tooltip.offsetHeight - 6;
    const preferredTop = above >= 12 ? above : anchor.bottom + 6;
    const top = Math.max(12, Math.min(preferredTop, window.innerHeight - tooltip.offsetHeight - 12));
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  }

  function show() {
    if (dismissActiveTooltip && dismissActiveTooltip !== dismiss) dismissActiveTooltip();
    dismissActiveTooltip = dismiss;
    clearTimeout(closeTimer);
    tooltip.hidden = false;
    position();
  }

  function dismiss() {
    clearTimeout(closeTimer);
    pinned = false;
    tooltip.hidden = true;
    if (dismissActiveTooltip === dismiss) dismissActiveTooltip = undefined;
  }

  function scheduleClose() {
    clearTimeout(closeTimer);
    closeTimer = setTimeout(() => {
      if (!hovered && !pinned && document.activeElement !== button) dismiss();
    }, 150);
  }

  help.addEventListener('mouseenter', () => {
    hovered = true;
    show();
  });
  help.addEventListener('mouseleave', () => {
    hovered = false;
    scheduleClose();
  });
  button.addEventListener('focus', show);
  button.addEventListener('blur', () => {
    pinned = false;
    scheduleClose();
  });
  button.addEventListener('click', () => {
    pinned = !pinned;
    if (pinned) show();
    else dismiss();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') dismiss();
  });
  document.addEventListener('pointerdown', (event) => {
    if (!help.contains(event.target)) dismiss();
  });
  window.addEventListener('resize', position);
  window.addEventListener('scroll', position, { passive: true, capture: true });
});
