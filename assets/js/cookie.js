export class Cookie {
    constructor(cookie_name, expire_days) {
        this.cookie_name = cookie_name;
        this.expire_days = expire_days;
    }

    access() {
        var name = this.cookie_name + "=";
        var cookie_list = document.cookie.split(';');
        for (var i = 0; i < cookie_list.length; i++) {
            var temp = cookie_list[i].trim();
            if (temp.indexOf(name) == 0)
                return temp.substring(name.length, temp.length);
        }
        return "";
    }

    update(value) {
        let date = new Date();
        date.setTime(date.getTime() + (this.expire_days * 24 * 60 * 60 * 1000));
        document.cookie = `${this.cookie_name}=${value};expires=${date.toGMTString()}`;
    }
}