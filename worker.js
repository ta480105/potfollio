export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const json = (data, status = 200) =>
      new Response(JSON.stringify(data), {
        status,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store"
        }
      });

    if (url.pathname === "/api/health" && request.method === "GET") {
      return json({
        ok: true,
        service: "portfolio-inquiries",
        emailConfigured: Boolean(env.RESEND_API_KEY),
        emailProvider: env.RESEND_API_KEY ? "resend" : "none"
      });
    }

    if (url.pathname !== "/api/inquiries") {
      return new Response("Not found", { status: 404 });
    }

    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405, {
        Allow: "POST"
      });
    }

    if (!env.RESEND_API_KEY) {
      return json({ error: "Email service is not configured yet." }, 503);
    }

    let body;
    try {
      const raw = await request.text();
      if (raw.length > 20000) {
        return json({ error: "Request is too large." }, 413);
      }
      body = JSON.parse(raw);
    } catch {
      return json({ error: "Invalid request body." }, 400);
    }

    const clean = (value) =>
      typeof value === "string" ? value.trim() : "";

    const data = {
      name: clean(body.name),
      business: clean(body.business),
      email: clean(body.email),
      phone: clean(body.phone),
      service: clean(body.service),
      budget: clean(body.budget),
      message: clean(body.message),
      website: clean(body.website)
    };

    if (data.website) return json({ ok: true });

    if (!data.name || !data.email || !data.message) {
      return json({
        error: "Please provide your name, email, and project details."
      }, 400);
    }

    if (
      data.name.length > 120 ||
      data.business.length > 160 ||
      data.email.length > 254 ||
      data.phone.length > 40 ||
      data.service.length > 100 ||
      data.budget.length > 80 ||
      data.message.length > 5000
    ) {
      return json({ error: "One or more fields are too long." }, 400);
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return json({ error: "Please enter a valid email address." }, 400);
    }

    const text = [
      "New website project inquiry",
      "",
      `Name: ${data.name}`,
      `Business: ${data.business || "Not provided"}`,
      `Client email: ${data.email}`,
      `WhatsApp: ${data.phone || "Not provided"}`,
      `Service: ${data.service || "Not specified"}`,
      `Budget: ${data.budget || "Not sure yet"}`,
      "",
      "Project details:",
      data.message
    ].join("\n");

    const subject = `Portfolio inquiry: ${data.service || "Website project"} - ${data.name}`
      .replace(/[\r\n]+/g, " ");

    let response;
    try {
      response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: "Portfolio Inquiry <onboarding@resend.dev>",
          to: ["ta480105@gmail.com"],
          reply_to: data.email,
          subject,
          text
        })
      });
    } catch {
      return json({ error: "Email service could not be reached. Please try again later." }, 502);
    }

    if (!response.ok) {
      console.error("Resend email request failed with status:", response.status);
      return json({
        error: "Email delivery failed. Please try again later."
      }, 502);
    }

    return json({ ok: true });
  }
};
