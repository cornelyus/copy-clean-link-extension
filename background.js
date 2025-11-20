// Lista de parâmetros de tracking comuns
const trackingParams = [
  // Google Analytics e Google Ads
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'gclid', 'gclsrc', 'dclid', 'gbraid', 'wbraid',
  
  // Facebook
  'fbclid', 'fb_action_ids', 'fb_action_types', 'fb_source', 'fb_ref',
  
  // Microsoft/Bing
  'msclkid', 'ms_clkid',
  
  // Twitter/X
  'twclid', 'tw_source', 'ref_src', 'ref_url',
  
  // LinkedIn
  'li_fat_id', 'lipi', 'licu',
  
  // TikTok
  'ttclid', 'tt_medium', 'tt_content',
  
  // Email Marketing
  'mc_cid', 'mc_eid', // Mailchimp
  '_hsenc', '_hsmi', // HubSpot
  'vero_id', 'vero_conv',
  
  // Amazon
  'ref', 'ref_', 'pf_rd_r', 'pf_rd_p', 'pf_rd_m', 'pf_rd_s', 'pf_rd_t', 'pf_rd_i',
  'pd_rd_r', 'pd_rd_w', 'pd_rd_wg',
  
  // Outras plataformas
  'igshid', 'igsh', // Instagram
  'zanpid', // Zanox
  'kclickid', // Kenshoo
  'aclk', // AdRoll
  'src', 'ref', 'source', // Genéricos
  '_ga', '_gl', // Google Analytics adicionais
  'pcrid', 'pmt', 'pkw', // Parâmetros de campanha
  'ncid', 'sr_share', // Reddit
  
  // Rastreamento de sessão e conversão
  'sessionid', 'session_id', 'sid',
  'cvid', 'oicd', 'clickid',
  
  // Parâmetros de afiliados
  'affid', 'affiliate', 'aff_id', 'aff_sub'
];

// Função para limpar a URL
function cleanURL(url) {
  try {
    const urlObj = new URL(url);
    
    // Remove parâmetros de tracking
    trackingParams.forEach(param => {
      urlObj.searchParams.delete(param);
    });
    
    // Remove parâmetros que começam com utm_ (catch-all)
    const allParams = Array.from(urlObj.searchParams.keys());
    allParams.forEach(param => {
      if (param.toLowerCase().startsWith('utm_')) {
        urlObj.searchParams.delete(param);
      }
    });
    
    // Retorna URL limpa
    let cleanedURL = urlObj.toString();
    
    // Remove '?' no final se não houver parâmetros
    if (cleanedURL.endsWith('?')) {
      cleanedURL = cleanedURL.slice(0, -1);
    }
    
    return cleanedURL;
  } catch (error) {
    console.error('Erro ao limpar URL:', error);
    return url; // Retorna URL original se houver erro
  }
}

// Criar menu de contexto quando a extensão é instalada
chrome.runtime.onInstalled.addListener(() => {
  // Menu para links
  chrome.contextMenus.create({
    id: 'copyCleanLink',
    title: 'Copy Clean Link',
    contexts: ['link']
  });
  
  // Menu para a página atual
  chrome.contextMenus.create({
    id: 'copyCleanPageURL',
    title: 'Copy Clean Page URL',
    contexts: ['page']
  });
});

// Lidar com cliques no menu de contexto
chrome.contextMenus.onClicked.addListener((info, tab) => {
  let urlToClean;
  
  if (info.menuItemId === 'copyCleanLink') {
    // URL do link clicado
    urlToClean = info.linkUrl;
  } else if (info.menuItemId === 'copyCleanPageURL') {
    // URL da página atual
    urlToClean = info.pageUrl;
  }
  
  if (urlToClean) {
    const cleanedURL = cleanURL(urlToClean);
    
    // Copiar para clipboard
    copyToClipboard(cleanedURL, tab.id);
  }
});

// Função para copiar texto para clipboard
function copyToClipboard(text, tabId) {
  // Injetar script no tab ativo para copiar
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: (textToCopy) => {
      navigator.clipboard.writeText(textToCopy).then(() => {
        console.log('URL limpa copiada:', textToCopy);
      }).catch(err => {
        console.error('Erro ao copiar:', err);
      });
    },
    args: [text]
  });
}
