export interface CoinData {
    id: string;
    symbol: string;
    name: string;
    image: string;
    market_cap_rank: number;
    current_price: number;
    price_change_percentage_24h: number;
    market_cap?: number;
}

export interface CoinsPayload {
    coins: CoinData[];
}

export interface SingleCoinPayload {
    coin: CoinData;
}
