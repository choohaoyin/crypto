import { Favourite } from "./favourite.js";
import { Graph } from "./graph.js";
import { Modal } from "./modal.js";

const sparkline_dimension = {
    "width": 150,
    "height": 50
}

let favourite = new Favourite();
let graph = new Graph(document.getElementById('graph').getContext('2d'), sparkline_dimension.width, sparkline_dimension.height);
let modal = new Modal();

var dashboard = new Vue({
    el: "#dashboard",
    data() {
        return {
            coins: null,
            favourited_tab: false,
            exchange_rate: null,
            currency: "usd",
            currency_symbol: "$",
            sparkline: sparkline_dimension
        }
    },
    methods: {
        addToFavourite: function (row) {
            let row_id = row.target.parentNode.parentNode.id;
            favourite.add(this.filtered[row_id].symbol);
            this.filtered[row_id].favourite = !this.filtered[row_id].favourite;
        },
        selectCurrency: function (event) {
            let currency = event.target.value;
            this.currency = currency;
            this.currency_symbol = this.exchange_rate[currency].unit;
        },
        openModal: function (event) {
            let id = event.target.closest("tr").id;
            let row = this.filtered[id];
            let row_data = {
                "name": row.name,
                "data": row.sparkline_in_7d.price,
                "price": this.formatNumber(row.current_price),
                "volume": this.formatNumber(row.total_volume, 0),
                "currency": this.currency_symbol
            }
            graph.generate(row_data);
            modal.toggleModal(row_data);
        },
        formatNumber: function (value, dp = null) {
            if (dp != null) {
                return value.toFixed(dp).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
            } else {
                return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
            }
        }
    },
    computed: {
        filtered() {
            if (this.favourited_tab) {
                if (this.currency != "usd") {
                    let filtered_list = this.coins.filter(coin => {
                        return favourite.list.includes(coin.symbol);
                    });
                    return exchange(filtered_list, this.exchange_rate, this.currency)
                } else {
                    return this.coins.filter(coin => {
                        return favourite.list.includes(coin.symbol);
                    })
                }
            } else {
                if (this.currency != "usd") {
                    return exchange(this.coins, this.exchange_rate, this.currency)
                } else {
                    return this.coins;
                }
            }
        }
    },
    mounted() {
        axios
            .get('https://api.coingecko.com/api/v3/exchange_rates')
            .then(response => (this.exchange_rate = response.data.rates)),
        axios
            .get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true')
            .then(function (response) {
                let data = response.data;
                for (var coin of data) {
                    coin["favourite"] = favourite.check(coin.symbol);
                    coin["sparkline"] = graph.normalize(coin["sparkline_in_7d"]["price"]).join(" ");
                }
                dashboard.coins = data;
            })
    }
})

function exchange(input_coins, exchange_rate, currency) {
    const from_rate = exchange_rate["usd"]["value"];
    const to_rate = exchange_rate[currency]["value"];
    let exchanged = []
    for (var c of input_coins) {
        let exchanged_coin = {
            ...c
        }
        if (c.symbol != currency) {
            exchanged_coin.current_price = exchanged_coin.current_price / from_rate * to_rate;
            exchanged_coin.total_volume = exchanged_coin.total_volume / from_rate * to_rate;
        } else {
            exchanged_coin.current_price = 1
            exchanged_coin.total_volume = exchanged_coin.total_volume / from_rate * to_rate;
        }
        exchanged.push(exchanged_coin)
    }
    return exchanged;
}