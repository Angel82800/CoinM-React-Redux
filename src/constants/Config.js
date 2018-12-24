let date = new Date();
let year = date.getFullYear();

const APPCONFIG = {
    brand: 'CoinMetro',
    user: 'Dunhao',
    year: year,
    productLink: 'git://github.com/CoinMetro/backoffice',
    AutoCloseMobileNav: true, // true, false. Automatically close sidenav on route change (Mobile only)
    color: {
        primary:    '#9f8bc9',
        secondary:  '#3fc6d6',
        success:    '#8BC34A',
        info:       '#66BB6A',
        infoAlt:    '#7E57C2',
        warning:    '#FFCA28',
        danger:     '#F44336',
        text:       '#5C6783',
        gray:       '#BCC1CD'
    },
    settings: {
        navCollapsed: false,                            // true, false
        navBehind: false,                               // true, false
        snapshotBrightness: 50,
    }
};

export default APPCONFIG;
