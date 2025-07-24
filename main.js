import { Actor } from 'apify';
import { PlaywrightCrawler } from 'crawlee';

await Actor.init();

const startUrls = [
    {
        url: 'https://otstmartin.cevsolutions.fr/login.xhtml',
        userData: {
            username: 'infos@catamaranzephyr.com',
            password: 'MamaZephyr$2025',
            usernameSelector: "input[type='email']",
            passwordSelector: "input[type='password']",
            submitSelector: "button[type='submit']",
        },
    },
    { url: 'https://otstmartin.cevsolutions.fr/home.xhtml' },
    { url: 'https://otstmartin.cevsolutions.fr/customer/customer-search.xhtml' },
];

const crawler = new PlaywrightCrawler({
    proxyConfiguration: await Actor.createProxyConfiguration(),
    maxRequestsPerCrawl: 400,
    maxRequestRetries: 3,

    requestHandler: async ({ page, request, log }) => {
        log.info(`Processing ${request.url}`);

        if (request.url.includes('/login.xhtml')) {
            const { username, password, usernameSelector, passwordSelector, submitSelector } = request.userData;

            try {
                await page.waitForSelector(usernameSelector, { timeout: 10000 });
                await page.fill(usernameSelector, username);
                await page.fill(passwordSelector, password);
                await Promise.all([
                    page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
                    page.click(submitSelector),
                ]);

                if (page.url().includes('login.xhtml')) {
                    throw new Error('Login failed. Still on login page.');
                }

                log.info('✅ Login réussi');
            } catch (err) {
                log.error(`❌ Erreur de login : ${err.message}`);
                throw err;
            }
        } else {
            const title = await page.title();
            const content = await page.content();

            await Actor.pushData({
                url: request.url,
                title,
                content,
            });
        }
    },

    preNavigationHooks: [
        async ({ gotoOptions }) => {
            gotoOptions.waitUntil = 'domcontentloaded';
        },
    ],
});

await crawler.run(startUrls);

await Actor.exit();
