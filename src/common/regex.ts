const regexPatterns = {
    alphaRegex: /^[a-zA-Z]+$/,
    alphaNumericRegex: /^[a-zA-Z0-9]+$/,
    alphaUnicodeRegex: /^[\p{L}]+$/u,
    alphaUnicodeNumericRegex: /^[\p{L}\p{N}]+$/u,
    numericRegex: /^[-+]?[0-9]+(?:\.[0-9]+)?$/,
    numberRegex: /^[0-9]+$/,
    hexadecimalRegex: /^(0[xX])?[0-9a-fA-F]+$/,
    hexColorRegex: /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/,
    rgbRegex: /^rgb\(\s*(?:(?:0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5])\s*,\s*(?:0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5])\s*,\s*(?:0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5])|(?:0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5])%\s*,\s*(?:0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5])%\s*,\s*(?:0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5])%)\s*\)$/,
    rgbaRegex: /^rgba\(\s*(?:(?:0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5])\s*,\s*(?:0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5])\s*,\s*(?:0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5])|(?:0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5])%\s*,\s*(?:0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5])%\s*,\s*(?:0|[1-9]\d?|1\d\d?|2[0-4]\d|25[0-5])%)\s*,\s*(?:(?:0\.[1-9]*)|[01])\s*\)$/,
    hslRegex: /^hsl\(\s*(?:0|[1-9]\d?|[12]\d\d|3[0-5]\d|360)\s*,\s*(?:(?:0|[1-9]\d?|100)%)\s*,\s*(?:(?:0|[1-9]\d?|100)%)\s*\)$/,
    hslaRegex: /^hsla\(\s*(?:0|[1-9]\d?|[12]\d\d|3[0-5]\d|360)\s*,\s*(?:(?:0|[1-9]\d?|100)%)\s*,\s*(?:(?:0|[1-9]\d?|100)%)\s*,\s*(?:(?:0\.[1-9]*)|[01])\s*\)$/,
    emailRegex: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    e164Regex: /^\+[1-9]?[0-9]{7,14}$/,
    base32Regex: /^(?:[A-Z2-7]{8})*(?:[A-Z2-7]{2}={6}|[A-Z2-7]{4}={4}|[A-Z2-7]{5}={3}|[A-Z2-7]{7}=|[A-Z2-7]{8})$/,
    base64Regex: /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=|[A-Za-z0-9+\/]{4})$/,
    base64URLRegex: /^(?:[A-Za-z0-9-_]{4})*(?:[A-Za-z0-9-_]{2}==|[A-Za-z0-9-_]{3}=|[A-Za-z0-9-_]{4})$/,
    base64RawURLRegex: /^(?:[A-Za-z0-9-_]{4})*(?:[A-Za-z0-9-_]{2,4})$/,
    iSBN10Regex: /^(?:[0-9]{9}X|[0-9]{10})$/,
    iSBN13Regex: /^(?:(?:97(?:8|9))[0-9]{10})$/,
    iSSNRegex: /^(?:[0-9]{4}-[0-9]{3}[0-9X])$/,
    uUID3Regex: /^[0-9a-f]{8}-[0-9a-f]{4}-3[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    uUID4Regex: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    uUID5Regex: /^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    uUIDRegex: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    uLIDRegex: /^[A-HJKMNP-TV-Z0-9]{26}$/i,
    md4Regex: /^[0-9a-f]{32}$/,
    md5Regex: /^[0-9a-f]{32}$/,
    sha256Regex: /^[0-9a-f]{64}$/,
    sha384Regex: /^[0-9a-f]{96}$/,
    sha512Regex: /^[0-9a-f]{128}$/,
    ripemd128Regex: /^[0-9a-f]{32}$/,
    ripemd160Regex: /^[0-9a-f]{40}$/,
    tiger128Regex: /^[0-9a-f]{32}$/,
    tiger160Regex: /^[0-9a-f]{40}$/,
    tiger192Regex: /^[0-9a-f]{48}$/,
    asciiRegex: /^[\x00-\x7F]*$/,
    printableASCIIRegex: /^[\x20-\x7E]*$/,
    multibyteRegex: /[^\x00-\x7F]/,
    dataURIRegex: /^data:((?:\w+\/(?:([^;]|;[^;]).)+)?)$/,
    latitudeRegex: /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/,
    longitudeRegex: /^[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/,
    ssnRegex: /^[0-9]{3}[ -]?(0[1-9]|[1-9][0-9])[ -]?([1-9][0-9]{3})$/,
    ipv4Regex: /^(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])){3}$/,
    ipv6Regex: /^(([0-9a-fA-F]{1,4}:){7}([0-9a-fA-F]{1,4}|:))$/,
    macRegex: /^([0-9a-fA-F]{2}[:-]){5}[0-9a-fA-F]{2}$/,
    CIDRRegex: /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/,
    CIDRv6Regex: /^[0-9a-fA-F]{0,4}:((:[0-9a-fA-F]{0,4}){0,5})?::?\/\d{1,3}$/,
    panRegex: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
} as const;

export type RegexPatterns = typeof regexPatterns;

export type KeyRegexPatterns = keyof Omit<RegexPatterns, 'emailRegex'> extends `${infer Prefix}Regex` ? Prefix : never

export type RegexSchema = {
    [K in KeyRegexPatterns]?: boolean;
};

export default regexPatterns;
