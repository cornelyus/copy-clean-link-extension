# Copy Clean Link - Extensão Chrome

Extensão para Chrome que remove parâmetros de tracking das URLs ao copiar links.

## 🎯 Funcionalidades

- **Copy Clean Link**: Clique direito em qualquer link e selecione "Copy Clean Link" para copiar a URL sem parâmetros de tracking
- **Copy Clean Page URL**: Clique direito na página e selecione "Copy Clean Page URL" para copiar a URL atual limpa

## 🧹 Parâmetros Removidos

A extensão remove automaticamente parâmetros de:
- **Google Analytics**: utm_source, utm_medium, utm_campaign, utm_term, utm_content
- **Google Ads**: gclid, gclsrc, dclid, gbraid, wbraid
- **Facebook**: fbclid, fb_action_ids, fb_action_types
- **Microsoft/Bing**: msclkid
- **Twitter/X**: twclid, tw_source
- **LinkedIn**: li_fat_id, lipi
- **TikTok**: ttclid
- **Email Marketing**: mc_cid, mc_eid (Mailchimp), _hsenc, _hsmi (HubSpot)
- **Amazon**: ref, pf_rd_*, pd_rd_*
- **Instagram**: igshid, igsh
- E muitos outros...

## 📦 Como Instalar

### Método 1: Instalação Manual (Modo Desenvolvedor)

1. **Descarrega todos os ficheiros** desta extensão para uma pasta no teu computador

2. **Abre o Chrome** e vai a `chrome://extensions/`

3. **Ativa o "Modo de programador"** (Developer mode) no canto superior direito

4. **Clica em "Carregar extensão sem pacote"** (Load unpacked)

5. **Seleciona a pasta** onde guardaste os ficheiros da extensão

6. **Pronto!** A extensão está instalada e pronta a usar

### Método 2: Publicação na Chrome Web Store (Futuro)

Para usar em produção, se for publicado na Chrome Web Store seguindo [estas instruções](https://developer.chrome.com/docs/webstore/publish/).

## 🚀 Como Usar

### Limpar um link:
1. Clica com o botão direito em qualquer link
2. Seleciona "Copy Clean Link"
3. O link limpo é copiado automaticamente para o clipboard

### Limpar a URL atual:
1. Clica com o botão direito em qualquer parte da página
2. Seleciona "Copy Clean Page URL"
3. A URL limpa é copiada automaticamente para o clipboard

## 📝 Exemplo

**URL original:**
```
https://exemplo.com/artigo?utm_source=facebook&utm_medium=social&fbclid=IwAR123xyz&utm_campaign=promo
```

**URL limpa:**
```
https://exemplo.com/artigo
```

## 🔒 Privacidade

- A extensão funciona localmente no teu browser
- Não envia dados para servidores externos
- Não recolhe informação pessoal
- Open source - podes ver todo o código

## 🛠️ Ficheiros da Extensão

- `manifest.json` - Configuração da extensão
- `background.js` - Lógica de limpeza de URLs
- `icon16.png`, `icon48.png`, `icon128.png` - Ícones da extensão
- `README.md` - Este ficheiro

## 📄 Licença

Livre para uso pessoal e comercial.

## 🤝 Contribuir

Sente-te à vontade para modificar e melhorar a extensão!

### Adicionar mais parâmetros de tracking:
Edita o array `trackingParams` em `background.js` e adiciona os parâmetros que quiseres remover.

---

**Nota**: Esta extensão é inspirada na funcionalidade "Copy Clean Link" do Firefox.
