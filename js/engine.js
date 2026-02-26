
class Engine {

    static data = {};

    static async load() {
        const res = await fetch("data/content.json");
        this.data = await res.json();
    }

    static resolve(path) {
        return path.split('.').reduce((o, k) => o?.[k], this.data);
    }

    static bind() {

        document.querySelectorAll("[data-bind]").forEach(el => {
            const value = this.resolve(el.dataset.bind);
            if (value) el.textContent = value;
        });

        document.querySelectorAll("[data-bind-src]").forEach(el => {
            const value = this.resolve(el.dataset.bindSrc);
            if (value) el.src = value;
        });

        document.querySelectorAll("[data-repeat]").forEach(container => {

            const items = this.resolve(container.dataset.repeat);

            const template = container.innerHTML;

            container.innerHTML = "";

            items.forEach(item => {

                let html = template;

                Object.keys(item).forEach(key => {
                    html = html.replaceAll(`{{${key}}}`, item[key]);
                });

                container.innerHTML += html;

            });

        });

    }

}

document.addEventListener("DOMContentLoaded", async () => {

    await Engine.load();

    Engine.bind();

});
