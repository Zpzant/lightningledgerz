/* qb-report-renderer.js — build a self-contained, branded Lightning Ledgerz
 * financial report (HTML string) from normalized QuickBooks data.
 * Input objects come from QBOTransform (qbo-transform.js). Pure function,
 * no DOM dependencies, so it can be unit-tested with fixtures.
 *
 * window.QBReportRenderer.build({
 *   companyName, periodLabel,
 *   pl,          // normalized ProfitAndLoss for the period (monthly columns)
 *   plTrailing,  // normalized ProfitAndLoss trailing-12 (monthly columns) — optional
 *   bs,          // normalized BalanceSheet — optional
 *   cf,          // normalized CashFlow — optional
 *   custIncome,  // normalized CustomerIncome — optional
 * }) -> html string
 */
(function () {
  "use strict";

  var NAVY = "#0B1A33", GOLD = "#C9A227", GOLD_HI = "#E9CF87", INK = "#16233A",
      MUTED = "#5A6B85", PAPER = "#F7F3EA", RED = "#e23b2e";
  var LOGO_URL = "https://lightningledgerz.com/Thelogo.png";

  function fmt(n) {
    if (n === null || n === undefined || isNaN(n)) return "–";
    var abs = Math.abs(n);
    var s = abs >= 1e6 ? (abs / 1e6).toFixed(2) + "M"
          : abs >= 1e3 ? (abs / 1e3).toFixed(1) + "K"
          : abs.toFixed(0);
    return (n < 0 ? "−$" : "$") + s;
  }
  function pct(n) {
    if (n === null || n === undefined || isNaN(n) || !isFinite(n)) return "–";
    return (n * 100).toFixed(1) + "%";
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------- SVG chart builders (inline, self-contained) ---------- */

  function barChartMonthly(labels, values, width, height, color) {
    width = width || 1040; height = height || 260;
    var padB = 34, padT = 26, padL = 8, padR = 8;
    var innerH = height - padB - padT;
    var maxV = Math.max.apply(null, values.map(Math.abs).concat([1]));
    var n = values.length || 1;
    var band = (width - padL - padR) / n;
    var bw = Math.min(band * 0.62, 74);
    var bars = values.map(function (v, i) {
      var h = Math.max(2, Math.abs(v) / maxV * innerH);
      var x = padL + band * i + (band - bw) / 2;
      var y = padT + innerH - h;
      return '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + bw.toFixed(1) +
        '" height="' + h.toFixed(1) + '" rx="3" fill="' + color + '"/>' +
        '<text x="' + (x + bw / 2).toFixed(1) + '" y="' + (y - 7).toFixed(1) +
        '" font-size="12" font-weight="700" fill="' + INK + '" text-anchor="middle">' + fmt(v) + '</text>' +
        '<text x="' + (x + bw / 2).toFixed(1) + '" y="' + (height - 12) +
        '" font-size="11" fill="' + MUTED + '" text-anchor="middle">' + esc(labels[i] || "") + '</text>';
    }).join("");
    return '<svg viewBox="0 0 ' + width + " " + height + '" style="width:100%;display:block">' +
      '<line x1="' + padL + '" y1="' + (padT + innerH) + '" x2="' + (width - padR) + '" y2="' + (padT + innerH) +
      '" stroke="' + GOLD + '" stroke-width="1.6"/>' + bars + "</svg>";
  }

  function hBarList(items, width, color) {
    width = width || 500;
    var rowH = 30, gap = 9, labelW = 190, valW = 74;
    var maxV = Math.max.apply(null, items.map(function (x) { return Math.abs(x.value); }).concat([1]));
    var height = items.length * (rowH + gap);
    var rows = items.map(function (it, i) {
      var y = i * (rowH + gap);
      var w = Math.max(3, Math.abs(it.value) / maxV * (width - labelW - valW - 16));
      return '<text x="' + (labelW - 8) + '" y="' + (y + rowH / 2 + 4) + '" font-size="12.5" fill="' + INK +
        '" text-anchor="end">' + esc(String(it.name).slice(0, 26)) + '</text>' +
        '<rect x="' + labelW + '" y="' + (y + 4) + '" width="' + w.toFixed(1) + '" height="' + (rowH - 8) +
        '" rx="3" fill="' + color + '"/>' +
        '<text x="' + (labelW + w + 8).toFixed(1) + '" y="' + (y + rowH / 2 + 4) +
        '" font-size="12.5" font-weight="700" fill="' + INK + '">' + fmt(it.value) + '</text>';
    }).join("");
    return '<svg viewBox="0 0 ' + width + " " + height + '" style="width:100%;display:block">' + rows + "</svg>";
  }

  /* ---------- data pulls out of normalized structures ---------- */

  function expenseLines(pl, topN) {
    // lines inside the "Expenses" section
    var rows = pl.rows, out = [], inExp = false, depth = 0;
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      if (r.kind === "sectionHeader" && /^expenses$/i.test(r.label)) { inExp = true; depth = r.depth; continue; }
      if (inExp && r.kind === "sectionTotal" && r.depth === depth) break;
      if (inExp && r.kind === "line") {
        var v = r.values[r.values.length - 1] || 0;
        if (v !== 0) out.push({ name: r.label, value: v });
      }
    }
    out.sort(function (a, b) { return b.value - a.value; });
    return out.slice(0, topN || 8);
  }

  function cfSummary(cf) {
    if (!cf) return null;
    var find = function (re) {
      var r = cf.rows.filter(function (x) { return re.test(x.label); });
      return r.length ? (r[r.length - 1].values.slice(-1)[0] || 0) : null;
    };
    return {
      operating: find(/operating activities/i),
      investing: find(/investing activities/i),
      financing: find(/financing activities/i),
      netChange: find(/net cash increase|net cash decrease|net change in cash/i),
    };
  }

  function bsSummary(bs) {
    if (!bs) return null;
    var find = function (re) {
      var r = bs.rows.filter(function (x) { return x.kind === "sectionTotal" && re.test(x.label); });
      return r.length ? (r[r.length - 1].values.slice(-1)[0] || 0) : null;
    };
    return {
      assets: find(/total assets/i),
      liabilities: find(/total liabilities(?!\s+and)/i),
      equity: find(/total equity/i),
      cash: (function () {
        var r = bs.rows.filter(function (x) { return /total bank accounts/i.test(x.label); });
        return r.length ? (r[0].values.slice(-1)[0] || 0) : null;
      })(),
    };
  }

  /* ---------- auto commentary ---------- */
  function commentary(sum, months, custItems, expItems) {
    var out = [];
    if (months && months.values.length >= 2) {
      var last = months.values[months.values.length - 1];
      var prev = months.values[months.values.length - 2];
      if (prev) {
        var d = (last - prev) / Math.abs(prev);
        out.push("<b>Revenue " + (d >= 0 ? "up " : "down ") + pct(Math.abs(d)) + " month-over-month</b> (" +
          fmt(prev) + " → " + fmt(last) + " in " + esc(months.labels.slice(-1)[0] || "the latest month") + ").");
      }
    }
    if (sum && sum.income) {
      out.push("<b>Net margin " + pct(sum.netIncome / sum.income) + "</b> on " + fmt(sum.income) +
        " of revenue for the period; gross margin " + pct(sum.grossProfit / sum.income) + ".");
    }
    if (custItems && custItems.length) {
      var totalCust = custItems.reduce(function (a, x) { return a + x.value; }, 0);
      if (totalCust > 0) {
        var top = custItems[0];
        out.push("<b>" + esc(top.name) + " is your largest customer</b> at " +
          pct(top.value / totalCust) + " of tracked revenue. Worth watching for concentration risk.");
      }
    }
    if (expItems && expItems.length && sum && sum.opex) {
      var e = expItems[0];
      out.push("<b>" + esc(e.name) + "</b> is the largest expense line at " + pct(e.value / sum.opex) +
        " of operating expenses (" + fmt(e.value) + ").");
    }
    return out;
  }

  /* ---------- main ---------- */
  /* Budget vs Actual section — the Fathom-style variance view. */
  function bvaSection(bva, periodLabel) {
    var rows = window.QBOTransform.bvaRows(bva);
    if (!rows || !rows.length) return "";
    var incomeLike = /income|revenue|profit/i;
    var keep = rows.filter(function (r) {
      return r.kind === "sectionTotal" || /^(gross profit|net operating income|net income)$/i.test(r.label);
    }).slice(0, 10);
    if (!keep.length) return "";
    var tr = keep.map(function (r) {
      var good = incomeLike.test(r.label) ? r.variance >= 0 : r.variance <= 0;
      var col = good ? "#1F7A4D" : "#A33C3C";
      var arrow = r.variance >= 0 ? "▲" : "▼";
      return "<tr><td" + (r.kind === "sectionTotal" ? " style='font-weight:700'" : "") + ">" + esc(r.label) + "</td>" +
        "<td class='r'>" + fmt(r.actual) + "</td><td class='r'>" + fmt(r.budget) + "</td>" +
        "<td class='r' style='color:" + col + ";font-weight:700'>" + arrow + " " + fmt(Math.abs(r.variance)) + "</td>" +
        "<td class='r' style='color:" + col + "'>" + (r.pct !== null ? pct(r.pct) : "–") + "</td></tr>";
    }).join("");
    return "<div class='sec'><h2>Budget vs. Actual</h2><div class='sub'>" + esc(periodLabel) +
      " · from your QuickBooks budget</div>" +
      "<table class='bva'><tr><th>Line</th><th class='r'>Actual</th><th class='r'>Budget</th>" +
      "<th class='r'>Variance</th><th class='r'>% of Budget</th></tr>" + tr + "</table></div>";
  }

  function build(opts) {
    var pl = opts.pl, sum = window.QBOTransform.plSummary(pl);
    var months = opts.plTrailing
      ? window.QBOTransform.monthlySeries(opts.plTrailing, /total income/i)
      : window.QBOTransform.monthlySeries(pl, /total income/i);
    var cust = opts.custIncome ? window.QBOTransform.revenueByCustomer(opts.custIncome, 7) : null;
    var exps = expenseLines(pl, 8);
    var bss = bsSummary(opts.bs);
    var cfs = cfSummary(opts.cf);
    var notes = commentary(sum, months, cust, exps);
    var gm = sum.income ? sum.grossProfit / sum.income : null;
    var nm = sum.income ? sum.netIncome / sum.income : null;
    var today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

    var kpi = function (label, value, sub) {
      return '<div class="kpi"><div class="kl">' + label + '</div><div class="kv">' + value +
        '</div>' + (sub ? '<div class="ks">' + sub + "</div>" : "") + "</div>";
    };

    var html = "<!DOCTYPE html><html><head><meta charset='utf-8'>" +
      "<title>" + esc(opts.companyName) + " — " + esc(opts.periodLabel) + " Financial Pack</title>" +
      "<style>" +
      "*{margin:0;padding:0;box-sizing:border-box}" +
      "body{font-family:'Segoe UI',Calibri,Arial,sans-serif;background:#EDEFF3;color:" + INK + "}" +
      ".page{max-width:1100px;margin:0 auto;background:#fff;box-shadow:0 10px 40px rgba(10,20,40,.12)}" +
      ".hdr{background:linear-gradient(155deg,#10254a 0%," + NAVY + " 55%,#081226 100%);color:#F2EDDF;padding:38px 48px;display:flex;align-items:center;gap:30px}" +
      ".hdr img{width:150px;display:block}" +
      ".hdr .k{font-size:11px;letter-spacing:.28em;color:" + GOLD_HI + ";text-transform:uppercase;font-weight:700}" +
      ".hdr h1{font-family:Georgia,serif;font-size:32px;margin:6px 0 4px}" +
      ".hdr .p{font-style:italic;color:#AEBBD0;font-size:14.5px}" +
      ".sec{padding:34px 48px;border-top:1px solid #E5E2D8}" +
      ".sec h2{font-family:Georgia,serif;font-size:21px;margin-bottom:4px}" +
      ".sec .sub{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:" + MUTED + ";margin-bottom:18px}" +
      ".kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}" +
      ".kpi{border:1px solid rgba(201,162,39,.45);border-top:3px solid " + GOLD + ";padding:14px 18px;background:" + PAPER + "}" +
      ".kl{font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;color:" + MUTED + "}" +
      ".kv{font-family:Georgia,serif;font-size:28px;font-weight:700;margin-top:6px}" +
      ".ks{font-size:11.5px;color:" + MUTED + ";margin-top:3px}" +
      ".two{display:grid;grid-template-columns:1fr 1fr;gap:40px}" +
      "table.bva{width:100%;border-collapse:collapse;font-size:13.5px}" +
      "table.bva th{font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;text-align:left;color:#8A6D12;border-bottom:1.6px solid " + GOLD + ";padding:8px 10px;background:rgba(201,162,39,.07)}" +
      "table.bva td{padding:9px 10px;border-bottom:1px solid #EDEFF3}" +
      "table.bva .r{text-align:right;font-variant-numeric:tabular-nums}" +
      ".note{border:1px solid rgba(138,109,18,.35);background:rgba(168,132,27,.07);padding:14px 18px;font-size:13px;line-height:1.65;margin-top:10px}" +
      ".note ul{margin-left:18px}.note li{margin-bottom:7px}" +
      ".ftr{background:" + NAVY + ";color:#8FA1BC;font-size:10px;line-height:1.6;padding:18px 48px;letter-spacing:.04em}" +
      ".ftr b{color:" + GOLD_HI + ";letter-spacing:.2em}" +
      "@media print{body{background:#fff}.page{box-shadow:none;max-width:none}.sec{page-break-inside:avoid}}" +
      "</style></head><body><div class='page'>" +

      "<div class='hdr'><img src='" + LOGO_URL + "' alt='Lightning Ledgerz'>" +
      "<div><div class='k'>Monthly Financial Pack</div>" +
      "<h1>" + esc(opts.companyName) + "</h1>" +
      "<div class='p'>" + esc(opts.periodLabel) + " · Prepared by Lightning Ledgerz · " + today + "</div></div></div>" +

      "<div class='sec'><h2>Performance at a Glance</h2><div class='sub'>" + esc(opts.periodLabel) + " · accrual basis · live QuickBooks data</div>" +
      "<div class='kpis'>" +
      kpi("Revenue", fmt(sum.income), null) +
      kpi("Gross Profit", fmt(sum.grossProfit), gm !== null ? pct(gm) + " margin" : null) +
      kpi("Operating Expenses", fmt(sum.opex), null) +
      kpi("Net Income", fmt(sum.netIncome), nm !== null ? pct(nm) + " margin" : null) +
      "</div>" +
      (notes.length ? "<div class='note'><ul><li>" + notes.join("</li><li>") + "</li></ul></div>" : "") +
      "</div>";

    if (months && months.values.length > 1) {
      html += "<div class='sec'><h2>Revenue Trend</h2><div class='sub'>total income by month</div>" +
        barChartMonthly(months.labels, months.values, 1040, 260, GOLD) + "</div>";
    }

    var twoCols = [];
    if (exps.length) {
      twoCols.push("<div><h2>Where the Money Goes</h2><div class='sub'>largest expense lines · " + esc(opts.periodLabel) +
        "</div>" + hBarList(exps, 500, "#35619E") + "</div>");
    }
    if (cust && cust.length) {
      twoCols.push("<div><h2>Revenue by Customer</h2><div class='sub'>top customers · " + esc(opts.periodLabel) +
        "</div>" + hBarList(cust, 500, GOLD) + "</div>");
    }
    if (twoCols.length) {
      html += "<div class='sec'><div class='two'>" + twoCols.join("") + "</div></div>";
    }

    if (opts.bva) html += bvaSection(opts.bva, opts.periodLabel);

    if (bss || cfs) {
      html += "<div class='sec'><div class='two'>";
      if (bss) {
        html += "<div><h2>Balance Sheet Snapshot</h2><div class='sub'>as of period end</div><div class='kpis' style='grid-template-columns:1fr 1fr'>" +
          kpi("Total Assets", fmt(bss.assets), null) +
          kpi("Total Liabilities", fmt(bss.liabilities), null) +
          kpi("Equity", fmt(bss.equity), null) +
          kpi("Cash in Bank", fmt(bss.cash), null) + "</div></div>";
      }
      if (cfs) {
        html += "<div><h2>Cash Flow</h2><div class='sub'>" + esc(opts.periodLabel) + "</div><div class='kpis' style='grid-template-columns:1fr 1fr'>" +
          kpi("Operating", fmt(cfs.operating), null) +
          kpi("Investing", fmt(cfs.investing), null) +
          kpi("Financing", fmt(cfs.financing), null) +
          kpi("Net Cash Change", fmt(cfs.netChange), null) + "</div></div>";
      }
      html += "</div></div>";
    }

    html += "<div class='ftr'><b>LIGHTNING LEDGERZ · CONFIDENTIAL</b><br>" +
      "Financial forecasts and analyses provided by Lightning Ledgerz, LLC are based on current information and assumptions, which may evolve. " +
      "Lightning Ledgerz, LLC does not guarantee the accuracy or completeness of projections and shall not be held liable for actions taken based on this information. " +
      "zprizant@lightningledgerz.com · (702) 550-2513 · LightningLedgerz.com</div>" +
      "</div></body></html>";
    return html;
  }

  window.QBReportRenderer = { build: build };
})();
