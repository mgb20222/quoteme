export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const formData = await request.formData();
    const turnstileToken = formData.get('cf-turnstile-response');
    const honeypot = formData.get('company_website');

    if (honeypot) {
      return new Response(JSON.stringify({ ok: false, error: 'Rejected.' }), {
        status: 400,
        headers: { 'content-type': 'application/json' }
      });
    }

    if (!turnstileToken) {
      return new Response(JSON.stringify({ ok: false, error: 'Missing verification token.' }), {
        status: 400,
        headers: { 'content-type': 'application/json' }
      });
    }

    const verifyBody = new URLSearchParams();
    verifyBody.append('secret', env.TURNSTILE_SECRET_KEY);
    verifyBody.append('response', turnstileToken.toString());

    const turnstileResp = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: verifyBody
    });

    const turnstileResult = await turnstileResp.json();
    if (!turnstileResult.success) {
      return new Response(JSON.stringify({ ok: false, error: 'Verification failed.' }), {
        status: 403,
        headers: { 'content-type': 'application/json' }
      });
    }

    const payload = Object.fromEntries(formData.entries());
    delete payload['cf-turnstile-response'];
    delete payload['company_website'];

    return new Response(JSON.stringify({ ok: true, message: 'Submission received.' }), {
      status: 200,
      headers: { 'content-type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ ok: false, error: 'Server error.' }), {
      status: 500,
      headers: { 'content-type': 'application/json' }
    });
  }
}
