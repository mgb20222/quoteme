export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    if (request.method !== 'POST') {
      return new Response(
        JSON.stringify({ ok: false, error: 'Method not allowed.' }),
        {
          status: 405,
          headers: { 'content-type': 'application/json' }
        }
      );
    }

    const formData = await request.formData();
    const honeypot = formData.get('company_website');

    if (honeypot) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Rejected.' }),
        {
          status: 400,
          headers: { 'content-type': 'application/json' }
        }
      );
    }

    const data = {};
    for (const [key, value] of formData.entries()) {
      if (key === 'cf-turnstile-response' || key === 'company_website') continue;
      data[key] = value;
    }

    const insuranceType = data.insuranceType || 'Not specified';
    const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim();

    const airtableUrl = `https://api.airtable.com/v0/${env.AIRTABLE_BASE_ID}/${encodeURIComponent(env.AIRTABLE_TABLE_NAME)}`;

    const airtableResp = await fetch(airtableUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fields: {
          'First Name': data.firstName || '',
          'Last Name': data.lastName || '',
          'Email': data.email || '',
          'Phone': data.phone || '',
          'Insurance Type': data.insuranceType || '',
          'Submitted At': new Date().toISOString()
        }
      })
    });

    if (!airtableResp.ok) {
      const errorText = await airtableResp.text();
      return new Response(
        JSON.stringify({ ok: false, error: `Failed to save submission: ${errorText}` }),
        {
          status: 500,
          headers: { 'content-type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({ ok: true, message: 'Submission received.' }),
      {
        status: 200,
        headers: { 'content-type': 'application/json' }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ ok: false, error: `Server error: ${error.message}` }),
      {
        status: 500,
        headers: { 'content-type': 'application/json' }
      }
    );
  }
}
