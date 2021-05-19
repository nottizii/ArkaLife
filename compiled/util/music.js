const ytsr = require('ytsr');
class MusicManager {
    constructor(options) {
        this.options = options ?? {};
    }
    async search(query) {
        const searchResults = await ytsr(query, { limit: 1 });
        return searchResults.items[0].url;
    }
}
module.exports = { MusicManager };
