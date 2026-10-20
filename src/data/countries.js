// ISO country codes. Names are created in the visitor's browser with Intl.DisplayNames.
const CODES =
  "AF AX AL DZ AS AD AO AI AG AR AM AW AU AT AZ BS BH BD BB BY BE BZ BJ BM BT BO BQ BA BW BR BN BG BF BI CV KH CM CA KY CF TD CL CN CO KM CG CD CK CR CI HR CU CW CY CZ DK DJ DM DO EC EG SV GQ ER EE SZ ET FK FO FJ FI FR GF PF GA GM GE DE GH GI GR GL GD GP GU GT GG GN GW GY HT VA HN HK HU IS IN ID IR IQ IE IM IL IT JM JP JE JO KZ KE KI KP KR KW KG LA LV LB LS LR LY LI LT LU MO MG MW MY MV ML MT MH MQ MR MU YT MX FM MD MC MN ME MS MA MZ MM NA NR NP NL NC NZ NI NE NG NU NF MK MP NO OM PK PW PS PA PG PY PE PH PN PL PT PR QA RE RO RU RW BL SH KN LC MF PM VC WS SM ST SA SN RS SC SL SG SX SK SI SB SO ZA SS ES LK SD SR SJ SE CH SY TW TJ TZ TH TL TG TK TO TT TN TR TM TC TV UG UA AE GB US UY UZ VU VE VN VG VI WF EH YE ZM ZW".split(
    " "
  );

export function getCountries() {
  let names;
  try {
    names = new Intl.DisplayNames(["en"], { type: "region" });
  } catch {
    names = null;
  }
  return CODES.map((code) => ({ code, name: (names && names.of(code)) || code })).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}

// Country code -> currency code (ISO 4217). Used by the contact form budget field.
const EUR = "AT BE CY DE EE ES FI FR GR HR IE IT LT LU LV MT NL PT SI SK AD MC SM VA ME XK AX GF GP MQ RE YT BL MF PM TF".split(" ");
const CURRENCY_BY_COUNTRY = {
  AF: "AFN", AL: "ALL", DZ: "DZD", AO: "AOA", AR: "ARS", AM: "AMD", AW: "AWG", AU: "AUD", AZ: "AZN",
  BS: "BSD", BH: "BHD", BD: "BDT", BB: "BBD", BY: "BYN", BZ: "BZD", BM: "BMD", BT: "BTN", BO: "BOB",
  BA: "BAM", BW: "BWP", BR: "BRL", BN: "BND", BG: "BGN", BI: "BIF", KH: "KHR", CM: "XAF", CA: "CAD",
  CV: "CVE", KY: "KYD", CF: "XAF", TD: "XAF", CL: "CLP", CN: "CNY", CO: "COP", KM: "KMF", CG: "XAF",
  CD: "CDF", CR: "CRC", CI: "XOF", CU: "CUP", CZ: "CZK", DK: "DKK", DJ: "DJF", DO: "DOP", EC: "USD",
  EG: "EGP", SV: "USD", GQ: "XAF", ER: "ERN", SZ: "SZL", ET: "ETB", FJ: "FJD", GA: "XAF", GM: "GMD",
  GE: "GEL", GH: "GHS", GI: "GIP", GL: "DKK", FO: "DKK", GT: "GTQ", GN: "GNF", GW: "XOF", GY: "GYD",
  HT: "HTG", HN: "HNL", HK: "HKD", HU: "HUF", IS: "ISK", IN: "INR", ID: "IDR", IR: "IRR", IQ: "IQD",
  IL: "ILS", JM: "JMD", JP: "JPY", JO: "JOD", KZ: "KZT", KE: "KES", KP: "KPW", KR: "KRW", KW: "KWD",
  KG: "KGS", LA: "LAK", LB: "LBP", LS: "LSL", LR: "LRD", LY: "LYD", CH: "CHF", LI: "CHF", MO: "MOP",
  MG: "MGA", MW: "MWK", MY: "MYR", MV: "MVR", ML: "XOF", MR: "MRU", MU: "MUR", MX: "MXN", MD: "MDL",
  MN: "MNT", MA: "MAD", MZ: "MZN", MM: "MMK", NA: "NAD", NP: "NPR", NZ: "NZD", NI: "NIO", NE: "XOF",
  NG: "NGN", MK: "MKD", NO: "NOK", OM: "OMR", PK: "PKR", PA: "PAB", PG: "PGK", PY: "PYG", PE: "PEN",
  PH: "PHP", PL: "PLN", PR: "USD", QA: "QAR", RO: "RON", RU: "RUB", RW: "RWF", SA: "SAR", SN: "XOF",
  RS: "RSD", SC: "SCR", SL: "SLE", SG: "SGD", SO: "SOS", ZA: "ZAR", SS: "SSP", LK: "LKR", SD: "SDG",
  SR: "SRD", SE: "SEK", SY: "SYP", TW: "TWD", TJ: "TJS", TZ: "TZS", TH: "THB", TG: "XOF", TT: "TTD",
  TN: "TND", TR: "TRY", TM: "TMT", UG: "UGX", UA: "UAH", AE: "AED", GB: "GBP", US: "USD", UY: "UYU",
  UZ: "UZS", VE: "VES", VN: "VND", YE: "YER", ZM: "ZMW", ZW: "USD", BJ: "XOF", BF: "XOF", TO: "TOP",
  WS: "WST", VU: "VUV", SB: "SBD", GU: "USD", AS: "USD", VI: "USD", VG: "USD", EH: "MAD", PS: "ILS",
  BQ: "USD", CW: "ANG", SX: "ANG", NC: "XPF", PF: "XPF", WF: "XPF", SH: "SHP", FK: "FKP", GG: "GBP",
  JE: "GBP", IM: "GBP", ST: "STN", TL: "USD", AG: "XCD", AI: "XCD", DM: "XCD", GD: "XCD", KN: "XCD",
  LC: "XCD", MS: "XCD", VC: "XCD", TC: "USD", MP: "USD", FM: "USD", MH: "USD", PW: "USD", CK: "NZD",
  NU: "NZD", TK: "NZD", PN: "NZD", NF: "AUD", KI: "AUD", NR: "AUD", TV: "AUD", CX: "AUD", CC: "AUD",
  SJ: "NOK", BV: "NOK",
};
EUR.forEach((code) => {
  CURRENCY_BY_COUNTRY[code] = "EUR";
});

export function getCurrency(code) {
  const currency = CURRENCY_BY_COUNTRY[code] || "USD";
  let symbol = currency;
  try {
    const parts = new Intl.NumberFormat("en", { style: "currency", currency, currencyDisplay: "narrowSymbol" }).formatToParts(0);
    const found = parts.find((p) => p.type === "currency");
    if (found) symbol = found.value;
  } catch {
    /* keep the code */
  }
  return { code: currency, symbol };
}

// Flag picture for a country (small PNG, 2x for sharp screens)
export const flagSrc = (code) => `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
export const flagSrcSet = (code) => `https://flagcdn.com/w80/${code.toLowerCase()}.png 2x`;
