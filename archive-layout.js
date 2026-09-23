/* ============================================================
   YUNG ARCHIVE — SHARED FRAME LAYOUT
   Used by both archive.html and editor.html so the live preview
   follows the same sizing rules as the published archive.
   ============================================================ */
(() => {
  'use strict';

  function number(value, fallback) {
    const n = parseFloat(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function ratioFromString(value, fallback = 3 / 4) {
    if (typeof value === 'number' && Number.isFinite(value) && value > 0) return value;
    const text = String(value || '').trim();
    const slash = text.match(/^([\d.]+)\s*\/\s*([\d.]+)$/);
    if (slash) {
      const a = Number(slash[1]);
      const b = Number(slash[2]);
      if (a > 0 && b > 0) return a / b;
    }
    const n = parseFloat(text);
    return Number.isFinite(n) && n > 0 ? n : fallback;
  }

  function cssLengthToPx(value, viewportWidth, viewportHeight, fallbackPx, axis = 'width') {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    const text = String(value || '').trim().toLowerCase();
    const n = parseFloat(text);
    if (!Number.isFinite(n)) return fallbackPx;
    if (text.endsWith('vw')) return viewportWidth * n / 100;
    if (text.endsWith('dvh') || text.endsWith('svh') || text.endsWith('lvh') || text.endsWith('vh')) return viewportHeight * n / 100;
    if (text.endsWith('%')) return (axis === 'height' ? viewportHeight : viewportWidth) * n / 100;
    if (text.endsWith('px') || /^[-+\d.]+$/.test(text)) return n;
    return fallbackPx;
  }

  function fitInside(maxWidth, maxHeight, ratio) {
    maxWidth = Math.max(1, maxWidth);
    maxHeight = Math.max(1, maxHeight);
    ratio = Math.max(0.03, ratio || 1);
    let width = maxWidth;
    let height = width / ratio;
    if (height > maxHeight) {
      height = maxHeight;
      width = height * ratio;
    }
    return { width, height };
  }

  function computeFrameBox(config = {}, mediaWidth = 0, mediaHeight = 0, viewportWidth = 1440, viewportHeight = 900, mode = 'desktop') {
    const fallbackRatio = ratioFromString(config.mobileRatio, 3 / 4);
    const naturalRatio = mediaWidth > 0 && mediaHeight > 0 ? mediaWidth / mediaHeight : fallbackRatio;
    const mobile = mode === 'mobile';

    if (config.bleed) {
      if (!mobile || config.mobileFullBleed === true) {
        return {
          width: viewportWidth,
          height: viewportHeight,
          objectFit: 'cover',
          objectPosition: mobile
            ? (config.mobileObjectPosition || config.objectPosition || 'center')
            : (config.objectPosition || 'center'),
          ratio: viewportWidth / Math.max(1, viewportHeight),
          bleed: true,
        };
      }

      const maxHeight = cssLengthToPx(config.mobileHeight || '64dvh', viewportWidth, viewportHeight, viewportHeight * .64, 'height');
      const maxWidth = cssLengthToPx(config.mobileMaxWidth || '100vw', viewportWidth, viewportHeight, viewportWidth, 'width');
      const fitMode = config.mobileFit || (config.frame === 'fullscreen' ? 'crop' : 'natural');
      if (fitMode === 'crop') {
        const cropRatio = ratioFromString(config.mobileRatio, config.frame === 'fullscreen' ? 1 : naturalRatio);
        return {
          ...fitInside(maxWidth, maxHeight, cropRatio),
          objectFit: 'cover',
          objectPosition: config.mobileObjectPosition || config.objectPosition || 'center',
          ratio: cropRatio,
          bleed: true,
        };
      }
      return {
        ...fitInside(maxWidth, maxHeight, naturalRatio),
        objectFit: 'contain',
        objectPosition: config.mobileObjectPosition || config.objectPosition || 'center',
        ratio: naturalRatio,
        bleed: true,
      };
    }

    if (mobile) {
      const maxHeight = cssLengthToPx(config.mobileHeight || '72dvh', viewportWidth, viewportHeight, viewportHeight * .72, 'height');
      const maxWidth = cssLengthToPx(config.mobileMaxWidth || '100vw', viewportWidth, viewportHeight, viewportWidth, 'width');
      const fitMode = config.mobileFit || 'natural';

      if (fitMode === 'crop') {
        const cropRatio = ratioFromString(config.mobileRatio, naturalRatio);
        const fitted = fitInside(maxWidth, maxHeight, cropRatio);
        return {
          ...fitted,
          objectFit: 'cover',
          objectPosition: config.mobileObjectPosition || config.objectPosition || 'center',
          ratio: cropRatio,
          bleed: false,
        };
      }

      const fitted = fitInside(maxWidth, maxHeight, naturalRatio);
      return {
        ...fitted,
        objectFit: 'contain',
        objectPosition: config.mobileObjectPosition || config.objectPosition || 'center',
        ratio: naturalRatio,
        bleed: false,
      };
    }

    const maxWidth = cssLengthToPx(config.desktopWidth || '48vw', viewportWidth, viewportHeight, viewportWidth * .48, 'width');
    const maxHeight = cssLengthToPx(config.desktopMaxHeight || '88dvh', viewportWidth, viewportHeight, viewportHeight * .88, 'height');
    const fitted = fitInside(maxWidth, maxHeight, naturalRatio);
    return {
      ...fitted,
      objectFit: 'contain',
      objectPosition: config.objectPosition || 'center',
      ratio: naturalRatio,
      bleed: false,
    };
  }

  function mergedFrameConfig(frame = {}, presets = window.FRAME_PRESETS || {}) {
    return { ...(presets[frame.frame] || {}), ...frame };
  }

  window.YungArchiveLayout = {
    cssLengthToPx,
    ratioFromString,
    fitInside,
    computeFrameBox,
    mergedFrameConfig,
  };
})();