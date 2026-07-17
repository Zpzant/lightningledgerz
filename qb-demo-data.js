/* qb-demo-data.js — realistic fake QuickBooks company for practicing the
 * report workflow end-to-end without a real QBO connection.
 * Mirrors the exact JSON shapes the QBO v3 API returns, so the transformer
 * and renderer treat it identically to live data.
 * Used by admin-reports.html when the selected company is DEMO_REALM.
 */
(function () {
  "use strict";

  var DEMO_REALM = "demo-practice";
  var COMPANY = "Sunset Trail Hospitality Group (Demo)";

  function col(t) { return { ColTitle: t, ColType: "Money" }; }
  function money(vs) { return vs.map(function (v) { return { value: String(v) }; }); }
  function line(label, vals) { return { type: "Data", ColData: [{ value: label }].concat(money(vals)) }; }
  function section(label, children, totLabel, totVals) {
    return {
      type: "Section",
      Header: { ColData: [{ value: label }] },
      Rows: { Row: children },
      Summary: { ColData: [{ value: totLabel }].concat(money(totVals)) },
    };
  }

  var MONTHS = ["Jan 2026", "Feb 2026", "Mar 2026", "Apr 2026", "May 2026", "Jun 2026"];

  var PL = {
    Header: { ReportName: "ProfitAndLoss", StartPeriod: "2026-01-01", EndPeriod: "2026-06-30", Currency: "USD" },
    Columns: { Column: [col("")].concat(MONTHS.map(col)).concat([col("Total")]) },
    Rows: { Row: [
      section("Income", [
        line("Room Revenue",        [148200, 141800, 168400, 176900, 189300, 204600, 1029200]),
        line("Food & Beverage",     [ 52300,  49800,  58100,  61400,  66200,  71800,  359600]),
        line("Events & Catering",   [ 18400,  22100,  31800,  24600,  38200,  45100,  180200]),
      ], "Total Income",            [218900, 213700, 258300, 262900, 293700, 321500, 1569000]),
      section("Cost of Goods Sold", [
        line("F&B Cost of Sales",   [ 19800,  18900,  22400,  23100,  25600,  27400,  137200]),
        line("Event Supplies",      [  6200,   7400,  10900,   8300,  12800,  15200,   60800]),
      ], "Total Cost of Goods Sold",[ 26000,  26300,  33300,  31400,  38400,  42600,  198000]),
      line("Gross Profit",          [192900, 187400, 225000, 231500, 255300, 278900, 1371000]),
      section("Expenses", [
        line("Payroll & Benefits",  [ 82400,  81900,  88600,  90200,  95800, 101300,  540200]),
        line("Rent & Occupancy",    [ 24500,  24500,  24500,  26000,  26000,  26000,  151500]),
        line("Utilities",           [  8900,   8400,   8100,   8600,   9800,  11200,   55000]),
        line("Insurance",           [  6800,   6800,   6800,   7400,   7400,   7400,   42600]),
        line("Marketing & OTA Fees",[ 12600,  11800,  15400,  14900,  17200,  19600,   91500]),
        line("Repairs & Maintenance",[  4300,   6100,   3800,   5600,   4900,   7800,   32500]),
        line("Housekeeping Supplies",[  5100,   4900,   5700,   5900,   6400,   6900,   34900]),
        line("Software & Technology",[  2900,   2900,   3100,   3100,   3400,   3400,   18800]),
      ], "Total Expenses",          [147500, 147300, 156000, 161700, 170900, 183600,  967000]),
      line("Net Operating Income",  [ 45400,  40100,  69000,  69800,  84400,  95300,  404000]),
      line("Net Income",            [ 43900,  38700,  67200,  68100,  82600,  93400,  393900]),
    ] },
  };

  var BS = {
    Header: { ReportName: "BalanceSheet", StartPeriod: "2026-06-01", EndPeriod: "2026-06-30", Currency: "USD" },
    Columns: { Column: [col(""), col("Total")] },
    Rows: { Row: [
      section("ASSETS", [
        section("Current Assets", [
          section("Bank Accounts", [
            line("Operating Checking", [246800]),
            line("Payroll Account",    [ 58200]),
            line("Reserve Savings",    [125000]),
          ], "Total Bank Accounts",    [430000]),
          line("Accounts Receivable",  [ 84600]),
          line("Inventory",            [ 22800]),
        ], "Total Current Assets",     [537400]),
        line("Furniture & Equipment",  [318500]),
        line("Leasehold Improvements", [142000]),
      ], "Total Assets",               [997900]),
      section("LIABILITIES AND EQUITY", [
        section("Liabilities", [
          line("Accounts Payable",     [ 46300]),
          line("Credit Cards",         [ 12800]),
          line("Equipment Loan",       [ 98500]),
          line("Deferred Event Deposits",[ 61200]),
        ], "Total Liabilities",        [218800]),
        section("Equity", [
          line("Owner Investment",     [250000]),
          line("Retained Earnings",    [135200]),
          line("Net Income",           [393900]),
        ], "Total Equity",             [779100]),
      ], "Total Liabilities and Equity", [997900]),
    ] },
  };

  var CF = {
    Header: { ReportName: "CashFlow", StartPeriod: "2026-06-01", EndPeriod: "2026-06-30", Currency: "USD" },
    Columns: { Column: [col(""), col("Total")] },
    Rows: { Row: [
      section("Operating Activities", [
        line("Net Income", [93400]),
        line("Change in AR", [-9800]),
        line("Change in AP", [4200]),
        line("Event deposits received", [12600]),
      ], "Net cash provided by operating activities", [100400]),
      section("Investing Activities", [
        line("Kitchen equipment purchase", [-18500]),
      ], "Net cash provided by investing activities", [-18500]),
      section("Financing Activities", [
        line("Equipment loan repayment", [-4100]),
        line("Owner distribution", [-25000]),
      ], "Net cash provided by financing activities", [-29100]),
      line("Net cash increase for period", [52800]),
    ] },
  };

  var CI = {
    Header: { ReportName: "CustomerIncome", StartPeriod: "2026-06-01", EndPeriod: "2026-06-30", Currency: "USD" },
    Columns: { Column: [col(""), col("Total")] },
    Rows: { Row: [
      line("Desert Sky Tours (corporate block)", [48200]),
      line("Silver State Weddings",              [38600]),
      line("Vegas Valley Conference Co",         [29800]),
      line("Walk-in / Direct Bookings",          [152400]),
      line("OTA Channels (net)",                 [42100]),
      line("Redline Motorsports (event)",        [10400]),
    ] },
  };

  var COMPANY_INFO = { CompanyInfo: { CompanyName: COMPANY, LegalAddr: { City: "Las Vegas", CountrySubDivisionCode: "NV" } } };

  /** Same surface as the qb-api edge function, so the admin page can swap it in. */
  function call(payload) {
    var action = payload && payload.action;
    if (action === "company") return Promise.resolve(COMPANY_INFO);
    if (action === "report") {
      var name = payload.params && payload.params.name;
      if (name === "ProfitAndLoss") return Promise.resolve(PL);
      if (name === "BalanceSheet") return Promise.resolve(BS);
      if (name === "CashFlow") return Promise.resolve(CF);
      if (name === "CustomerIncome") return Promise.resolve(CI);
      return Promise.reject(new Error("demo: report not stocked: " + name));
    }
    return Promise.reject(new Error("demo: unsupported action " + action));
  }

  window.QBDemoData = {
    DEMO_REALM: DEMO_REALM,
    companyName: COMPANY,
    call: call,
    connectionRow: {
      realm_id: DEMO_REALM,
      owner_email: "practice mode — fake data",
      owner_name: "Demo",
      updated_at: new Date().toISOString(),
      refresh_expires_at: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString(),
    },
  };
})();
