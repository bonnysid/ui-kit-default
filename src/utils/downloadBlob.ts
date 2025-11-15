export const downloadBlob = (
  data: Blob | ArrayBuffer | string,
  headers: Record<string, any> | undefined,
  filenameFallback: string,
) => {
  const contentType =
    headers?.['content-type'] || headers?.['Content-Type'] || 'application/octet-stream';

  const dispo = headers?.['content-disposition'] || headers?.['Content-Disposition'];

  let filename = filenameFallback;
  if (typeof dispo === 'string') {
    const m = /filename\*?=(?:UTF-8''|")?([^";]+)/i.exec(dispo);
    if (m?.[1]) {
      try {
        filename = decodeURIComponent(m[1].replace(/"/g, ''));
      } catch {
        filename = m[1].replace(/"/g, '');
      }
    }
  }

  let blob: Blob;
  if (data instanceof Blob) {
    blob = data;
  } else if (data instanceof ArrayBuffer) {
    blob = new Blob([data], { type: contentType });
  } else if (typeof data === 'string') {
    const isLikelyB64 = /^[A-Za-z0-9+/=\r\n]+$/.test(data) && data.length % 4 === 0;
    if (isLikelyB64) {
      const bin = atob(data.replace(/\s+/g, ''));
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      blob = new Blob([bytes], { type: contentType });
    } else {
      blob = new Blob([data], { type: contentType });
    }
  } else {
    throw new TypeError('Unexpected data type for download');
  }

  const URL_ = window.URL;
  const link = document.createElement('a');
  const url = URL_.createObjectURL(blob);
  try {
    link.href = url;
    link.target = '_blank';
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
  } finally {
    link.remove();
    URL_.revokeObjectURL(url);
  }
};
