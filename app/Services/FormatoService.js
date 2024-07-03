'use strict'

class FormatoService {

    async fechaNowFormat() {
        const fechaNow = new Date();

        const yy = String(fechaNow.getFullYear());
        const mm = String(fechaNow.getMonth() + 1).padStart(2, '0');
        const dd = String(fechaNow.getDate()).padStart(2, '0');

        return `${yy}-${mm}-${dd}`;
    }
}

module.exports = new FormatoService();