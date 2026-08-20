(() => {
  const referenceSections = [
    { element: document.querySelector('#images'), kind: 'image' },
    { element: document.querySelector('#web'), kind: 'web' }
  ];
  const modal = document.querySelector('#reference-modal');
  const modalImageWrap = modal.querySelector('.modal-image-wrap');
  const modalImage = modal.querySelector('.modal-image');
  const modalTitle = modal.querySelector('#modal-title');
  const modalIndex = modal.querySelector('.modal-index');
  const modalDescription = modal.querySelector('.modal-description');
  const modalTerms = modal.querySelector('.modal-terms');
  const modalWebsitePrompt = modal.querySelector('.modal-website-prompt');
  const modalImagePrompt = modal.querySelector('.modal-image-prompt');
  const imagePromptBlock = modal.querySelector('.image-prompt-block');
  const websiteCopy = modal.querySelector('.copy-website-prompt');
  const imageCopy = modal.querySelector('.copy-image-prompt');
  const closeButton = modal.querySelector('.modal-close');
  let activeCard = null;

  const vocabularyByType = [
    [/advert|product print|tech advert|product page|commerce/i, ['visual hierarchy', 'brand recall', 'sales message']],
    [/map|plan|terrain|topographic|track|architecture/i, ['spatial data', 'information layer', 'orientation']],
    [/poster|campaign|identity|game/i, ['visual hierarchy', 'focal point', 'art direction']],
    [/texture|pattern|generative|grid|archive/i, ['surface quality', 'repetition', 'visual rhythm']],
    [/landscape|nature|atmospheric|travel/i, ['depth cue', 'tonal contrast', 'sense of scale']],
    [/interface|dashboard|dossier|profile|character|tool|saas/i, ['information hierarchy', 'modular system', 'status cue']],
    [/collage|mixed media|experimental/i, ['layering', 'image collision', 'cut-and-paste']],
    [/editorial|magazine|print|portfolio/i, ['page hierarchy', 'reading order', 'editorial rhythm']],
    [/illustration|3d study|digital art|studio/i, ['shape language', 'visual balance', 'form study']]
  ];

  const moodRules = [
    [/grain|dark|black|storm|ash|glitch|brutal|cyber/i, 'tense, raw, technical, and slightly damaged'],
    [/nature|landscape|cloud|sea|mountain|garden|sage|forest/i, 'quiet, spacious, observant, and grounded in natural form'],
    [/archive|advert|magazine|print|retro|pixel/i, 'archival, tactile, direct, and tied to a clear period'],
    [/map|plan|grid|system|data|interface|technical|dashboard/i, 'precise, analytical, ordered, and rich in information'],
    [/game|character|anime|campaign/i, 'dramatic, fast, immersive, and driven by a clear fictional world'],
    [/minimal|white|quiet|studio|portfolio/i, 'calm, exact, restrained, and confident'],
    [/food|pop|yellow|bright/i, 'bright, direct, playful, and easy to approach']
  ];

  function textOf(card, selector) {
    return card.querySelector(selector)?.textContent.trim() || '';
  }

  function getTitle(card) {
    return textOf(card, 'h3') || textOf(card, '.domain');
  }

  function uniqueTerms(card) {
    const existing = [...card.querySelectorAll('.terms span')].map((term) => term.textContent.trim());
    const type = textOf(card, '.kicker');
    const matched = vocabularyByType.find(([pattern]) => pattern.test(type));
    const additions = matched ? matched[1] : ['visual hierarchy', 'composition', 'art direction'];
    return [...new Set([...existing, ...additions, 'contrast', 'visual rhythm'])].slice(0, 5);
  }

  function getMood(card) {
    const source = `${getTitle(card)} ${textOf(card, '.kicker')} ${card.referenceTerms.join(' ')}`;
    return moodRules.find(([pattern]) => pattern.test(source))?.[1] || 'clear, considered, visual, and deliberate';
  }

  function extendedDescription(card) {
    const title = getTitle(card);
    const type = textOf(card, '.kicker');
    const short = textOf(card, 'p');
    const image = card.querySelector('img');
    const subject = image ? image.alt : `the live website ${title}`;
    const terms = card.referenceTerms.join(', ');
    const mood = getMood(card);
    const use = card.referenceKind === 'web'
      ? 'For web design, study how the page sets a first focal point, divides content into sections, and keeps its main action easy to find.'
      : 'For web design, translate its strongest relation between scale, space, texture, and type into a page system instead of copying the subject itself.';
    return `This reference presents ${subject.toLowerCase()}. ${short} Its main design language combines ${terms}. The result feels ${mood}. ${use} It is most useful as a guide for hierarchy, pacing, image treatment, and the amount of visual tension a page can hold without losing clarity.`;
  }

  function websitePrompt(card) {
    const title = getTitle(card);
    const type = textOf(card, '.kicker').replace(/Live reference · /i, '');
    const short = textOf(card, 'p');
    const mood = getMood(card);
    const terms = card.referenceTerms.join(', ');
    return `Design a responsive website inspired by the visual principles of “${title}.” Do not copy its brand, text, images, layout, or identity. Use it only as a direction for mood and design decisions.

PURPOSE AND FEELING
Create a ${type.toLowerCase()} experience that feels ${mood}. The source idea is: ${short} Translate that feeling into a useful interface for real content.

VISUAL SYSTEM
Build the design around these traits: ${terms}. Set a clear type scale with one strong display level, a practical reading level, and small labels for data. Use spacing as an active part of the design. Let one key visual or content block lead each screen. Keep decoration tied to hierarchy or meaning. Use a limited color system with one main ground, one text color, and one signal color. If the reference uses grain, maps, scans, hard grids, or image layers, apply that trait with restraint and keep all text readable.

PAGE STRUCTURE
Create a clear header, a focused opening section, a short context section, a flexible content grid, one detailed feature area, and a useful closing action. Vary image scale to set rhythm. Use captions and small metadata to make the page feel collected and specific. Keep navigation short and visible. On small screens, preserve the same order and mood without shrinking desktop blocks into unreadable cards.

INTERACTION AND ACCESS
Use simple hover and focus states that match the visual system. Add motion only when it explains a change or helps navigation. Support keyboard use, visible focus, good color contrast, reduced motion, useful alternative text, and large touch targets. The final page must feel related to the reference through structure and tone, not through direct imitation.`;
  }

  function imagePrompt(card) {
    const title = getTitle(card);
    const type = textOf(card, '.kicker').replace(/Live reference · /i, '');
    const short = textOf(card, 'p');
    const image = card.querySelector('img');
    const subject = image ? image.alt : `an original visual study for a ${type.toLowerCase()} website`;
    const mood = getMood(card);
    const terms = card.referenceTerms.join(', ');
    return `Create one original visual asset for use inside a website. Use “${title}” only as a mood reference. Do not reproduce any brand, logo, character, product, artwork, text, or exact composition from the source.

SUBJECT
Show ${subject.toLowerCase()}. Interpret the source idea this way: ${short} Keep the result suitable for a large website feature image or editorial header.

ART DIRECTION
The image must feel ${mood}. Use these visual traits: ${terms}. Set one clear focal area and enough quiet space for nearby website type. Control detail so the image still reads at small sizes. Preserve natural material detail where relevant, but avoid random visual noise. If type appears, use only small abstract marks or neutral placeholder symbols. Do not create readable brand copy.

COMPOSITION AND OUTPUT
Use a wide 16:10 composition with a strong foreground-to-background relation. Keep key content away from the outer edges so the asset can crop safely on mobile. Use a limited, coherent palette with strong tonal separation. Produce high detail, clean edges where the style calls for them, intentional texture, no watermark, no signature, no mockup frame, and no unrelated objects. The result must work as a web asset, not as a copy of the reference.`;
  }

  async function copyText(text, button) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (_) {
      const field = document.createElement('textarea');
      field.value = text;
      field.style.position = 'fixed';
      field.style.opacity = '0';
      document.body.append(field);
      field.select();
      document.execCommand('copy');
      field.remove();
    }
    const original = button.textContent;
    button.textContent = 'Copied';
    button.classList.add('is-copied');
    window.setTimeout(() => {
      button.textContent = original;
      button.classList.remove('is-copied');
    }, 1400);
  }

  function openReference(card) {
    activeCard = card;
    const image = card.querySelector('img');
    if (image) {
      modalImageWrap.classList.remove('is-empty');
      modalImageWrap.removeAttribute('data-domain');
      modalImage.src = image.src;
      modalImage.alt = image.alt;
    } else {
      modalImage.src = '';
      modalImage.alt = '';
      modalImageWrap.classList.add('is-empty');
      modalImageWrap.dataset.domain = getTitle(card);
    }
    modalTitle.textContent = getTitle(card);
    modalIndex.textContent = `${textOf(card, '.kicker')} · Reference ${card.referenceIndex}`;
    modalDescription.textContent = card.referenceDescription;
    modalTerms.replaceChildren(...card.referenceTerms.map((term) => {
      const chip = document.createElement('span');
      chip.textContent = term;
      return chip;
    }));
    modalWebsitePrompt.textContent = card.websitePrompt;
    imagePromptBlock.hidden = card.referenceKind === 'web';
    modalImagePrompt.textContent = card.referenceKind === 'image' ? card.imagePrompt : '';
    modal.showModal();
  }

  referenceSections.forEach(({ element, kind }) => {
    const cards = [...element.querySelectorAll('.card')];
    cards.forEach((card, index) => {
      card.referenceKind = kind;
      card.referenceIndex = `${kind === 'web' ? 'W' : 'I'}${String(index + 1).padStart(2, '0')}`;
      card.referenceTerms = uniqueTerms(card);
      const terms = card.querySelector('.terms');
      terms.replaceChildren(...card.referenceTerms.map((term) => {
        const chip = document.createElement('span');
        chip.textContent = term;
        return chip;
      }));

      card.referenceDescription = extendedDescription(card);
      card.websitePrompt = websitePrompt(card);
      card.imagePrompt = imagePrompt(card);

      const heading = card.querySelector('h3') || card.querySelector('.domain');
      const title = document.createElement('button');
      title.type = 'button';
      title.className = 'reference-title';
      title.setAttribute('aria-haspopup', 'dialog');
      title.textContent = heading.textContent.trim();
      heading.replaceChildren(title);
      title.addEventListener('click', () => openReference(card));

      const body = card.querySelector('.card-body') || card;
      const actions = document.createElement('div');
      actions.className = 'card-actions';
      actions.innerHTML = `<span class="card-count">REF—${card.referenceIndex}</span><button class="card-copy" type="button">Website prompt</button>`;
      actions.querySelector('button').addEventListener('click', (event) => copyText(card.websitePrompt, event.currentTarget));
      body.append(actions);
    });
  });

  websiteCopy.addEventListener('click', () => activeCard && copyText(activeCard.websitePrompt, websiteCopy));
  imageCopy.addEventListener('click', () => activeCard && copyText(activeCard.imagePrompt, imageCopy));
  closeButton.addEventListener('click', () => modal.close());
  modal.addEventListener('click', (event) => {
    if (event.target === modal) modal.close();
  });
  modal.addEventListener('close', () => {
    modalImage.src = '';
    activeCard?.querySelector('.reference-title')?.focus();
  });
})();
