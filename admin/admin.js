// ---------- Tabs ----------
document.querySelectorAll('.tab-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
    document.querySelectorAll('.panel').forEach((p) => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('panel-' + btn.dataset.tab).classList.add('active');
    if (btn.dataset.tab === 'leads') loadLeads();
  });
});

// ---------- Helpers ----------
function field(labelText, id, value, isTextarea) {
  const tag = isTextarea ? 'textarea' : 'input';
  const typeAttr = isTextarea ? '' : 'type="text"';
  return `
    <div class="field">
      <label for="${id}">${labelText}</label>
      <${tag} id="${id}" ${typeAttr}>${isTextarea ? (value || '') : ''}</${tag}>
    </div>`;
}

function setVal(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value || '';
}
function getVal(id) {
  const el = document.getElementById(id);
  return el ? el.value : '';
}

// ---------- Build the content form ----------
let currentContent = null;

function buildForm(content) {
  currentContent = content;
  const c = content;
  const container = document.getElementById('contentForm');

  container.innerHTML = `
    <div class="card">
      <h2>Hero section</h2>
      ${field('Kicker (small label above headline)', 'hero_kicker')}
      ${field('Headline', 'hero_title', '', true)}
      ${field('Subheading', 'hero_subtitle', '', true)}
      <div class="grid-2">
        ${field('Primary button text', 'hero_ctaPrimary')}
        ${field('Secondary button text', 'hero_ctaSecondary')}
      </div>
      <div class="grid-2">
        ${field('Stat 1 number', 'hero_stat1Num')}
        ${field('Stat 1 label', 'hero_stat1Label')}
      </div>
      <div class="grid-2">
        ${field('Stat 2 number', 'hero_stat2Num')}
        ${field('Stat 2 label', 'hero_stat2Label')}
      </div>
      <div class="grid-2">
        ${field('Stat 3 number', 'hero_stat3Num')}
        ${field('Stat 3 label', 'hero_stat3Label')}
      </div>
    </div>

    <div class="card">
      <h2>What we do</h2>
      ${field('Section heading', 'capabilitiesHeading')}
      ${field('Section intro', 'capabilitiesIntro', '', true)}
      <div class="row-list">
        ${c.capabilities.map((cap, i) => `
          <div class="grid-2">
            ${field('Capability ' + (i + 1) + ' name', 'cap_' + i + '_name')}
            ${field('Capability ' + (i + 1) + ' description', 'cap_' + i + '_desc', '', true)}
          </div>
        `).join('')}
      </div>
    </div>

    <div class="card">
      <h2>How we work</h2>
      ${field('Section heading', 'processHeading')}
      ${field('Section intro', 'processIntro', '', true)}
      <div class="row-list">
        ${c.process.map((p, i) => `
          <div class="grid-2">
            ${field('Stage ' + (i + 1) + ' title', 'proc_' + i + '_title')}
            ${field('Stage ' + (i + 1) + ' description', 'proc_' + i + '_desc', '', true)}
          </div>
        `).join('')}
      </div>
    </div>

    <div class="card">
      <h2>Products</h2>
      ${field('Section heading', 'productsHeading')}
      ${field('Section intro', 'productsIntro', '', true)}

      <h2 style="margin-top:24px;">Talent Ignition</h2>
      ${field('Tag', 'ti_tag')}
      ${field('Name', 'ti_name')}
      ${field('Description', 'ti_lead', '', true)}
      ${c.products.talentIgnition.features.map((f, i) => field('Feature ' + (i + 1), 'ti_feat_' + i)).join('')}

      <h2 style="margin-top:24px;">ConsulBuzz</h2>
      ${field('Tag', 'cb_tag')}
      ${field('Name', 'cb_name')}
      ${field('Description', 'cb_lead', '', true)}
      <div class="grid-2">
        ${field('Student Mentor name', 'cb_sub0_name')}
        ${field('College Macha name', 'cb_sub1_name')}
      </div>
      <div class="grid-2">
        ${field('Student Mentor description', 'cb_sub0_desc', '', true)}
        ${field('College Macha description', 'cb_sub1_desc', '', true)}
      </div>

      <h2 style="margin-top:24px;">Bispun</h2>
      ${field('Tag', 'bp_tag')}
      ${field('Name', 'bp_name')}
      ${field('Description', 'bp_lead', '', true)}
      ${c.products.bispun.features.map((f, i) => field('Feature ' + (i + 1), 'bp_feat_' + i)).join('')}

      <h2 style="margin-top:24px;">Performance CRM</h2>
      ${field('Tag', 'pc_tag')}
      ${field('Name', 'pc_name')}
      ${field('Description', 'pc_lead', '', true)}
      ${c.products.performanceCrm.features.map((f, i) => field('Feature ' + (i + 1), 'pc_feat_' + i)).join('')}
    </div>

    <div class="card">
      <h2>Contact section</h2>
      ${field('Heading', 'contact_title')}
      ${field('Subheading', 'contact_subtitle', '', true)}
      ${field('Point 1', 'contact_point1')}
      ${field('Point 2', 'contact_point2')}
    </div>

    <div class="card">
      <h2>Footer</h2>
      ${field('Tagline', 'footer_tagline')}
    </div>
  `;

  // Fill values
  setVal('hero_kicker', c.hero.kicker);
  setVal('hero_title', c.hero.title);
  setVal('hero_subtitle', c.hero.subtitle);
  setVal('hero_ctaPrimary', c.hero.ctaPrimary);
  setVal('hero_ctaSecondary', c.hero.ctaSecondary);
  setVal('hero_stat1Num', c.hero.stat1Num);
  setVal('hero_stat1Label', c.hero.stat1Label);
  setVal('hero_stat2Num', c.hero.stat2Num);
  setVal('hero_stat2Label', c.hero.stat2Label);
  setVal('hero_stat3Num', c.hero.stat3Num);
  setVal('hero_stat3Label', c.hero.stat3Label);

  setVal('capabilitiesHeading', c.capabilitiesHeading);
  setVal('capabilitiesIntro', c.capabilitiesIntro);
  c.capabilities.forEach((cap, i) => {
    setVal('cap_' + i + '_name', cap.name);
    setVal('cap_' + i + '_desc', cap.desc);
  });

  setVal('processHeading', c.processHeading);
  setVal('processIntro', c.processIntro);
  c.process.forEach((p, i) => {
    setVal('proc_' + i + '_title', p.title);
    setVal('proc_' + i + '_desc', p.desc);
  });

  setVal('productsHeading', c.productsHeading);
  setVal('productsIntro', c.productsIntro);

  setVal('ti_tag', c.products.talentIgnition.tag);
  setVal('ti_name', c.products.talentIgnition.name);
  setVal('ti_lead', c.products.talentIgnition.lead);
  c.products.talentIgnition.features.forEach((f, i) => setVal('ti_feat_' + i, f));

  setVal('cb_tag', c.products.consulbuzz.tag);
  setVal('cb_name', c.products.consulbuzz.name);
  setVal('cb_lead', c.products.consulbuzz.lead);
  setVal('cb_sub0_name', c.products.consulbuzz.subproducts[0].name);
  setVal('cb_sub0_desc', c.products.consulbuzz.subproducts[0].desc);
  setVal('cb_sub1_name', c.products.consulbuzz.subproducts[1].name);
  setVal('cb_sub1_desc', c.products.consulbuzz.subproducts[1].desc);

  setVal('bp_tag', c.products.bispun.tag);
  setVal('bp_name', c.products.bispun.name);
  setVal('bp_lead', c.products.bispun.lead);
  c.products.bispun.features.forEach((f, i) => setVal('bp_feat_' + i, f));

  setVal('pc_tag', c.products.performanceCrm.tag);
  setVal('pc_name', c.products.performanceCrm.name);
  setVal('pc_lead', c.products.performanceCrm.lead);
  c.products.performanceCrm.features.forEach((f, i) => setVal('pc_feat_' + i, f));

  setVal('contact_title', c.contact.title);
  setVal('contact_subtitle', c.contact.subtitle);
  setVal('contact_point1', c.contact.point1);
  setVal('contact_point2', c.contact.point2);

  setVal('footer_tagline', c.footer.tagline);
}

function collectForm() {
  const c = JSON.parse(JSON.stringify(currentContent)); // clone to keep shape/lengths

  c.hero.kicker = getVal('hero_kicker');
  c.hero.title = getVal('hero_title');
  c.hero.subtitle = getVal('hero_subtitle');
  c.hero.ctaPrimary = getVal('hero_ctaPrimary');
  c.hero.ctaSecondary = getVal('hero_ctaSecondary');
  c.hero.stat1Num = getVal('hero_stat1Num');
  c.hero.stat1Label = getVal('hero_stat1Label');
  c.hero.stat2Num = getVal('hero_stat2Num');
  c.hero.stat2Label = getVal('hero_stat2Label');
  c.hero.stat3Num = getVal('hero_stat3Num');
  c.hero.stat3Label = getVal('hero_stat3Label');

  c.capabilitiesHeading = getVal('capabilitiesHeading');
  c.capabilitiesIntro = getVal('capabilitiesIntro');
  c.capabilities.forEach((cap, i) => {
    cap.name = getVal('cap_' + i + '_name');
    cap.desc = getVal('cap_' + i + '_desc');
  });

  c.processHeading = getVal('processHeading');
  c.processIntro = getVal('processIntro');
  c.process.forEach((p, i) => {
    p.title = getVal('proc_' + i + '_title');
    p.desc = getVal('proc_' + i + '_desc');
  });

  c.productsHeading = getVal('productsHeading');
  c.productsIntro = getVal('productsIntro');

  c.products.talentIgnition.tag = getVal('ti_tag');
  c.products.talentIgnition.name = getVal('ti_name');
  c.products.talentIgnition.lead = getVal('ti_lead');
  c.products.talentIgnition.features = c.products.talentIgnition.features.map((f, i) => getVal('ti_feat_' + i));

  c.products.consulbuzz.tag = getVal('cb_tag');
  c.products.consulbuzz.name = getVal('cb_name');
  c.products.consulbuzz.lead = getVal('cb_lead');
  c.products.consulbuzz.subproducts[0].name = getVal('cb_sub0_name');
  c.products.consulbuzz.subproducts[0].desc = getVal('cb_sub0_desc');
  c.products.consulbuzz.subproducts[1].name = getVal('cb_sub1_name');
  c.products.consulbuzz.subproducts[1].desc = getVal('cb_sub1_desc');

  c.products.bispun.tag = getVal('bp_tag');
  c.products.bispun.name = getVal('bp_name');
  c.products.bispun.lead = getVal('bp_lead');
  c.products.bispun.features = c.products.bispun.features.map((f, i) => getVal('bp_feat_' + i));

  c.products.performanceCrm.tag = getVal('pc_tag');
  c.products.performanceCrm.name = getVal('pc_name');
  c.products.performanceCrm.lead = getVal('pc_lead');
  c.products.performanceCrm.features = c.products.performanceCrm.features.map((f, i) => getVal('pc_feat_' + i));

  c.contact.title = getVal('contact_title');
  c.contact.subtitle = getVal('contact_subtitle');
  c.contact.point1 = getVal('contact_point1');
  c.contact.point2 = getVal('contact_point2');

  c.footer.tagline = getVal('footer_tagline');

  return c;
}

// ---------- Load / Save content ----------
fetch('/api/content')
  .then((res) => res.json())
  .then(buildForm)
  .catch((err) => {
    document.getElementById('contentForm').innerHTML = '<p class="empty">Could not load content: ' + err + '</p>';
  });

document.getElementById('saveBtn').addEventListener('click', async () => {
  const msg = document.getElementById('saveMsg');
  msg.textContent = 'Saving…';
  try {
    const updated = collectForm();
    const res = await fetch('/api/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    });
    if (!res.ok) throw new Error('Save failed');
    currentContent = updated;
    msg.textContent = 'Saved. Refresh the live site to see the changes.';
  } catch (err) {
    msg.textContent = 'Could not save changes: ' + err.message;
  }
});

// ---------- Leads ----------
let leadsLoaded = false;

function loadLeads() {
  if (leadsLoaded) return;
  fetch('/api/leads')
    .then((res) => res.json())
    .then((leads) => {
      leadsLoaded = true;
      document.getElementById('leadsCount').textContent = leads.length + ' submission' + (leads.length === 1 ? '' : 's');
      const target = document.getElementById('leadsTable');
      if (!leads.length) {
        target.innerHTML = '<p class="empty">No submissions yet.</p>';
        return;
      }
      const rows = leads.map((l) => `
        <tr>
          <td>${escapeHtml(l.fullName)}</td>
          <td>${escapeHtml(l.entityName)}</td>
          <td>${escapeHtml(l.designation)}</td>
          <td>${escapeHtml(l.email)}</td>
          <td>${escapeHtml(l.phone)}</td>
          <td>${escapeHtml(l.interest)}</td>
          <td>${escapeHtml(l.message)}</td>
          <td>${new Date(l.submittedAt).toLocaleString()}</td>
          <td><button class="del-btn" data-id="${l.id}">Delete</button></td>
        </tr>
      `).join('');
      target.innerHTML = `
        <table>
          <thead>
            <tr>
              <th>Name</th><th>Company</th><th>Role</th><th>Email</th><th>Phone</th>
              <th>Interested in</th><th>Message</th><th>Submitted</th><th></th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      `;
      target.querySelectorAll('.del-btn').forEach((btn) => {
        btn.addEventListener('click', async () => {
          if (!confirm('Delete this lead?')) return;
          await fetch('/api/leads/' + btn.dataset.id, { method: 'DELETE' });
          leadsLoaded = false;
          loadLeads();
        });
      });
    });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}
