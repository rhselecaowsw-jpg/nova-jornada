(() => {
  "use strict";

  /*
   * CONFIGURAÇÃO DE MONETIZAÇÃO
   * 1) Após aprovação no Google AdSense, substitua os valores abaixo.
   * 2) Enquanto não houver IDs válidos, os espaços continuam como áreas de parceiro.
   */
  const ADSENSE_CLIENT = ""; // Ex.: ca-pub-1234567890123456
  const ADSENSE_SLOTS = {
    "topo-central": "",
    "apos-curriculo": "",
    "rodape-central": ""
  };

  const zones = [...document.querySelectorAll(".ad-zone")];
  if (!ADSENSE_CLIENT || !ADSENSE_CLIENT.startsWith("ca-pub-")) return;

  const loader = document.createElement("script");
  loader.async = true;
  loader.crossOrigin = "anonymous";
  loader.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(ADSENSE_CLIENT)}`;
  document.head.appendChild(loader);

  zones.forEach(zone => {
    const slot = ADSENSE_SLOTS[zone.dataset.adSlot];
    if (!slot) return;
    zone.innerHTML = "";
    const ins = document.createElement("ins");
    ins.className = "adsbygoogle";
    ins.style.display = "block";
    ins.dataset.adClient = ADSENSE_CLIENT;
    ins.dataset.adSlot = slot;
    ins.dataset.adFormat = "auto";
    ins.dataset.fullWidthResponsive = "true";
    zone.appendChild(ins);
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (_) {}
  });
})();
