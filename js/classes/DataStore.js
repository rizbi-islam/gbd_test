/**
 * DataStore — Singleton responsible for loading and caching all site data.
 * Data is embedded inline so the site works when opened directly as a file
 * (file:// protocol) without needing a local server.
 */
class DataStore {
  constructor() {
    if (DataStore._instance) return DataStore._instance;
    this._data = null;
    this._loaded = false;
    DataStore._instance = this;
  }

  /**
   * Load site data. Uses embedded inline data so no HTTP server is required.
   * @returns {Promise<Object>}
   */
  async load() {
    if (this._loaded) return this._data;
    this._data = DataStore._INLINE_DATA;
    this._loaded = true;
    return this._data;
  }

  // ─── Inline Data (no fetch needed) ──────────────────────────────────────────
  static _INLINE_DATA = {
  "global": {
    "header": {
      "logo": "img/greenbd-logo.png",
      "logoText": "img/greenbd-banner-Text.png",
      "nav": [
        { "text": "Home", "url": "#/" },
        {
          "text": "Services",
          "dropdown": [
            { "text": "Shared Hosting",         "url": "#/shared" },
            { "text": "Zimbra Mail Hosting",    "url": "#/zimbra" },
            { "text": "Domain Services",        "url": "#/domain" },
            { "text": "On-Premise Mail Server", "url": "#/onpremise" },
            { "text": "Cloud VPS",              "url": "#/cloud" },
            { "text": "SSL Certificate",        "url": "#/ssl" }
          ]
        },
        { "text": "About", "url": "#/about" }
      ]
    },
    "heroSlides": [
      { "bgImage": "img/banner1.png", "title": "Premium Web Hosting",     "description": "Fast, Secure & Reliable Infrastructure" },
      { "bgImage": "img/banner5.png", "title": "Cloud VPS Solutions",     "description": "Scalable virtual private servers with SSD & high uptime." },
      { "bgImage": "img/banner6.png", "title": "Secure SSL Certificates", "description": "Protect Your Website & Customers" },
      { "bgImage": "img/banner3.png", "title": "Domain Services",         "description": "Secure your brand identity online." },
      { "bgImage": "img/banner8.jpg", "title": "Zimbra Mail Hosting",     "description": "Enterprise-grade email collaboration with security & reliability." }
    ],
    "footer": "© 2026 GreenBD Hosting — All rights reserved"
  },
  "pages": {
    "index": {
      "services": [
        { "image": "img/host-serv.jpg",   "title": "Web Hosting",           "description": "High-performance hosting powered by secure infrastructure and SSD storage.",        "link": "#/shared" },
        { "image": "img/dom-serv.jpg",    "title": "Domain Services",       "description": "Secure your brand identity online.",                                               "link": "#/domain" },
        { "image": "img/mail-serv.jpg",   "title": "Dedicated Mail Server", "description": "Significantly more cost effective.",                                               "link": "#/onpremise" },
        { "image": "img/zimbra-serv.png", "title": "Zimbra Mail Hosting",   "description": "Enterprise-grade email collaboration with security & reliability.",               "link": "#/zimbra" },
        { "image": "img/cloud-serv.jpg",  "title": "Cloud VPS",             "description": "Scalable virtual private servers with SSD & high uptime.",                        "link": "#/cloud" },
        { "image": "img/ssl-serv.png",    "title": "SSL Certificate",       "description": "Secure your website with trusted encryption & HTTPS protection.",                 "link": "#/ssl" }
      ],
      "contact": {
        "email":   "support@greenbd-hosting.com",
        "phone":   "+880 1716-398334",
        "address": "Gulshan-1, Dhaka, Bangladesh",
        "social": [
          { "icon": "ⓕ",  "url": "#", "title": "Facebook" },
          { "icon": "𝕏",  "url": "#", "title": "Twitter" },
          { "icon": "in", "url": "#", "title": "LinkedIn" },
          { "icon": "▶",  "url": "#", "title": "YouTube" }
        ]
      }
    },
    "about-us": {
      "title": "Who We Are",
      "paragraphs": [
        "GreenBD Hosting is a technology-driven hosting provider committed to delivering secure, scalable, and eco-friendly infrastructure solutions.",
        "We specialize in shared hosting, VPS solutions, and domain services designed to empower businesses, startups, and individuals across Bangladesh and beyond.",
        "With 24/7 technical support and optimized infrastructure, we provide a hosting experience engineered for growth.",
        "Our mission is to provide high-performance hosting backed by modern infrastructure, expert support, and sustainable practices.",
        "Whether you're launching your first website or scaling enterprise workloads, GreenBD Hosting grows with you."
      ],
      "image": "img/about.jpg"
    },
    "shared": {
      "title": "Secure Shared Hosting",
      "paragraphs": [
        "We specialize in shared hosting, VPS solutions, and domain services designed to empower businesses, startups, and individuals across Bangladesh and beyond.",
        "With 24/7 technical support and optimized infrastructure, we provide a hosting experience engineered for growth.",
        "Our mission is to provide high-performance hosting backed by modern infrastructure, expert support, and sustainable practices.",
        "Whether you're launching your first website or scaling enterprise workloads, GreenBD Hosting grows with you."
      ],
      "image": "img/host-serv.jpg"
    },
    "ssl": {
      "title": "SSL Certificate",
      "intro": "Protect your website with secure HTTPS encryption.",
      "paragraphs": [
        "An SSL Certificate is essential for protecting your website and customer data. GreenBD Hosting provides trusted SSL solutions that encrypt communication between your website and visitors, ensuring secure transactions and data privacy.",
        "SSL not only secures sensitive information such as login credentials and payment details, but also improves your website's credibility and search engine ranking. Modern browsers mark non-HTTPS websites as Not Secure — don't let that damage your reputation."
      ],
      "benefits": [
        "✔ 256-bit Strong Encryption",
        "✔ HTTPS Secure Connection",
        "✔ Increased Customer Trust",
        "✔ Google SEO Ranking Boost",
        "✔ Data Protection & Compliance",
        "✔ Secure Online Payments"
      ],
      "types": "We provide Domain Validation (DV), Organization Validation (OV), and Extended Validation (EV) SSL certificates suitable for personal websites, business platforms, and eCommerce portals.",
      "closing": "Protect your brand, secure your data, and build customer confidence with GreenBD Hosting SSL solutions.",
      "image": "img/ssl.png"
    },
    "zimbra": {
      "title": "ZIMBRA Email Collaboration",
      "paragraphs": [
        "Zimbra offers businesses a secure, data-sovereign email and collaboration platform built on open standards. A low-risk alternative, it provides integrated email, calendar, contacts, tasks, and document sharing.",
        "Businesses gain complete control over their data with flexible on-premises or cloud deployment, ensuring compliance and avoiding vendor lock-in. Empowering productivity with advanced security, Zimbra delivers a trusted and transparent communication solution designed for your needs."
      ],
      "image": "img/zimbra.png"
    },
    "domain": {
      "title": "Domain Service",
      "paragraphs": [
        "GreenBD Hosting is a technology-driven hosting provider committed to delivering secure, scalable, and eco-friendly infrastructure solutions.",
        "In the Internet, a domain name identifies a realm of administrative autonomy, authority or control. Domain names are often used to identify services provided through the Internet, such as websites, email services and more.",
        "Specific to the internet, the term domain can refer to how the internet is structured, and domain also refers to how an organization's network resources are organized. GreenBD Hosting has made an easy platform for customers to register and manage their domains."
      ],
      "image": "img/domain.png"
    },
    "cloud": {
      "title": "Cloud VPS",
      "intro": "Powerful, scalable and reliable cloud infrastructure.",
      "paragraphs": [
        "GreenBD Hosting provides high-performance Cloud VPS solutions designed for businesses, developers, and growing enterprises. Our cloud infrastructure is powered by enterprise-grade hardware, SSD storage, and optimized virtualization to deliver speed, reliability, and security.",
        "Whether you need hosting for a high-traffic website, web application, ERP system, or custom business software, our Cloud VPS platform ensures maximum uptime, scalability, and full administrative control."
      ],
      "features": [
        "✔ High-Speed NVMe Storage",
        "✔ Dedicated CPU & RAM Resources",
        "✔ Full Root Access",
        "✔ Instant Resource Scalability",
        "✔ Advanced Firewall Protection",
        "✔ 24/7 Technical Support",
        "✔ 99.9% Network Uptime Guarantee"
      ],
      "why": "Our infrastructure is built for performance and security. With isolated virtual environments, your server operates independently without interference from other users. We provide full customization, allowing you to install any operating system, control panel, or application that fits your business needs.",
      "closing": "From startups to enterprise deployments, GreenBD Hosting ensures reliable and scalable cloud solutions tailored for long-term growth.",
      "image": "img/vps.png"
    },
    "onpremise": {
      "title": "On-Premise Mail Server",
      "paragraphs": [
        "GreenBD Hosting provides enterprise-grade On-Premise Mail Server solutions designed for organizations that require full control over their email infrastructure, security policies, and data governance.",
        "An on-premise setup means hosting and managing your software, data, and systems on physical servers owned or located within your company. This approach provides full control over configurations, updates, and security but requires significant investment in hardware and technical resources."
      ],
      "ownership": "Complete Infrastructure Ownership",
      "ownershipText": "Our on-premise mail server solution is deployed within your organization's physical or virtual infrastructure. This ensures that all business communications, user data, and compliance requirements remain under your direct control.",
      "idealFor": "Ideal For",
      "idealList": [
        "Government organizations",
        "Financial institutions",
        "Healthcare providers",
        "Educational institutions",
        "Enterprises requiring strict data compliance"
      ],
      "support": "Professional Support & Maintenance",
      "supportText": "GreenBD Hosting offers ongoing maintenance, monitoring, patch management, and technical support to ensure operational stability and continuous uptime.",
      "image": "img/mail.png"
    }
  }
};

  /** @returns {Object} The full raw data object. */
  get all() { return this._data; }

  /** @returns {Object} Global site data (header, hero, footer). */
  get global() { return this._data?.global ?? {}; }

  /**
   * Get page-specific data by page key.
   * @param {string} pageKey  e.g. "index", "about-us", "ssl"
   * @returns {Object}
   */
  getPage(pageKey) {
    return this._data?.pages?.[pageKey] ?? this._data?.pages?.['index'] ?? {};
  }
}
