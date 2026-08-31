// ---------- Year ----------
document.getElementById('year').textContent = new Date().getFullYear();

// ---------- Mobile nav ----------
const toggle = document.getElementById('navToggle');
const links = document.getElementById('navLinks');
toggle.addEventListener('click', () => links.classList.toggle('open'));
links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));

// ---------- Load editable content from the backend ----------
function getPath(obj, path) {
  return path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}

fetch('/api/content')
  .then((res) => res.json())
  .then((content) => {
    document.querySelectorAll('[data-bind]').forEach((el) => {
      const value = getPath(content, el.getAttribute('data-bind'));
      if (typeof value === 'string') {
        el.textContent = value;
      }
    });
  })
  .catch((err) => {
    // If the content API isn't reachable, the page still shows its built-in default copy.
    console.log('Using built-in default content (content API unavailable):', err);
  });

// ---------- Lead form ----------
const form = document.getElementById('leadForm');
const status = document.getElementById('formStatus');
const statusText = document.getElementById('formStatusText');
const submitBtn = document.getElementById('submitBtn');

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const data = {
    fullName: document.getElementById('fullName').value.trim(),
    designation: document.getElementById('designation').value.trim(),
    email: document.getElementById('email').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    entityName: document.getElementById('entityName').value.trim(),
    interest: document.getElementById('interest').value,
    message: document.getElementById('message').value.trim()
  };

  if (!data.fullName || !data.email || !data.phone || !data.entityName) {
    statusText.textContent = 'Please fill in your name, email, phone and company name.';
    status.classList.remove('show');
    status.classList.add('show', 'error');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';

  try {
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || 'Something went wrong.');
    }

    status.classList.remove('error');
    statusText.textContent = "Thanks, " + data.fullName.split(' ')[0] + ". We've got your details for " + data.entityName + " and will reach out shortly.";
    status.classList.add('show');
    form.reset();
  } catch (err) {
    status.classList.add('error');
    statusText.textContent = "We couldn't send that — please try again in a moment, or write to us directly.";
    status.classList.add('show');
    console.error(err);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send request';
  }
});
