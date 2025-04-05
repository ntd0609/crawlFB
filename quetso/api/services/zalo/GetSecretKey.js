const CryptoJS = require("crypto-js");
const request = require('request-promise');

const getLoginInfo = async (cookie, data_send) => {
    const { params, signkey, zcid, zcid_ext } = data_send

    const options = {
        method: 'get',
        url: `https://wpa.chat.zalo.me/api/login/getLoginInfo?zcid=${encodeURIComponent(zcid)}&zcid_ext=${encodeURIComponent(zcid_ext)}&enc_ver=v2&params=${encodeURIComponent(params)}&type=30&client_version=493&signkey=${encodeURIComponent(signkey)}&nretry=0`,
        headers: {
            "accept": "application/json, text/plain, */*",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/x-www-form-urlencoded",
            "sec-ch-ua": "\"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"108\", \"Microsoft Edge\";v=\"108\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "cookie": cookie,
            "Referer": "https://chat.zalo.me/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        }
    };
    let responseText = await request(options);
    return JSON.parse(responseText);
};



module.exports = async (cookie, imei) => {
    const computer_name = 'Web'
    const language = 'vi'
    const ts = (new Date()).getTime()
    const type = '30'
    const enc_ver = 'v2'
    let zcid = null
    let zcid_ext = null
    let encryptKey = null

    function encodeAES(e, t, s, a, n) {
        if (void 0 === n && (n = 0),
            !t)
            return null;
        try {
            {
                const n = "hex" == s ? CryptoJS.enc.Hex : CryptoJS.enc.Base64
                , i = CryptoJS.enc.Utf8.parse(e)
                , o = {
                    words: [0, 0, 0, 0],
                    sigBytes: 16
                }
                , r = CryptoJS.AES.encrypt(t, i, {
                    iv: o,
                    mode: CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.Pkcs7
                }).ciphertext.toString(n);
                return a ? r.toUpperCase() : r
            }
        } catch (o) {
            return null
        }
    }

    function decodeAES(e, t, s) {
        try {
            t = decodeURIComponent(t);
            {
                const a = CryptoJS.enc.Utf8.parse(e);
                return s = s ? CryptoJS.enc.Hex.parse(s) : {
                    words: [0, 0, 0, 0],
                    sigBytes: 16
                },
                CryptoJS.AES.decrypt({
                    ciphertext: CryptoJS.enc.Base64.parse(t),
                    salt: ""
                }, a, {
                    iv: s,
                    mode: CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.Pkcs7
                }).toString(CryptoJS.enc.Utf8)
            }
        } catch (n) {
            console.log(n);
            return null;
        }
    }

    function randomString(e, t) {
        const s = e || 6
        , a = t && t > e ? t : 12;
        let n = Math.floor(Math.random() * (a - s + 1)) + s;
        if (n > 12) {
            let e = "";
            for (; n > 0;)
                e += Math.random().toString(16).substr(2, n > 12 ? 12 : n),
            n -= 12;
            return e
        }
        return Math.random().toString(16).substr(2, n)
    }

    function processStr(e) {
        if (!e || "string" != typeof e)
            return {
                even: null,
                odd: null
            };
            const [t, s] = [...e].reduce(((e, t, s) => (e[s % 2].push(t),
                e)), [[], []]);
            return {
                even: t,
                odd: s
            }
        }

        function createEncryptKey(e) {
            try {
                let s = null;
                s = CryptoJS.MD5(zcid_ext).toString().toUpperCase();
                const a = ((e, s) => {
                    const { even: a } = processStr(e)
                    , { even: n, odd: i } = processStr(s);
                    if (!a || !n || !i)
                        return !1;
                    const o = a.slice(0, 8).join("") + n.slice(0, 12).join("") + i.reverse().slice(0, 12).join("");
                    encryptKey = o;
                    return null;
                }
                )(s, zcid);
            } catch (s) {
                return null
            }
            return !0
        }

        function createZcid(type, imei, ts) {
            const a = `${type},${imei},${ts}`
            zcid = encodeAES("3FC4F0D2AB50057BCE0D90D9187A22B1", a, "hex", !0);
        }

        function getSignKey(e = 'getlogininfo', t) {
            let s = [];
            for (let n in t)
                t.hasOwnProperty(n) && s.push(n);
            s.sort();
            let a = "zsecure" + e;
            for (let n = 0; n < s.length; n++)
                a += t[s[n]];
            return CryptoJS.MD5(a).toString()
        }

        createZcid(type, imei, ts)
        zcid_ext = randomString()
        createEncryptKey()

        let t = JSON.stringify({ imei, computer_name, language, ts })
        let encrypted_data = encodeAES(encryptKey, t, "base64", !1)
        let encrypted_params = {
            zcid,
            zcid_ext,
            enc_ver
        }

        let data_send = encrypted_params
        data_send.params = encrypted_data
        data_send.type = type
        data_send.client_version = '493'
        data_send.signkey = getSignKey('getlogininfo', data_send)
        let res = await getLoginInfo(cookie, data_send);
        let x = decodeAES(encryptKey, res.data);
        let {data:{zpw_enk}} = JSON.parse(x);
       return zpw_enk;
    };