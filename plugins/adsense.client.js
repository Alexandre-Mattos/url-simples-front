export default defineNuxtPlugin(() => {
  const { $config } = useNuxtApp();

  if (process.client && $config.public.adsenseClient) {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${$config.public.adsenseClient}`;
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);

    window.$loadAd = () => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("Erro ao carregar anúncio:", e);
      }
    };
  }
});
