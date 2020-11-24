import { Cookie } from "./cookie.js";

export class Favourite {
    constructor() {
        this.cookie = new Cookie("favourites", 1);
        this.list = this.getFavourites();
    }

    getFavourites() {
        let favourites = this.cookie.access();
        if (favourites == "") {
            return []
        } else {
            return favourites.split(",")
        }
    }

    check(value) {
        return this.list.includes(value)
    }

    add(value) {
        if (this.list.includes(value)) {
            this.list.splice(this.list.indexOf(value), 1)
        } else {
            this.list.push(value);
        }
        this.cookie.update(this.list.join(","));
    }
}