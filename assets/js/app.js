// ============================================
// CRYPTO//TERMINAL - Vue 3 Application
// ============================================

const { createApp } = Vue;

// Favorites Manager using localStorage
class FavouritesManager {
    constructor() {
        this.storageKey = 'crypto_favourites';
        this.list = this.load();
    }

    load() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : [];
    }

    save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.list));
    }

    toggle(symbol) {
        const index = this.list.indexOf(symbol);
        if (index > -1) {
            this.list.splice(index, 1);
        } else {
            this.list.push(symbol);
        }
        this.save();
    }

    check(symbol) {
        return this.list.includes(symbol);
    }
}

// Create app instance
const app = createApp({
    data() {
        return {
            coins: [],
            favourited_tab: false,
            exchange_rate: null,
            currency: 'usd',
            currency_symbol: '$',
            currentTime: '',
            modalOpen: false,
            selectedCoin: null,
            chart: null,
            favouritesManager: new FavouritesManager()
        };
    },

    computed: {
        filtered() {
            let coinList = this.coins;

            // Filter by favourites if tab is active
            if (this.favourited_tab) {
                coinList = coinList.filter(coin => coin.favourite);
            }

            // Apply currency conversion
            if (this.currency !== 'usd' && this.exchange_rate) {
                coinList = this.convertCurrency(coinList);
            }

            return coinList;
        }
    },

    methods: {
        // Fetch market data
        async fetchMarketData() {
            try {
                const response = await fetch(
                    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true&price_change_percentage=24h'
                );
                const data = await response.json();

                this.coins = data.map(coin => ({
                    ...coin,
                    favourite: this.favouritesManager.check(coin.symbol)
                }));
            } catch (error) {
                console.error('Error fetching market data:', error);
            }
        },

        // Fetch exchange rates
        async fetchExchangeRates() {
            try {
                const response = await fetch('https://api.coingecko.com/api/v3/exchange_rates');
                const data = await response.json();
                this.exchange_rate = data.rates;
            } catch (error) {
                console.error('Error fetching exchange rates:', error);
            }
        },

        // Update current time
        updateTime() {
            const now = new Date();
            this.currentTime = now.toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        },

        // Add/remove from favourites
        addToFavourite(index) {
            const coin = this.filtered[index];
            this.favouritesManager.toggle(coin.symbol);
            coin.favourite = !coin.favourite;
        },

        // Change currency
        selectCurrency(event) {
            this.currency = event.target.value;
            this.currency_symbol = this.exchange_rate[this.currency].unit;
        },

        // Convert currency
        convertCurrency(coins) {
            if (!this.exchange_rate) return coins;

            const fromRate = this.exchange_rate.usd.value;
            const toRate = this.exchange_rate[this.currency].value;

            return coins.map(coin => ({
                ...coin,
                current_price: coin.symbol === this.currency ? 1 : (coin.current_price / fromRate * toRate),
                total_volume: coin.total_volume / fromRate * toRate,
                market_cap: coin.market_cap / fromRate * toRate,
                high_24h: coin.high_24h / fromRate * toRate,
                low_24h: coin.low_24h / fromRate * toRate
            }));
        },

        // Format number with commas
        formatNumber(value) {
            if (!value) return '0';
            const num = parseFloat(value);

            if (num >= 1) {
                return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            } else if (num >= 0.01) {
                return num.toFixed(4);
            } else {
                return num.toFixed(8);
            }
        },

        // Format volume (shorter notation)
        formatVolume(value) {
            if (!value) return '0';
            const num = parseFloat(value);

            if (num >= 1e9) {
                return (num / 1e9).toFixed(2) + 'B';
            } else if (num >= 1e6) {
                return (num / 1e6).toFixed(2) + 'M';
            } else if (num >= 1e3) {
                return (num / 1e3).toFixed(2) + 'K';
            }
            return num.toFixed(2);
        },

        // Format price change
        formatPriceChange(value) {
            if (!value) return '0.00%';
            const num = parseFloat(value);
            const sign = num >= 0 ? '+' : '';
            return sign + num.toFixed(2) + '%';
        },

        // Get price change class
        getPriceChangeClass(coin) {
            if (!coin || !coin.price_change_percentage_24h) return '';
            return coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative';
        },

        // Get sparkline color based on price change
        getSparklineColor(coin) {
            if (!coin || !coin.price_change_percentage_24h) return '#888888';
            return coin.price_change_percentage_24h >= 0 ? '#00ff41' : '#ff0055';
        },

        // Generate SVG path for sparkline
        generateSparklinePath(prices) {
            if (!prices || prices.length === 0) return '';

            const width = 150;
            const height = 40;
            const padding = 2;

            const min = Math.min(...prices);
            const max = Math.max(...prices);
            const range = max - min || 1;

            const points = prices.map((price, index) => {
                const x = (index / (prices.length - 1)) * width;
                const y = height - padding - ((price - min) / range) * (height - padding * 2);
                return `${x},${y}`;
            });

            // Create path: move to first point, then draw lines
            return `M ${points[0]} L ${points.slice(1).join(' L ')} L ${width},${height} L 0,${height} Z`;
        },

        // Open modal with coin details
        openModal(coin) {
            this.selectedCoin = coin;
            this.modalOpen = true;
            this.$nextTick(() => {
                this.renderChart(coin);
            });
        },

        // Close modal
        closeModal() {
            this.modalOpen = false;
            if (this.chart) {
                this.chart.destroy();
                this.chart = null;
            }
        },

        // Render Chart.js chart in modal
        renderChart(coin) {
            const canvas = document.getElementById('detailChart');
            if (!canvas) return;

            const ctx = canvas.getContext('2d');

            // Destroy existing chart
            if (this.chart) {
                this.chart.destroy();
            }

            const prices = coin.sparkline_in_7d.price;
            const labels = prices.map((_, i) => '');

            const gradient = ctx.createLinearGradient(0, 0, 0, 250);
            gradient.addColorStop(0, this.getSparklineColor(coin) + '40');
            gradient.addColorStop(1, this.getSparklineColor(coin) + '00');

            this.chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: '7 Day Price',
                        data: prices,
                        borderColor: this.getSparklineColor(coin),
                        backgroundColor: gradient,
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 0,
                        pointHoverRadius: 4,
                        pointHoverBackgroundColor: this.getSparklineColor(coin),
                        pointHoverBorderColor: '#ffffff',
                        pointHoverBorderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        intersect: false,
                        mode: 'index'
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            enabled: true,
                            backgroundColor: '#1a1a1a',
                            titleColor: '#ffffff',
                            bodyColor: '#ffffff',
                            borderColor: this.getSparklineColor(coin),
                            borderWidth: 2,
                            padding: 12,
                            displayColors: false,
                            callbacks: {
                                label: (context) => {
                                    return this.currency_symbol + this.formatNumber(context.parsed.y);
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            display: false
                        },
                        y: {
                            display: true,
                            grid: {
                                color: '#2a2a2a',
                                drawBorder: false
                            },
                            ticks: {
                                color: '#888888',
                                font: {
                                    family: 'IBM Plex Mono, monospace',
                                    size: 10
                                },
                                callback: (value) => {
                                    return this.currency_symbol + this.formatNumber(value);
                                }
                            }
                        }
                    }
                }
            });
        }
    },

    mounted() {
        // Initialize
        this.fetchMarketData();
        this.fetchExchangeRates();
        this.updateTime();

        // Update time every second
        setInterval(() => {
            this.updateTime();
        }, 1000);

        // Refresh market data every 60 seconds
        setInterval(() => {
            this.fetchMarketData();
        }, 60000);

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modalOpen) {
                this.closeModal();
            }
        });
    }
});

// Mount the app
app.mount('#app');
